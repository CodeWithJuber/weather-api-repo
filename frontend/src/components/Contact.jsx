import { Mail, Phone, MapPin, Twitter, Facebook, Linkedin } from 'lucide-react';
import './Contact.css';

const socialIcons = {
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin
};

function Contact({ data }) {
  const {
    title = 'Get In Touch',
    subtitle = 'Have questions? We are here to help!',
    email = 'support@hostingcompany.com',
    phone = '+1 (555) 123-4567',
    address = '123 Tech Street, San Francisco, CA 94102',
    socialLinks = {}
  } = data || {};

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div>
                <div className="contact-label">Email Us</div>
                <a href={`mailto:${email}`} className="contact-value">{email}</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div>
                <div className="contact-label">Call Us</div>
                <a href={`tel:${phone}`} className="contact-value">{phone}</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div>
                <div className="contact-label">Visit Us</div>
                <div className="contact-value">{address}</div>
              </div>
            </div>
            {Object.keys(socialLinks).length > 0 && (
              <div className="social-links">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  const Icon = socialIcons[platform] || Twitter;
                  return (
                    <a key={platform} href={url} className="social-link" target="_blank" rel="noopener noreferrer">
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <div className="contact-form-wrapper card">
            <h3 className="form-title">Send us a message</h3>
            <form className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="Your email" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="How can we help?" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input form-textarea" placeholder="Your message"></textarea>
              </div>
              <button type="submit" className="btn btn-primary contact-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
