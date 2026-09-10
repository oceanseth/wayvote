import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Mark from './Mark'
import Icon from './Icon'
import './Header.css'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'The Platform' },
  { to: '/api-test', label: 'API Console' },
  { to: '/contact', label: 'Contact' },
]

const Header = () => {
  const [open, setOpen] = useState(false)

  // Collapse the mobile menu after any navigation.
  const close = () => setOpen(false)

  return (
    <header className="masthead">
      <div className="masthead-strip">
        <div className="container masthead-strip-inner">
          <p>Algorithmic transparency for public discourse</p>
          <a
            href="https://github.com/oceanseth/wayvote"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="code" size={14} />
            Open source
          </a>
        </div>
      </div>

      <div className="masthead-bar">
        <div className="container masthead-inner">
          <Link to="/" className="wordmark" onClick={close}>
            <Mark size={36} />
            <span className="wordmark-text">
              WayVote
              <small>Reader-controlled ranking</small>
            </span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`nav-toggle-bars ${open ? 'is-open' : ''}`} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <nav
            id="primary-nav"
            className={`primary-nav ${open ? 'is-open' : ''}`}
            aria-label="Primary"
          >
            <ul>
              {NAV.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={close}
                    className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn btn-primary masthead-cta" onClick={close}>
              How it works
              <Icon name="arrowRight" size={16} />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
