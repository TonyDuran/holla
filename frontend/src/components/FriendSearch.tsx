import { useState } from 'react'
import { apiClient } from '../api/client'

interface SearchResult {
  id: string
  username: string
}

export default function FriendSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setError('')

    if (value.trim().length < 2) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      const data = await apiClient.searchUsers(value)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFriend = async (friendId: string) => {
    try {
      await apiClient.addFriend(friendId)
      setResults(results.filter((r) => r.id !== friendId))
      setQuery('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add friend')
    }
  }

  return (
    <div className="friend-search">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
      {error && <p className="error">{error}</p>}
      {results.length > 0 && (
        <div className="search-results">
          {results.map((user) => (
            <div key={user.id} className="search-result">
              <span>{user.username}</span>
              <button
                onClick={() => handleAddFriend(user.id)}
                className="add-btn"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
      {loading && <p className="loading">Searching...</p>}
    </div>
  )
}
