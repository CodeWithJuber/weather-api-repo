import { Server } from 'lucide-react';
import './Footer.css';

function Footer({ data }) {
  const {
    companyName = 'HostingPro',
    tagline = 'Your Trusted Hosting Partner',
    copyright = '© 2024 HostingPro. All rights reserved.',
    links = []
  } = data || {};

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Server size={28} />
              <span>{companyName}</span>
            </div>
            <p className="footer-tagline">{tagline}</p>
          </div>
          <div className="footer-links">
            {links.map((link, index) => (
              <a key={index} href={link.url} className="footer-link">
                {link.title}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
