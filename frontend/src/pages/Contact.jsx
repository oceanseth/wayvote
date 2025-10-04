import { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="lead">
            Have questions about WayVote? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email</h3>
                <p>contact@wayvote.org</p>
                <p>support@wayvote.org</p>
              </div>
              
              <div className="info-card">
                <div className="info-icon">🌐</div>
                <h3>Website</h3>
                <p>www.wayvote.org</p>
                <p>www.weighvote.org</p>
              </div>
              
              <div className="info-card">
                <div className="info-icon">⏰</div>
                <h3>Support Hours</h3>
                <p>24/7 Technical Support</p>
                <p>Business Hours: 9 AM - 6 PM EST</p>
              </div>
            </div>

            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-item">
                <h4>How secure is the voting platform?</h4>
                <p>WayVote uses end-to-end encryption, blockchain verification, and multi-factor authentication to ensure maximum security.</p>
              </div>
              <div className="faq-item">
                <h4>Can I vote from my mobile device?</h4>
                <p>Yes! WayVote is fully responsive and works on all devices including smartphones and tablets.</p>
              </div>
              <div className="faq-item">
                <h4>How do I get started with WayVote?</h4>
                <p>Contact our team to discuss your voting needs and we'll help you set up a customized solution.</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales & Pricing</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="6"
                  required
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
