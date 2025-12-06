import {
  Server, Cloud, Database, CloudCog, Globe, HardDrive
} from 'lucide-react';
import './Services.css';

const iconMap = {
  server: Server,
  cloud: Cloud,
  database: Database,
  'cloud-upload': CloudCog,
  wordpress: Globe,
  globe: Globe,
  harddrive: HardDrive
};

function Services({ services = [] }) {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <h2 className="section-title">Our Hosting Services</h2>
        <p className="section-subtitle">
          Choose from our range of professional hosting solutions designed to meet your needs
        </p>
        <div className="services-grid">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Server;
            return (
              <div key={service.id} className="service-card card">
                <div className="service-icon">
                  <IconComponent size={32} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
