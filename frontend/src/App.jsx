import { Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import ApiTest from './components/ApiTest'
import Mark from './components/Mark'
import './App.css'

const STATUS_LABEL = {
  checking: 'Checking',
  connected: 'Operational',
  error: 'Unavailable',
}

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
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main className="main-content" id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-wordmark">
                <Mark size={30} />
                <span>WayVote</span>
              </Link>
              <p className="footer-tagline">
                Algorithmic transparency for public discourse. A browser extension that
                puts ranking under the control of the people reading.
              </p>
            </div>

            <nav className="footer-col" aria-label="Site">
              <h2 className="footer-heading">Site</h2>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">The Platform</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>

            <nav className="footer-col" aria-label="Developers">
              <h2 className="footer-heading">Developers</h2>
              <ul>
                <li>
                  <Link to="/api-test">API console</Link>
                </li>
                <li>
                  <a href="https://api.wayvote.org/">api.wayvote.org</a>
                </li>
                <li>
                  <a
                    href="https://github.com/oceanseth/wayvote"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source on GitHub
                  </a>
                </li>
              </ul>
            </nav>

            <div className="footer-col">
              <h2 className="footer-heading">Contact</h2>
              <ul>
                <li>
                  <a href="mailto:contact@wayvote.org">contact@wayvote.org</a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=T-tzHdSY3n0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    The vision (video)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bar">
            <p>&copy; {new Date().getFullYear()} WayVote. Released under the MIT License.</p>
            <p className="footer-status">
              <span className={`status-dot ${apiStatus}`} aria-hidden="true"></span>
              API&nbsp;status:&nbsp;<strong>{STATUS_LABEL[apiStatus] ?? apiStatus}</strong>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
