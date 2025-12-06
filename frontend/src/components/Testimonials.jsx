import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

function Testimonials({ testimonials = [] }) {
  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle">
          Trusted by thousands of businesses worldwide
        </p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card card">
              <Quote size={32} className="quote-icon" />
              <p className="testimonial-content">{testimonial.content}</p>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={index < testimonial.rating ? 'star-filled' : 'star-empty'}
                    fill={index < testimonial.rating ? '#f59e0b' : 'none'}
                  />
                ))}
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">
                    {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
