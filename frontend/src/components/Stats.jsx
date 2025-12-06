import { Globe, Users, Server, CheckCircle } from 'lucide-react';
import './Stats.css';

const iconMap = {
  globe: Globe,
  users: Users,
  server: Server,
  check: CheckCircle
};

function Stats({ stats = [] }) {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat) => {
            const IconComponent = iconMap[stat.icon] || CheckCircle;
            return (
              <div key={stat.id} className="stat-item">
                <IconComponent size={40} className="stat-icon" />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Stats;
