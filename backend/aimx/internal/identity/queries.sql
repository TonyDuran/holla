-- =========================
-- Users
-- =========================

-- name: CreateUser :one
INSERT INTO users (
  username,
  email,
  password_hash,
  oauth_provider,
  display_name
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING id;

-- name: GetUserByID :one
SELECT
  id,
  username,
  email,
  display_name
FROM users
WHERE id = $1;

-- name: GetUserByUsername :one
SELECT
  id,
  username,
  email,
  display_name
FROM users
WHERE username = $1;

-- name: GetUserAuthByUsername :one
SELECT
  id,
  username,
  password_hash,
  oauth_provider
FROM users
WHERE username = $1;

-- =========================
-- User Search
-- =========================

-- name: SearchUsersByUsername :many
SELECT
  id,
  username,
  email,
  display_name
FROM users
WHERE username ILIKE '%' || $1 || '%'
ORDER BY username
LIMIT $2 OFFSET $3;

-- name: SearchUsersByEmail :many
SELECT
  id,
  username,
  email,
  display_name
FROM users
WHERE email ILIKE '%' || $1 || '%'
ORDER BY email
LIMIT $2 OFFSET $3;

-- =========================
-- Buddy / Relationships
-- =========================

-- name: SendBuddyRequest :exec
INSERT INTO user_relationships (
  user1,
  user2,
  status,
  requested_by
) VALUES (
  LEAST(sqlc.arg(requester), sqlc.arg(target)),
  GREATEST(sqlc.arg(requester), sqlc.arg(target)),
  'pending',
  sqlc.arg(requester)
)
ON CONFLICT DO NOTHING;

-- name: AcceptBuddyRequest :exec
UPDATE user_relationships
SET status = 'accepted',
    updated_at = now()
WHERE user1 = LEAST($1, $2)
  AND user2 = GREATEST($1, $2)
  AND status = 'pending';

-- name: BlockUser :exec
UPDATE user_relationships
SET status = 'blocked',
    updated_at = now()
WHERE user1 = LEAST($1, $2)
  AND user2 = GREATEST($1, $2);

-- name: RemoveBuddy :exec
DELETE FROM user_relationships
WHERE user1 = LEAST($1, $2)
  AND user2 = GREATEST($1, $2);

-- =========================
-- Buddy Lists
-- =========================

-- name: ListBuddies :many
SELECT
  u.id,
  u.username,
  u.display_name
FROM user_relationships r
JOIN users u
  ON u.id = CASE
    WHEN r.user1 = $1 THEN r.user2
    ELSE r.user1
  END
WHERE (r.user1 = $1 OR r.user2 = $1)
  AND r.status = 'accepted'
ORDER BY u.username;

-- name: ListIncomingBuddyRequests :many
SELECT
  u.id,
  u.username,
  u.display_name
FROM user_relationships r
JOIN users u
  ON u.id = r.requested_by
WHERE (r.user1 = $1 OR r.user2 = $1)
  AND r.status = 'pending'
  AND r.requested_by <> $1
ORDER BY r.created_at;

-- name: ListOutgoingBuddyRequests :many
SELECT
  u.id,
  u.username,
  u.display_name
FROM user_relationships r
JOIN users u
  ON u.id = CASE
    WHEN r.user1 = $1 THEN r.user2
    ELSE r.user1
  END
WHERE r.requested_by = $1
  AND r.status = 'pending'
ORDER BY r.created_at;
