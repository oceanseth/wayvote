import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>Take Control of Your Content</h1>
          <p>
            WayVote is a browser plugin that gives you control over ranking algorithms 
            on the sites you visit. When you upvote content, your metrics allow others 
            to weigh your votes according to their preferences.
          </p>
          <div className="hero-buttons">
            <Link to="/api-test" className="cta-button primary">
              Test API
            </Link>
            <a 
              href="https://www.youtube.com/watch?v=T-tzHdSY3n0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-button secondary"
            >
              Watch the Vision
            </a>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Control Your Algorithm</h3>
            <p>
              Take control of ranking algorithms on Reddit and other sites. 
              See content ranked by your own criteria, not corporate interests.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Weighted Voting</h3>
            <p>
              Your votes are weighted based on your metrics - intelligence, 
              expertise, authenticity. Others can choose whose votes matter to them.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Transparent Rankings</h3>
            <p>
              No more hidden algorithms. See exactly why content is ranked 
              the way it is and who's votes are influencing the results.
            </p>
          </div>
        </div>

        <div className="stats-section">
          <h2>The Problem We're Solving</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">Hidden</div>
              <div className="stat-label">Algorithms</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Bot</div>
              <div className="stat-label">Manipulation</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Echo</div>
              <div className="stat-label">Chambers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Corporate</div>
              <div className="stat-label">Control</div>
            </div>
          </div>
        </div>

        <div className="problem-section">
          <h2>Current Social Media Problems</h2>
          <div className="problem-grid">
            <div className="problem-item">
              <h3>😡 Rage Bait</h3>
              <p>Algorithms show you content that makes you angry to maximize engagement</p>
            </div>
            <div className="problem-item">
              <h3>🤖 Bot Votes</h3>
              <p>Fake accounts and bots manipulate rankings without detection</p>
            </div>
            <div className="problem-item">
              <h3>🔒 Hidden Logic</h3>
              <p>You can't see why content is ranked the way it is</p>
            </div>
            <div className="problem-item">
              <h3>💰 Advertiser Control</h3>
              <p>Your feed is optimized for advertiser profits, not your wellbeing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
