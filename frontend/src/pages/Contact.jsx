import { useState } from 'react'
import Icon from '../components/Icon'
import './Contact.css'

const CHANNELS = [
  {
    icon: 'mail',
    title: 'Email',
    lines: [{ text: 'contact@wayvote.org', href: 'mailto:contact@wayvote.org' }],
  },
  {
    icon: 'globe',
    title: 'Web',
    lines: [
      { text: 'wayvote.org', href: 'https://wayvote.org' },
      { text: 'weighvote.org', href: 'https://weighvote.org' },
    ],
  },
  {
    icon: 'code',
    title: 'Open source',
    lines: [
      {
        text: 'github.com/oceanseth/wayvote',
        href: 'https://github.com/oceanseth/wayvote',
      },
      { text: 'Issues and pull requests welcome' },
    ],
  },
]

const FAQ = [
  {
    q: 'What does the extension actually change?',
    a: 'It reorders content on the sites you visit using rankings computed from the weights you set, rather than the ordering the platform chose for you.',
  },
  {
    q: 'Which sites are supported?',
    a: 'Reddit first. The extension is built per-site, and additional platforms follow the same pattern.',
  },
  {
    q: 'Where do vote weights come from?',
    a: 'From self-reported and measured user metrics — intelligence, expertise, authenticity. You decide which of them count and how heavily.',
  },
  {
    q: 'Is WayVote open source?',
    a: 'Yes. The extension, frontend, and Lambda services are MIT licensed and developed in the open.',
  },
]

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact">
      <div className="page-head">
        <div className="container">
          <p className="eyebrow eyebrow--inverse">Contact</p>
          <h1>Get in touch</h1>
          <p className="lead">
            Questions about weighted ranking, the extension, or the API — send them over
            and we will respond.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-grid">
          <div className="contact-aside">
            <ul className="channels">
              {CHANNELS.map(({ icon, title, lines }) => (
                <li key={title} className="channel">
                  <Icon name={icon} size={20} className="channel-icon" />
                  <div>
                    <h2>{title}</h2>
                    {lines.map(({ text, href }) => (
                      <p key={text}>
                        {href ? (
                          <a
                            href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {text}
                          </a>
                        ) : (
                          text
                        )}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <section className="faq">
              <h2 className="faq-title">Frequently asked</h2>
              <dl>
                {FAQ.map(({ q, a }) => (
                  <div key={q} className="faq-item">
                    <dt>{q}</dt>
                    <dd>{a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <div className="contact-form-panel">
            <h2>Send a message</h2>
            <p className="contact-form-note">
              Fields marked <abbr title="required">*</abbr> are required.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General inquiry</option>
                  <option value="support">Technical support</option>
                  <option value="api">API and integrations</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="7"
                  required
                  placeholder="Tell us how we can help."
                />
              </div>

              <div aria-live="polite">
                {submitStatus === 'success' && (
                  <div className="alert alert-success">
                    Thank you for your message. We will get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-error">
                    Sorry, there was an error sending your message. Please try again.
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <Icon name="arrowRight" size={16} />
                    </>
                  )}
                </button>
                <p className="form-alt">
                  Prefer email? Write to{' '}
                  <a href="mailto:contact@wayvote.org">contact@wayvote.org</a>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
