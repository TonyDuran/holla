import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

interface Friend {
  id: string
  username: string
  online: boolean
}

export default function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFriends = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getFriends()
        setFriends(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load friends')
      } finally {
        setLoading(false)
      }
    }

    loadFriends()
  }, [])

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await apiClient.removeFriend(friendId)
      setFriends(friends.filter((f) => f.id !== friendId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove friend')
    }
  }

  if (loading) return <div className="friend-list"><p>Loading friends...</p></div>
  if (error) return <div className="friend-list"><p className="error">{error}</p></div>

  return (
    <div className="friend-list">
      <h3>Friends</h3>
      {friends.length === 0 ? (
        <p className="empty">No friends yet</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} className={`friend-item ${friend.online ? 'online' : 'offline'}`}>
              <div className="friend-info">
                <span className="friend-name">{friend.username}</span>
                <span className="status-indicator">{friend.online ? '●' : '○'}</span>
              </div>
              <button
                onClick={() => handleRemoveFriend(friend.id)}
                className="remove-btn"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
