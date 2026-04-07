import { useState } from 'react';
import './Contact.css';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call (replace with actual backend endpoint)
    setTimeout(() => {
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="section-title">
          Get In <span className="primary-gradient-text">Touch</span>
        </h2>
        <p className="contact-subtitle">
          Have questions? Want to collaborate? Reach out to us!
        </p>

        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Visit Us</h3>
              <p>NRCM College Campus<br />Media Lab, 2nd Floor<br />Hyderabad, Telangana</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email Us</h3>
              <p>nrcmfilmclub@gmail.com<br />club.nrcm@nrcm.edu.in</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Call Us</h3>
              <p>+91 98765 43210<br />+91 12345 67890</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3>Office Hours</h3>
              <p>Monday - Friday: 10 AM - 5 PM<br />Saturday: 10 AM - 2 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            {submitStatus.type && (
              <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-contact-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message ✉️'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-container">
          <iframe
            title="College Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.4867!3d17.4399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzIzLjYiTiA3OMKwMjknMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}