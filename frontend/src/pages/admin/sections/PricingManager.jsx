import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, DollarSign, Star } from 'lucide-react';
import { contentApi } from '../../../services/api';
import './AdminSections.css';

function PricingManager() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    billing_period: 'month',
    description: '',
    features: [],
    is_popular: false,
    is_active: true,
    order_index: 0
  });
  const [featuresText, setFeaturesText] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await contentApi.getPricing();
      setPlans(response.data.plans);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load pricing plans' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        billing_period: plan.billing_period,
        description: plan.description || '',
        features: plan.features,
        is_popular: !!plan.is_popular,
        is_active: plan.is_active !== 0,
        order_index: plan.order_index
      });
      setFeaturesText(plan.features.join('\n'));
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        price: 0,
        billing_period: 'month',
        description: '',
        features: [],
        is_popular: false,
        is_active: true,
        order_index: plans.length
      });
      setFeaturesText('');
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPlan(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const features = featuresText.split('\n').filter(f => f.trim());
    const submitData = { ...formData, features };

    try {
      if (editingPlan) {
        await contentApi.updatePricing(editingPlan.id, submitData);
        setMessage({ type: 'success', text: 'Pricing plan updated successfully!' });
      } else {
        await contentApi.createPricing(submitData);
        setMessage({ type: 'success', text: 'Pricing plan created successfully!' });
      }
      fetchPlans();
      closeModal();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save pricing plan' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;

    try {
      await contentApi.deletePricing(id);
      setMessage({ type: 'success', text: 'Pricing plan deleted successfully!' });
      fetchPlans();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete pricing plan' });
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-section">
      <div className="items-header">
        <div>
          <h1>Pricing Plans</h1>
          <p>Manage your hosting pricing plans</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} />
          Add Plan
        </button>
      </div>

      {message.text && !modalOpen && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {plans.length === 0 ? (
        <div className="empty-state card">
          <DollarSign size={48} />
          <p>No pricing plans yet</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            Add Your First Plan
          </button>
        </div>
      ) : (
        <div className="items-list">
          {plans.map(plan => (
            <div key={plan.id} className="item-card">
              <div className="item-content">
                <div className="item-title">
                  {plan.name}
                  {plan.is_popular && <Star size={16} style={{ marginLeft: 8, color: '#f59e0b' }} fill="#f59e0b" />}
                </div>
                <div className="item-description">
                  ${plan.price}/{plan.billing_period} - {plan.description}
                </div>
                <div className="item-meta">
                  <span>{plan.features.length} features</span>
                  <span>Order: {plan.order_index}</span>
                  <span>{plan.is_active !== 0 ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="item-actions">
                <button className="icon-btn edit" onClick={() => openModal(plan)}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(plan.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPlan ? 'Edit Pricing Plan' : 'Add Pricing Plan'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Plan Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Billing Period</label>
                    <select
                      className="form-input"
                      value={formData.billing_period}
                      onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Features (one per line)</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={6}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="Free SSL Certificate&#10;24/7 Support&#10;Daily Backups"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="is_popular"
                      checked={formData.is_popular}
                      onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    />
                    <label htmlFor="is_popular">Mark as Popular</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active">Active</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PricingManager;
