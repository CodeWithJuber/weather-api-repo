import {
  CheckCircle, Zap, Shield, Headphones, Database, Download
} from 'lucide-react';
import './Features.css';

const iconMap = {
  'check-circle': CheckCircle,
  zap: Zap,
  shield: Shield,
  headphones: Headphones,
  database: Database,
  download: Download
};

function Features({ features = [] }) {
  return (
    <section id="features" className="section features-section">
      <div className="container">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">
          We provide everything you need for a successful online presence
        </p>
        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon] || CheckCircle;
            return (
              <div key={feature.id} className="feature-item">
                <div className="feature-icon">
                  <IconComponent size={24} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
