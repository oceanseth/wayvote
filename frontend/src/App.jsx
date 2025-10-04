import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import ApiTest from './components/ApiTest'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    // Test API connection on app load
    testApiConnection()
  }, [])

  const testApiConnection = async () => {
    try {
      const response = await fetch('https://api.wayvote.org/')
      if (response.ok) {
        setApiStatus('connected')
      } else {
        setApiStatus('error')
      }
    } catch (error) {
      console.error('API connection test failed:', error)
      setApiStatus('error')
    }
  }

  return (
    <div className="App">
      <Header apiStatus={apiStatus} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 WayVote. All rights reserved.</p>
          <p>API Status: <span className={`status ${apiStatus}`}>{apiStatus}</span></p>
        </div>
      </footer>
    </div>
  )
}

export default App
