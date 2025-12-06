import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {
  Server, LayoutDashboard, FileText, Layers, DollarSign,
  MessageSquare, Award, BarChart3, Settings, LogOut, Menu, X
} from 'lucide-react';
import { authApi, contentApi } from '../../services/api';
import ContentSections from './sections/ContentSections';
import ServicesManager from './sections/ServicesManager';
import PricingManager from './sections/PricingManager';
import TestimonialsManager from './sections/TestimonialsManager';
import FeaturesManager from './sections/FeaturesManager';
import StatsManager from './sections/StatsManager';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    services: 0,
    plans: 0,
    testimonials: 0,
    features: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminRes, servicesRes, pricingRes, testimonialsRes, featuresRes] = await Promise.all([
          authApi.getCurrentAdmin(),
          contentApi.getServices(),
          contentApi.getPricing(),
          contentApi.getTestimonials(),
          contentApi.getFeatures()
        ]);
        setAdmin(adminRes.data.admin);
        setStats({
          services: servicesRes.data.services.length,
          plans: pricingRes.data.plans.length,
          testimonials: testimonialsRes.data.testimonials.length,
          features: featuresRes.data.features.length
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/content', icon: FileText, label: 'Content Sections' },
    { path: '/admin/services', icon: Layers, label: 'Services' },
    { path: '/admin/pricing', icon: DollarSign, label: 'Pricing Plans' },
    { path: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { path: '/admin/features', icon: Award, label: 'Features' },
    { path: '/admin/stats', icon: BarChart3, label: 'Stats' }
  ];

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Server size={28} />
          <span>HostingPro</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" className="nav-item">
            <Settings size={20} />
            <span>View Website</span>
          </a>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="header-title">Admin Panel</div>
          <div className="header-user">
            {admin && <span>Welcome, {admin.name}</span>}
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route
              index
              element={
                <div className="dashboard-home">
                  <h1>Dashboard Overview</h1>
                  <p className="dashboard-subtitle">Manage your hosting website content</p>
                  <div className="stats-overview">
                    <div className="stat-card">
                      <Layers size={32} />
                      <div className="stat-info">
                        <span className="stat-number">{stats.services}</span>
                        <span className="stat-label">Services</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <DollarSign size={32} />
                      <div className="stat-info">
                        <span className="stat-number">{stats.plans}</span>
                        <span className="stat-label">Pricing Plans</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <MessageSquare size={32} />
                      <div className="stat-info">
                        <span className="stat-number">{stats.testimonials}</span>
                        <span className="stat-label">Testimonials</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <Award size={32} />
                      <div className="stat-info">
                        <span className="stat-number">{stats.features}</span>
                        <span className="stat-label">Features</span>
                      </div>
                    </div>
                  </div>
                  <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-grid">
                      <NavLink to="/admin/content" className="action-card">
                        <FileText size={24} />
                        <span>Edit Hero Section</span>
                      </NavLink>
                      <NavLink to="/admin/services" className="action-card">
                        <Layers size={24} />
                        <span>Manage Services</span>
                      </NavLink>
                      <NavLink to="/admin/pricing" className="action-card">
                        <DollarSign size={24} />
                        <span>Update Pricing</span>
                      </NavLink>
                      <NavLink to="/admin/testimonials" className="action-card">
                        <MessageSquare size={24} />
                        <span>Add Testimonial</span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="content" element={<ContentSections />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="pricing" element={<PricingManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="features" element={<FeaturesManager />} />
            <Route path="stats" element={<StatsManager />} />
          </Routes>
        </div>
      </main>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

export default AdminDashboard;
