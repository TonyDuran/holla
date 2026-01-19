//TODO: Completely subject to change.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

interface LoginResponse {
  token: string
  userId: string
}

interface FriendData {
  id: string
  username: string
  online: boolean
}

interface UserSearchResult {
  id: string
  username: string
}

let authToken: string = localStorage.getItem('authToken') || ''

export const apiClient = {
  setAuthToken(token: string) {
    authToken = token
    localStorage.setItem('authToken', token)
  },

  getAuthToken() {
    return authToken
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  },

  async login(username: string, password: string): Promise<LoginResponse> {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    this.setAuthToken(data.token)
    return data
  },

  async signup(username: string, password: string): Promise<LoginResponse> {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    this.setAuthToken(data.token)
    return data
  },

  async getFriends(): Promise<FriendData[]> {
    return this.request('/friends')
  },

  async addFriend(friendId: string): Promise<void> {
    await this.request(`/friends/${friendId}`, {
      method: 'POST',
    })
  },

  async removeFriend(friendId: string): Promise<void> {
    await this.request(`/friends/${friendId}`, {
      method: 'DELETE',
    })
  },

  async searchUsers(query: string): Promise<UserSearchResult[]> {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`)
  },
}
