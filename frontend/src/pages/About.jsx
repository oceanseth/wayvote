import './About.css'

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-header">
          <h1>About WayVote</h1>
          <p className="lead">
            A browser plugin that gives you control over ranking algorithms on the sites you visit. 
            Take back control of your content consumption and create the internet experience you want.
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              WayVote is dedicated to giving users control over their content consumption. 
              We believe that you should have the power to decide how content is ranked and 
              whose votes matter to you, not corporate algorithms.
            </p>
            <p>
              Inspired by <a href="https://www.youtube.com/watch?v=T-tzHdSY3n0" target="_blank" rel="noopener noreferrer">Seth Caldwell's vision</a>, 
              we're building tools that let you create custom echo chambers you can enter and exit at will, 
              filter out bot manipulation, and see transparent rankings based on your own criteria.
            </p>
          </div>

          <div className="about-section">
            <h2>How It Works</h2>
            <div className="tech-features">
              <div className="tech-item">
                <h3>🎯 Browser Plugin</h3>
                <p>Install our browser extension to take control of ranking algorithms on Reddit and other sites you visit.</p>
              </div>
              <div className="tech-item">
                <h3>⚖️ Weighted Voting</h3>
                <p>Your votes are weighted based on your metrics - intelligence tests, expertise, authenticity scores.</p>
              </div>
              <div className="tech-item">
                <h3>🔍 Transparent Rankings</h3>
                <p>See exactly why content is ranked the way it is and whose votes are influencing the results.</p>
              </div>
              <div className="tech-item">
                <h3>🎛️ Custom Filters</h3>
                <p>Create custom echo chambers based on your preferences - toggle between different ranking criteria instantly.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Key Features</h2>
            <ul className="features-list">
              <li>Control ranking algorithms on Reddit and other social platforms</li>
              <li>Weight votes based on user intelligence, expertise, and authenticity</li>
              <li>Filter out bot votes and low-quality content</li>
              <li>Create custom echo chambers you can toggle between</li>
              <li>See transparent rankings instead of hidden algorithms</li>
              <li>Self-reported and measured user metrics</li>
              <li>Browser plugin for seamless integration</li>
              <li>Open source and community-driven development</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Use Cases</h2>
            <div className="use-cases">
              <div className="use-case">
                <h3>🤖 Bot Detection</h3>
                <p>Filter out votes from likely bots and fake accounts to see authentic community sentiment.</p>
              </div>
              <div className="use-case">
                <h3>🧠 Intelligence-Based Ranking</h3>
                <p>See how content ranks when weighted by user intelligence test scores and critical thinking ability.</p>
              </div>
              <div className="use-case">
                <h3>🎯 Expertise Filtering</h3>
                <p>View content ranked by people with specific expertise - programmers for tech posts, doctors for medical content.</p>
              </div>
              <div className="use-case">
                <h3>🔄 Echo Chamber Control</h3>
                <p>Create custom echo chambers based on political views, interests, or any criteria you choose.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>The Vision</h2>
            <p>
              As Seth Caldwell explains in his <a href="https://www.youtube.com/watch?v=T-tzHdSY3n0" target="_blank" rel="noopener noreferrer">vision video</a>, 
              the internet is currently controlled by corporate algorithms that prioritize engagement over your wellbeing. 
              These algorithms show you content that makes you angry, create echo chambers without your knowledge, 
              and allow bots to manipulate what you see.
            </p>
            <p>
              WayVote gives you the power to:
            </p>
            <ul className="compliance-list">
              <li>See transparent rankings instead of hidden algorithms</li>
              <li>Weight votes based on user metrics and authenticity</li>
              <li>Create custom echo chambers you can enter and exit at will</li>
              <li>Filter out bot manipulation and low-quality content</li>
              <li>Take control of your content consumption experience</li>
              <li>Build a more intelligent and authentic internet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
