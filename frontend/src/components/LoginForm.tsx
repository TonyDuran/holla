import { useState } from 'react'
import { apiClient } from '../api/client'
import Logo from '../assets/images/logo.svg'

interface LoginFormProps {
  onLogin: (username: string) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        await apiClient.signup(username, password)
      } else {
        await apiClient.login(username, password)
      }
      onLogin(username)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={Logo} alt="holla logo" />
        <p className="login-tagline">Welcome to Nostalgia! An AIM Clone for fun!</p>
      </div>
      <div className="login-box">
        <h1>Holla!</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="toggle-auth">
          {isSignup ? 'Have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="link-button"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
