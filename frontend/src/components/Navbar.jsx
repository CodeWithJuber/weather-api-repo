import { useState } from 'react';
import { Menu, X, Server } from 'lucide-react';
import './Navbar.css';

function Navbar({ companyName = 'HostingPro' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <a href="/" className="navbar-logo">
          <Server size={28} />
          <span>{companyName}</span>
        </a>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <button onClick={() => scrollToSection('services')} className="navbar-link">
            Services
          </button>
          <button onClick={() => scrollToSection('features')} className="navbar-link">
            Features
          </button>
          <button onClick={() => scrollToSection('pricing')} className="navbar-link">
            Pricing
          </button>
          <button onClick={() => scrollToSection('testimonials')} className="navbar-link">
            Testimonials
          </button>
          <button onClick={() => scrollToSection('contact')} className="navbar-link">
            Contact
          </button>
          <button onClick={() => scrollToSection('pricing')} className="btn btn-primary navbar-cta">
            Get Started
          </button>
        </div>

        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
