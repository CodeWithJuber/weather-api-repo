const { db } = require('../database');

// Get all public content for homepage
const getAllPublicContent = (req, res) => {
  try {
    // Get content sections
    const sections = db.prepare('SELECT section_key, content FROM content_sections').all();
    const contentSections = {};
    sections.forEach(section => {
      contentSections[section.section_key] = JSON.parse(section.content);
    });

    // Get active services
    const services = db.prepare('SELECT id, title, description, icon FROM services WHERE is_active = 1 ORDER BY order_index').all();

    // Get active pricing plans
    const pricingPlans = db.prepare('SELECT id, name, price, billing_period, description, features, is_popular FROM pricing_plans WHERE is_active = 1 ORDER BY order_index').all();
    const formattedPlans = pricingPlans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features),
      is_popular: !!plan.is_popular
    }));

    // Get active features
    const features = db.prepare('SELECT id, title, description, icon FROM features WHERE is_active = 1 ORDER BY order_index').all();

    // Get active testimonials
    const testimonials = db.prepare('SELECT id, name, company, role, content, rating, avatar FROM testimonials WHERE is_active = 1 ORDER BY order_index').all();

    // Get active stats
    const stats = db.prepare('SELECT id, label, value, icon FROM stats WHERE is_active = 1 ORDER BY order_index').all();

    res.json({
      hero: contentSections.hero || {},
      about: contentSections.about || {},
      contact: contentSections.contact || {},
      footer: contentSections.footer || {},
      services,
      pricingPlans: formattedPlans,
      features,
      testimonials,
      stats
    });
  } catch (error) {
    console.error('Get public content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllPublicContent };
