CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- main account table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  oauth_provider TEXT,
  display_name TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure at least one auth method exists
  CHECK (
    password_hash is NOT NULL
    OR oauth_provider IS NOT NULL
  )
);

-- Relationship status enum
CREATE TYPE relationship_status as ENUM(
  'pending',
  'accepted',
  'blocked'
);

-- Buddy List
CREATE TABLE user_relationships (
    user1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Who initiated the request (required for correct semantics)
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    status relationship_status NOT NULL,
    updated_at timestamptz not null default now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user1, user2),

    -- Enforce canonical ordering to prevent duplicate mirrors
    -- only need one relationship, prevent the duplicate of doing
    -- user1 A user2 B && user1 B user 2 A (only need one)
    CHECK (user1 < user2),
    CHECK (requested_by = user1 OR requested_by = user2)
);

-- Indexes
CREATE INDEX idx_user_relationships_user1
  ON user_relationships(user1);

CREATE INDEX idx_user_relationships_user2
  ON user_relationships(user2);

CREATE INDEX idx_users_username_trgm
  ON users USING gin (username gin_trgm_ops);

CREATE INDEX idx_users_email_trgm
  ON users USING gin (email gin_trgm_ops);
