import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>Welcome to WayVote</h1>
          <p>
            A modern, secure, and transparent democratic voting platform. 
            Empowering communities to make decisions together through technology.
          </p>
          <div className="hero-buttons">
            <Link to="/api-test" className="cta-button primary">
              Test API
            </Link>
            <Link to="/about" className="cta-button secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🗳️</div>
            <h3>Secure Voting</h3>
            <p>
              Advanced encryption and blockchain technology ensure that every vote 
              is secure, anonymous, and tamper-proof.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Accessible</h3>
            <p>
              Vote from anywhere, anytime. Our platform works on all devices 
              and is designed to be accessible to everyone.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Transparent</h3>
            <p>
              Real-time results and complete audit trails provide full 
              transparency in the voting process.
            </p>
          </div>
        </div>

        <div className="stats-section">
          <h2>Platform Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">256-bit</div>
              <div className="stat-label">Encryption</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Auditable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
