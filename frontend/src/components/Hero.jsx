import { ArrowRight, Play } from 'lucide-react';
import './Hero.css';

function Hero({ data }) {
  const {
    headline = 'Powerful Web Hosting Solutions',
    subheadline = 'Fast, secure, and reliable hosting for your websites and applications',
    primaryCta = { text: 'Get Started', link: '#pricing' },
    secondaryCta = { text: 'Learn More', link: '#features' }
  } = data || {};

  const scrollToSection = (link) => {
    const id = link.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
      </div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">{headline}</h1>
          <p className="hero-subtitle">{subheadline}</p>
          <div className="hero-actions">
            <button
              onClick={() => scrollToSection(primaryCta.link)}
              className="btn btn-white hero-btn-primary"
            >
              {primaryCta.text}
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollToSection(secondaryCta.link)}
              className="btn btn-secondary hero-btn-secondary"
            >
              <Play size={20} />
              {secondaryCta.text}
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="hero-card-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="hero-card-content">
              <div className="hero-server-line">
                <span className="hero-server-status online"></span>
                <span>Server 1 - Online</span>
                <span className="hero-server-uptime">99.99%</span>
              </div>
              <div className="hero-server-line">
                <span className="hero-server-status online"></span>
                <span>Server 2 - Online</span>
                <span className="hero-server-uptime">99.99%</span>
              </div>
              <div className="hero-server-line">
                <span className="hero-server-status online"></span>
                <span>Server 3 - Online</span>
                <span className="hero-server-uptime">99.99%</span>
              </div>
              <div className="hero-stats-bar">
                <div className="hero-stat-item">
                  <span className="hero-stat-label">CPU</span>
                  <div className="hero-stat-bar">
                    <div className="hero-stat-fill" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-label">RAM</span>
                  <div className="hero-stat-bar">
                    <div className="hero-stat-fill" style={{ width: '52%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
