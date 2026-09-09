import Icon from '../components/Icon'
import './About.css'

const SECTIONS = [
  { id: 'mission', label: 'Mission' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'use-cases', label: 'Use cases' },
  { id: 'vision', label: 'The vision' },
]

const MECHANICS = [
  {
    icon: 'layers',
    title: 'Browser extension',
    body: 'Install the extension and it takes over ranking on Reddit and the other sites you visit — no account migration, no new network to join.',
  },
  {
    icon: 'scale',
    title: 'Weighted voting',
    body: 'Votes are weighted by user metrics: intelligence measures, demonstrated expertise, authenticity signals. Weighting is yours to configure.',
  },
  {
    icon: 'eye',
    title: 'Transparent rankings',
    body: 'Every ordering is inspectable. You can see why a post ranks where it does and which votes carried it there.',
  },
  {
    icon: 'sliders',
    title: 'Custom filters',
    body: 'Build echo chambers deliberately and leave them at will. Toggle between ranking criteria instantly rather than being locked into one.',
  },
]

const CAPABILITIES = [
  'Control ranking algorithms on Reddit and other social platforms',
  'Weight votes by intelligence, expertise, and authenticity metrics',
  'Discount votes from likely bots and low-quality accounts',
  'Create custom echo chambers you can enter and exit at will',
  'Inspect transparent rankings instead of hidden algorithms',
  'Combine self-reported and measured user metrics',
  'Open source and community-driven development',
]

const USE_CASES = [
  {
    icon: 'shield',
    title: 'Bot detection',
    body: 'Discount votes from likely bots and fake accounts to see what the authentic community actually thinks.',
  },
  {
    icon: 'target',
    title: 'Intelligence-weighted ranking',
    body: 'See how a thread reorders when weighted toward critical-thinking and reasoning scores.',
  },
  {
    icon: 'users',
    title: 'Expertise filtering',
    body: 'Rank by people with relevant standing — engineers on a systems thread, clinicians on a medical one.',
  },
  {
    icon: 'sliders',
    title: 'Echo chamber control',
    body: 'Choose your chamber knowingly: by political outlook, discipline, or any criterion you define — then step back out.',
  },
]

const VISION_POINTS = [
  'See transparent rankings instead of hidden algorithms',
  'Weight votes based on user metrics and authenticity',
  'Create custom echo chambers you can enter and exit at will',
  'Filter out bot manipulation and low-quality content',
  'Take control of your own content consumption',
]

const About = () => (
  <div className="about">
    <div className="page-head">
      <div className="container">
        <p className="eyebrow eyebrow--inverse">The platform</p>
        <h1>Ranking is a governance question.</h1>
        <p className="lead">
          WayVote is a browser extension that gives readers authority over how content is
          ordered on the sites they already use — and over whose judgment counts in that
          ordering.
        </p>
      </div>
    </div>

    <div className="container doc">
      <nav className="doc-nav" aria-label="On this page">
        <h2 className="doc-nav-heading">On this page</h2>
        <ul>
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="doc-body">
        <section id="mission" className="doc-section">
          <p className="eyebrow">01 &mdash; Mission</p>
          <h2>Readers, not platforms, should decide what rises</h2>
          <p>
            WayVote exists to give people authority over their own content consumption. You
            should be able to decide how content is ranked and whose votes matter to you.
            That decision currently belongs to a handful of corporate ranking systems, and
            it should not.
          </p>
          <p>
            Inspired by{' '}
            <a
              href="https://www.youtube.com/watch?v=T-tzHdSY3n0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Seth Caldwell&rsquo;s vision
            </a>
            , we are building tools that let you construct echo chambers deliberately and
            leave them at will, discount bot manipulation, and read rankings you can
            actually inspect.
          </p>
        </section>

        <section id="how-it-works" className="doc-section">
          <p className="eyebrow">02 &mdash; How it works</p>
          <h2>Four moving parts</h2>
          <div className="mechanics">
            {MECHANICS.map(({ icon, title, body }) => (
              <article key={title} className="mechanic">
                <Icon name={icon} size={24} className="mechanic-icon" />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="capabilities" className="doc-section">
          <p className="eyebrow">03 &mdash; Capabilities</p>
          <h2>What the extension does today</h2>
          <ul className="checklist">
            {CAPABILITIES.map((item) => (
              <li key={item}>
                <Icon name="check" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="use-cases" className="doc-section">
          <p className="eyebrow">04 &mdash; Use cases</p>
          <h2>Four ways people use weighted ranking</h2>
          <div className="use-cases">
            {USE_CASES.map(({ icon, title, body }) => (
              <article key={title} className="use-case">
                <Icon name={icon} size={22} className="use-case-icon" />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="vision" className="doc-section">
          <p className="eyebrow">05 &mdash; The vision</p>
          <h2>The long argument</h2>
          <p>
            As Seth Caldwell sets out in his{' '}
            <a
              href="https://www.youtube.com/watch?v=T-tzHdSY3n0"
              target="_blank"
              rel="noopener noreferrer"
            >
              vision video
            </a>
            , the internet is presently ordered by corporate systems that treat engagement
            as the objective and your wellbeing as an externality. Those systems surface
            what angers you, assemble echo chambers without telling you, and let automated
            accounts move what you see.
          </p>
          <p>WayVote is a claim that this is a design choice, and a reversible one:</p>
          <ul className="checklist">
            {VISION_POINTS.map((item) => (
              <li key={item}>
                <Icon name="check" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  </div>
)

export default About
