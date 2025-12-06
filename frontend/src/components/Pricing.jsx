import { Check, Star } from 'lucide-react';
import './Pricing.css';

function Pricing({ plans = [] }) {
  return (
    <section id="pricing" className="section pricing-section">
      <div className="container">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="section-subtitle">
          Choose the perfect plan for your needs. No hidden fees, no surprises.
        </p>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card card ${plan.is_popular ? 'popular' : ''}`}
            >
              {plan.is_popular && (
                <div className="popular-badge">
                  <Star size={16} />
                  Most Popular
                </div>
              )}
              <h3 className="pricing-name">{plan.name}</h3>
              <p className="pricing-description">{plan.description}</p>
              <div className="pricing-price">
                <span className="price-currency">$</span>
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">/{plan.billing_period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="pricing-feature">
                    <Check size={18} className="feature-check" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`btn ${plan.is_popular ? 'btn-primary' : 'btn-secondary'} pricing-btn`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
