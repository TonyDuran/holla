import { useState } from 'react'
import LoginForm from './components/LoginForm'
import FriendList from './components/FriendList'
import FriendSearch from './components/FriendSearch'
import './styles/main.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogin = (user: string) => {
    setUsername(user)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="main-container">
          <div className="sidebar">
            <div className="user-info">
              <p className="username">{username}</p>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <FriendSearch />
            <FriendList />
          </div>
          <div className="chat-area">
            <p>Add a friend</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
