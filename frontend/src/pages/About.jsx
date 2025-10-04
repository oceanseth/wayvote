import './About.css'

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-header">
          <h1>About WayVote</h1>
          <p className="lead">
            Empowering democratic participation through secure, transparent, and accessible voting technology.
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              WayVote is dedicated to revolutionizing the way communities make decisions. 
              We believe that democracy should be accessible, transparent, and secure for everyone, 
              regardless of their location or circumstances.
            </p>
            <p>
              Our platform combines cutting-edge technology with user-friendly design to create 
              a voting experience that is both trustworthy and convenient.
            </p>
          </div>

          <div className="about-section">
            <h2>Technology & Security</h2>
            <div className="tech-features">
              <div className="tech-item">
                <h3>🔐 End-to-End Encryption</h3>
                <p>All votes are encrypted using industry-standard AES-256 encryption, ensuring complete privacy and security.</p>
              </div>
              <div className="tech-item">
                <h3>⛓️ Blockchain Verification</h3>
                <p>Vote integrity is verified through blockchain technology, providing an immutable audit trail.</p>
              </div>
              <div className="tech-item">
                <h3>🛡️ Multi-Factor Authentication</h3>
                <p>Advanced authentication methods ensure only authorized voters can participate.</p>
              </div>
              <div className="tech-item">
                <h3>📱 Cross-Platform Compatibility</h3>
                <p>Access the platform from any device - desktop, tablet, or mobile - with full functionality.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Key Features</h2>
            <ul className="features-list">
              <li>Real-time vote counting and results</li>
              <li>Anonymous voting with voter verification</li>
              <li>Comprehensive audit trails</li>
              <li>Multi-language support</li>
              <li>Accessibility compliance (WCAG 2.1)</li>
              <li>Offline voting capabilities</li>
              <li>Integration with existing systems</li>
              <li>24/7 technical support</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Use Cases</h2>
            <div className="use-cases">
              <div className="use-case">
                <h3>🏛️ Government Elections</h3>
                <p>Secure, transparent elections for local, state, and national government positions.</p>
              </div>
              <div className="use-case">
                <h3>🏢 Corporate Governance</h3>
                <p>Board elections, shareholder voting, and corporate decision-making processes.</p>
              </div>
              <div className="use-case">
                <h3>🎓 Educational Institutions</h3>
                <p>Student government elections, faculty decisions, and academic policy voting.</p>
              </div>
              <div className="use-case">
                <h3>🏘️ Community Organizations</h3>
                <p>HOA decisions, community board elections, and neighborhood initiatives.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Compliance & Standards</h2>
            <p>
              WayVote meets and exceeds industry standards for security and accessibility:
            </p>
            <ul className="compliance-list">
              <li>SOC 2 Type II Certified</li>
              <li>ISO 27001 Information Security Management</li>
              <li>WCAG 2.1 AA Accessibility Standards</li>
              <li>GDPR Compliant</li>
              <li>HIPAA Ready</li>
              <li>FISMA Moderate Compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
