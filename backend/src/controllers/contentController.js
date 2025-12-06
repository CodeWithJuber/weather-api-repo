const { db } = require('../database');

// Get all content sections
const getAllContent = (req, res) => {
  try {
    const sections = db.prepare('SELECT * FROM content_sections ORDER BY section_key').all();
    const formattedSections = sections.map(section => ({
      ...section,
      content: JSON.parse(section.content)
    }));
    res.json({ sections: formattedSections });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get content by section key
const getContentBySection = (req, res) => {
  try {
    const { section } = req.params;
    const content = db.prepare('SELECT * FROM content_sections WHERE section_key = ?').get(section);

    if (!content) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json({
      ...content,
      content: JSON.parse(content.content)
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update content section
const updateContent = (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;
    const adminId = req.admin.id;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const existingSection = db.prepare('SELECT * FROM content_sections WHERE section_key = ?').get(section);

    if (!existingSection) {
      return res.status(404).json({ error: 'Section not found' });
    }

    db.prepare(`
      UPDATE content_sections
      SET content = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
      WHERE section_key = ?
    `).run(JSON.stringify(content), adminId, section);

    const updatedSection = db.prepare('SELECT * FROM content_sections WHERE section_key = ?').get(section);

    res.json({
      message: 'Content updated successfully',
      section: {
        ...updatedSection,
        content: JSON.parse(updatedSection.content)
      }
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// SERVICES CRUD
const getAllServices = (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY order_index').all();
    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createService = (req, res) => {
  try {
    const { title, description, icon, order_index, is_active } = req.body;

    if (!title || !description || !icon) {
      return res.status(400).json({ error: 'Title, description, and icon are required' });
    }

    const result = db.prepare(`
      INSERT INTO services (title, description, icon, order_index, is_active)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description, icon, order_index || 0, is_active !== undefined ? is_active : 1);

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Service created', service });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateService = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, order_index, is_active } = req.body;

    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Service not found' });
    }

    db.prepare(`
      UPDATE services
      SET title = ?, description = ?, icon = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || existing.title,
      description || existing.description,
      icon || existing.icon,
      order_index !== undefined ? order_index : existing.order_index,
      is_active !== undefined ? is_active : existing.is_active,
      id
    );

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    res.json({ message: 'Service updated', service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteService = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Service not found' });
    }

    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PRICING PLANS CRUD
const getAllPricingPlans = (req, res) => {
  try {
    const plans = db.prepare('SELECT * FROM pricing_plans ORDER BY order_index').all();
    const formattedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features)
    }));
    res.json({ plans: formattedPlans });
  } catch (error) {
    console.error('Get pricing plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPricingPlan = (req, res) => {
  try {
    const { name, price, billing_period, description, features, is_popular, order_index } = req.body;

    if (!name || price === undefined || !features) {
      return res.status(400).json({ error: 'Name, price, and features are required' });
    }

    const result = db.prepare(`
      INSERT INTO pricing_plans (name, price, billing_period, description, features, is_popular, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      price,
      billing_period || 'month',
      description || '',
      JSON.stringify(features),
      is_popular ? 1 : 0,
      order_index || 0
    );

    const plan = db.prepare('SELECT * FROM pricing_plans WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      message: 'Pricing plan created',
      plan: { ...plan, features: JSON.parse(plan.features) }
    });
  } catch (error) {
    console.error('Create pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePricingPlan = (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, billing_period, description, features, is_popular, is_active, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM pricing_plans WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    db.prepare(`
      UPDATE pricing_plans
      SET name = ?, price = ?, billing_period = ?, description = ?, features = ?, is_popular = ?, is_active = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name || existing.name,
      price !== undefined ? price : existing.price,
      billing_period || existing.billing_period,
      description !== undefined ? description : existing.description,
      features ? JSON.stringify(features) : existing.features,
      is_popular !== undefined ? (is_popular ? 1 : 0) : existing.is_popular,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      order_index !== undefined ? order_index : existing.order_index,
      id
    );

    const plan = db.prepare('SELECT * FROM pricing_plans WHERE id = ?').get(id);
    res.json({
      message: 'Pricing plan updated',
      plan: { ...plan, features: JSON.parse(plan.features) }
    });
  } catch (error) {
    console.error('Update pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePricingPlan = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM pricing_plans WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    db.prepare('DELETE FROM pricing_plans WHERE id = ?').run(id);
    res.json({ message: 'Pricing plan deleted' });
  } catch (error) {
    console.error('Delete pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// TESTIMONIALS CRUD
const getAllTestimonials = (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY order_index').all();
    res.json({ testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTestimonial = (req, res) => {
  try {
    const { name, company, role, content, rating, avatar, order_index } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }

    const result = db.prepare(`
      INSERT INTO testimonials (name, company, role, content, rating, avatar, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, company || '', role || '', content, rating || 5, avatar || '', order_index || 0);

    const testimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Testimonial created', testimonial });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTestimonial = (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, role, content, rating, avatar, is_active, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    db.prepare(`
      UPDATE testimonials
      SET name = ?, company = ?, role = ?, content = ?, rating = ?, avatar = ?, is_active = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name || existing.name,
      company !== undefined ? company : existing.company,
      role !== undefined ? role : existing.role,
      content || existing.content,
      rating !== undefined ? rating : existing.rating,
      avatar !== undefined ? avatar : existing.avatar,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      order_index !== undefined ? order_index : existing.order_index,
      id
    );

    const testimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    res.json({ message: 'Testimonial updated', testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTestimonial = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// FEATURES CRUD
const getAllFeatures = (req, res) => {
  try {
    const features = db.prepare('SELECT * FROM features ORDER BY order_index').all();
    res.json({ features });
  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createFeature = (req, res) => {
  try {
    const { title, description, icon, order_index } = req.body;

    if (!title || !description || !icon) {
      return res.status(400).json({ error: 'Title, description, and icon are required' });
    }

    const result = db.prepare(`
      INSERT INTO features (title, description, icon, order_index)
      VALUES (?, ?, ?, ?)
    `).run(title, description, icon, order_index || 0);

    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Feature created', feature });
  } catch (error) {
    console.error('Create feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateFeature = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, is_active, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM features WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    db.prepare(`
      UPDATE features
      SET title = ?, description = ?, icon = ?, is_active = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || existing.title,
      description || existing.description,
      icon || existing.icon,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      order_index !== undefined ? order_index : existing.order_index,
      id
    );

    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(id);
    res.json({ message: 'Feature updated', feature });
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFeature = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM features WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    db.prepare('DELETE FROM features WHERE id = ?').run(id);
    res.json({ message: 'Feature deleted' });
  } catch (error) {
    console.error('Delete feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// STATS CRUD
const getAllStats = (req, res) => {
  try {
    const stats = db.prepare('SELECT * FROM stats ORDER BY order_index').all();
    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createStat = (req, res) => {
  try {
    const { label, value, icon, order_index } = req.body;

    if (!label || !value) {
      return res.status(400).json({ error: 'Label and value are required' });
    }

    const result = db.prepare(`
      INSERT INTO stats (label, value, icon, order_index)
      VALUES (?, ?, ?, ?)
    `).run(label, value, icon || '', order_index || 0);

    const stat = db.prepare('SELECT * FROM stats WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Stat created', stat });
  } catch (error) {
    console.error('Create stat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStat = (req, res) => {
  try {
    const { id } = req.params;
    const { label, value, icon, is_active, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM stats WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Stat not found' });
    }

    db.prepare(`
      UPDATE stats
      SET label = ?, value = ?, icon = ?, is_active = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      label || existing.label,
      value || existing.value,
      icon !== undefined ? icon : existing.icon,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      order_index !== undefined ? order_index : existing.order_index,
      id
    );

    const stat = db.prepare('SELECT * FROM stats WHERE id = ?').get(id);
    res.json({ message: 'Stat updated', stat });
  } catch (error) {
    console.error('Update stat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStat = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM stats WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Stat not found' });
    }

    db.prepare('DELETE FROM stats WHERE id = ?').run(id);
    res.json({ message: 'Stat deleted' });
  } catch (error) {
    console.error('Delete stat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllContent,
  getContentBySection,
  updateContent,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  getAllStats,
  createStat,
  updateStat,
  deleteStat
};
