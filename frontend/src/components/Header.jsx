import { Link } from 'react-router-dom'
import './Header.css'

const Header = ({ apiStatus }) => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          WayVote
        </Link>
        <nav>
          <ul className="nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/api-test">API Test</Link>
            </li>
          </ul>
        </nav>
        <div className="api-status">
          <span className={`status-indicator ${apiStatus}`}></span>
          <span className="status-text">API: {apiStatus}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
