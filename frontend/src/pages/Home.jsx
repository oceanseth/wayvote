import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import './Home.css'

const WEIGHTS = [
  { label: 'Critical thinking', value: 10 },
  { label: 'Domain expertise', value: 7 },
  { label: 'Authenticity', value: 5 },
  { label: 'Popularity', value: 1 },
]

const PRINCIPLES = [
  {
    icon: 'sliders',
    title: 'Control your algorithm',
    body: 'Take control of ranking on Reddit and the other sites you visit. Content is ordered by criteria you set, not by criteria chosen for you.',
  },
  {
    icon: 'scale',
    title: 'Weighted voting',
    body: 'Votes carry weight drawn from self-reported and measured metrics — expertise, critical thinking, authenticity. You decide whose judgment counts.',
  },
  {
    icon: 'eye',
    title: 'Transparent rankings',
    body: 'No hidden logic. See exactly why a post sits where it does and which votes moved it there.',
  },
]

const PROBLEMS = [
  {
    icon: 'alert',
    title: 'Rage bait',
    body: 'Feeds surface what provokes you, because provocation holds attention longer than agreement does.',
  },
  {
    icon: 'chip',
    title: 'Bot manipulation',
    body: 'Fake accounts move rankings at scale, and the platform gives you no way to discount their votes.',
  },
  {
    icon: 'lock',
    title: 'Hidden logic',
    body: 'The ordering of what you read is decided by a system you cannot inspect, question, or appeal.',
  },
  {
    icon: 'currency',
    title: 'Advertiser priority',
    body: 'Ranking is tuned toward advertiser outcomes. Your wellbeing is not the objective function.',
  },
]

const Home = () => {
  const maxWeight = Math.max(...WEIGHTS.map((w) => w.value))

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Browser extension &middot; Starting with Reddit</p>
            <h1>The ranking algorithm should answer to the people reading it.</h1>
            <p className="lead">
              WayVote is a browser extension that puts content ranking back under your
              control. When you vote, your metrics let others weigh that vote according to
              their own standards — and you can do the same with theirs.
            </p>
            <div className="hero-actions">
              <Link to="/about" className="btn btn-primary">
                How it works
                <Icon name="arrowRight" size={16} />
              </Link>
              <a
                href="https://www.youtube.com/watch?v=T-tzHdSY3n0"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Icon name="play" size={16} />
                Watch the vision
              </a>
            </div>
            <p className="hero-note">
              Open source &middot; MIT licensed &middot;{' '}
              <Link to="/api-test">Public ranking API</Link>
            </p>
          </div>

          <aside className="weights-panel" aria-labelledby="weights-title">
            <div className="weights-head">
              <h2 id="weights-title">Your ranking weights</h2>
              <span className="weights-tag">Illustrative</span>
            </div>
            <ul className="weights-list">
              {WEIGHTS.map(({ label, value }) => (
                <li key={label}>
                  <span className="weights-label">{label}</span>
                  <span className="weights-meter" aria-hidden="true">
                    <span style={{ width: `${(value / maxWeight) * 100}%` }}></span>
                  </span>
                  <span className="weights-value">{value}</span>
                </li>
              ))}
            </ul>
            <p className="weights-foot">
              <Icon name="check" size={15} />
              Rankings are recomputed against these weights every time you load a page.
            </p>
          </aside>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The platform</p>
            <h2>Three commitments, applied to every feed you read</h2>
          </div>
          <ol className="principles">
            {PRINCIPLES.map(({ icon, title, body }, i) => (
              <li key={title} className="principle">
                <span className="principle-num">{String(i + 1).padStart(2, '0')}</span>
                <Icon name={icon} size={26} className="principle-icon" />
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--ink quote-band">
        <div className="container">
          <figure className="pull-quote">
            <Icon name="quote" size={40} className="quote-glyph" />
            <blockquote>
              There&rsquo;s a difference between curation and cultivation. Cultivation means
              you&rsquo;re combining two things together to create something new&hellip; If
              users were given power to cultivate and curate their feeds themselves, they
              would be much happier users.
            </blockquote>
            <figcaption>
              Seth Caldwell,{' '}
              <a
                href="https://www.youtube.com/watch?v=T-tzHdSY3n0"
                target="_blank"
                rel="noopener noreferrer"
              >
                on the case for reader-controlled feeds
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The problem</p>
            <h2>What today&rsquo;s feeds are actually optimized for</h2>
            <p>
              Every major platform ranks content with a system its readers cannot see. The
              consequences are consistent across all of them.
            </p>
          </div>
          <div className="problems">
            {PROBLEMS.map(({ icon, title, body }) => (
              <article key={title} className="problem">
                <Icon name={icon} size={22} className="problem-icon" />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-band">
        <div className="container closing-inner">
          <div>
            <h2>Read the full platform</h2>
            <p>
              How weighted voting works, what metrics exist, and what WayVote will and
              will not do with them.
            </p>
          </div>
          <div className="closing-actions">
            <Link to="/about" className="btn btn-inverse">
              The Platform
              <Icon name="arrowRight" size={16} />
            </Link>
            <Link to="/contact" className="btn btn-ghost-inverse">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
