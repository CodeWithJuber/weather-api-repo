const { db, initializeDatabase } = require('./database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initializeDatabase();

// Seed admin user
async function seedAdmin() {
  const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@hostingcompany.com');

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.prepare(`
      INSERT INTO admins (email, password, name) VALUES (?, ?, ?)
    `).run('admin@hostingcompany.com', hashedPassword, 'Admin User');
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

// Seed content sections
function seedContent() {
  const sections = [
    {
      section_key: 'hero',
      section_name: 'Hero Section',
      content: JSON.stringify({
        headline: 'Powerful Web Hosting Solutions',
        subheadline: 'Fast, secure, and reliable hosting for your websites and applications',
        primaryCta: { text: 'Get Started', link: '#pricing' },
        secondaryCta: { text: 'Learn More', link: '#features' },
        backgroundImage: ''
      })
    },
    {
      section_key: 'about',
      section_name: 'About Section',
      content: JSON.stringify({
        title: 'About Our Company',
        description: 'We have been providing top-tier hosting services for over a decade. Our mission is to empower businesses and individuals with reliable, fast, and secure hosting solutions.',
        highlights: [
          '10+ Years of Experience',
          '99.99% Uptime Guarantee',
          'Award-winning Support'
        ]
      })
    },
    {
      section_key: 'contact',
      section_name: 'Contact Section',
      content: JSON.stringify({
        title: 'Get In Touch',
        subtitle: 'Have questions? We are here to help!',
        email: 'support@hostingcompany.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Street, San Francisco, CA 94102',
        socialLinks: {
          twitter: 'https://twitter.com/hostingcompany',
          facebook: 'https://facebook.com/hostingcompany',
          linkedin: 'https://linkedin.com/company/hostingcompany'
        }
      })
    },
    {
      section_key: 'footer',
      section_name: 'Footer Section',
      content: JSON.stringify({
        companyName: 'HostingPro',
        tagline: 'Your Trusted Hosting Partner',
        copyright: '© 2024 HostingPro. All rights reserved.',
        links: [
          { title: 'Privacy Policy', url: '/privacy' },
          { title: 'Terms of Service', url: '/terms' },
          { title: 'Support', url: '/support' }
        ]
      })
    }
  ];

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO content_sections (section_key, section_name, content)
    VALUES (?, ?, ?)
  `);

  sections.forEach(section => {
    insertStmt.run(section.section_key, section.section_name, section.content);
  });
  console.log('Content sections seeded');
}

// Seed services
function seedServices() {
  const services = [
    {
      title: 'Shared Hosting',
      description: 'Perfect for personal websites and small businesses. Get started with affordable and reliable shared hosting.',
      icon: 'server',
      order_index: 1
    },
    {
      title: 'VPS Hosting',
      description: 'Dedicated resources with full root access. Ideal for growing businesses that need more power and control.',
      icon: 'cloud',
      order_index: 2
    },
    {
      title: 'Dedicated Servers',
      description: 'Maximum performance and security with your own physical server. For enterprise-level applications.',
      icon: 'database',
      order_index: 3
    },
    {
      title: 'Cloud Hosting',
      description: 'Scalable cloud infrastructure that grows with your business. Pay only for what you use.',
      icon: 'cloud-upload',
      order_index: 4
    },
    {
      title: 'WordPress Hosting',
      description: 'Optimized hosting specifically for WordPress sites. One-click installation and automatic updates.',
      icon: 'wordpress',
      order_index: 5
    },
    {
      title: 'Domain Registration',
      description: 'Register your perfect domain name. Wide selection of TLDs with free WHOIS privacy.',
      icon: 'globe',
      order_index: 6
    }
  ];

  const existingServices = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (existingServices.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO services (title, description, icon, order_index) VALUES (?, ?, ?, ?)
    `);
    services.forEach(service => {
      insertStmt.run(service.title, service.description, service.icon, service.order_index);
    });
    console.log('Services seeded');
  }
}

// Seed pricing plans
function seedPricingPlans() {
  const plans = [
    {
      name: 'Starter',
      price: 4.99,
      billing_period: 'month',
      description: 'Perfect for personal projects',
      features: JSON.stringify([
        '1 Website',
        '10 GB SSD Storage',
        'Free SSL Certificate',
        '100 GB Bandwidth',
        'Email Accounts',
        '24/7 Support'
      ]),
      is_popular: 0,
      order_index: 1
    },
    {
      name: 'Professional',
      price: 9.99,
      billing_period: 'month',
      description: 'Great for small businesses',
      features: JSON.stringify([
        'Unlimited Websites',
        '50 GB SSD Storage',
        'Free SSL Certificate',
        'Unlimited Bandwidth',
        'Unlimited Email Accounts',
        'Priority Support',
        'Daily Backups',
        'Free Domain'
      ]),
      is_popular: 1,
      order_index: 2
    },
    {
      name: 'Enterprise',
      price: 24.99,
      billing_period: 'month',
      description: 'For high-traffic websites',
      features: JSON.stringify([
        'Unlimited Websites',
        '200 GB SSD Storage',
        'Free SSL Certificate',
        'Unlimited Bandwidth',
        'Unlimited Email Accounts',
        'Dedicated Support Manager',
        'Real-time Backups',
        'Free Domain',
        'Advanced Security Suite',
        'Performance Optimization'
      ]),
      is_popular: 0,
      order_index: 3
    }
  ];

  const existingPlans = db.prepare('SELECT COUNT(*) as count FROM pricing_plans').get();
  if (existingPlans.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO pricing_plans (name, price, billing_period, description, features, is_popular, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    plans.forEach(plan => {
      insertStmt.run(plan.name, plan.price, plan.billing_period, plan.description, plan.features, plan.is_popular, plan.order_index);
    });
    console.log('Pricing plans seeded');
  }
}

// Seed features
function seedFeatures() {
  const features = [
    {
      title: '99.99% Uptime',
      description: 'Industry-leading uptime guarantee backed by our SLA. Your website stays online, always.',
      icon: 'check-circle',
      order_index: 1
    },
    {
      title: 'Lightning Fast',
      description: 'SSD storage and optimized servers ensure your website loads in milliseconds.',
      icon: 'zap',
      order_index: 2
    },
    {
      title: 'Free SSL',
      description: 'Every hosting plan includes free SSL certificates to keep your data secure.',
      icon: 'shield',
      order_index: 3
    },
    {
      title: '24/7 Support',
      description: 'Our expert support team is available around the clock to help you succeed.',
      icon: 'headphones',
      order_index: 4
    },
    {
      title: 'Daily Backups',
      description: 'Automatic daily backups ensure your data is always safe and recoverable.',
      icon: 'database',
      order_index: 5
    },
    {
      title: 'One-Click Apps',
      description: 'Install WordPress, Joomla, and 100+ apps with just one click.',
      icon: 'download',
      order_index: 6
    }
  ];

  const existingFeatures = db.prepare('SELECT COUNT(*) as count FROM features').get();
  if (existingFeatures.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO features (title, description, icon, order_index) VALUES (?, ?, ?, ?)
    `);
    features.forEach(feature => {
      insertStmt.run(feature.title, feature.description, feature.icon, feature.order_index);
    });
    console.log('Features seeded');
  }
}

// Seed testimonials
function seedTestimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      role: 'CEO',
      content: 'Switching to HostingPro was the best decision for our startup. The speed and reliability have been exceptional, and the support team is incredibly responsive.',
      rating: 5,
      order_index: 1
    },
    {
      name: 'Michael Chen',
      company: 'Digital Agency',
      role: 'Founder',
      content: 'We host over 50 client websites with HostingPro. The uptime is incredible and the control panel makes management a breeze.',
      rating: 5,
      order_index: 2
    },
    {
      name: 'Emily Rodriguez',
      company: 'E-Commerce Plus',
      role: 'CTO',
      content: 'The performance improvements we saw after migrating were immediate. Our page load times dropped by 60% and our sales increased significantly.',
      rating: 5,
      order_index: 3
    },
    {
      name: 'David Park',
      company: 'BlogNetwork',
      role: 'Owner',
      content: 'As a blogger, I need hosting I can rely on. HostingPro delivers consistent performance and their WordPress optimization is top-notch.',
      rating: 4,
      order_index: 4
    }
  ];

  const existingTestimonials = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
  if (existingTestimonials.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO testimonials (name, company, role, content, rating, order_index) VALUES (?, ?, ?, ?, ?, ?)
    `);
    testimonials.forEach(testimonial => {
      insertStmt.run(testimonial.name, testimonial.company, testimonial.role, testimonial.content, testimonial.rating, testimonial.order_index);
    });
    console.log('Testimonials seeded');
  }
}

// Seed stats
function seedStats() {
  const stats = [
    { label: 'Websites Hosted', value: '50,000+', icon: 'globe', order_index: 1 },
    { label: 'Happy Customers', value: '25,000+', icon: 'users', order_index: 2 },
    { label: 'Uptime', value: '99.99%', icon: 'server', order_index: 3 },
    { label: 'Support Tickets Resolved', value: '100,000+', icon: 'check', order_index: 4 }
  ];

  const existingStats = db.prepare('SELECT COUNT(*) as count FROM stats').get();
  if (existingStats.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO stats (label, value, icon, order_index) VALUES (?, ?, ?, ?)
    `);
    stats.forEach(stat => {
      insertStmt.run(stat.label, stat.value, stat.icon, stat.order_index);
    });
    console.log('Stats seeded');
  }
}

// Run all seeds
async function runSeeds() {
  try {
    await seedAdmin();
    seedContent();
    seedServices();
    seedPricingPlans();
    seedFeatures();
    seedTestimonials();
    seedStats();
    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

runSeeds();
