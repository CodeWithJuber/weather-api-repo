import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Award } from 'lucide-react';
import { contentApi } from '../../../services/api';
import './AdminSections.css';

function FeaturesManager() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'check-circle',
    order_index: 0,
    is_active: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const iconOptions = ['check-circle', 'zap', 'shield', 'headphones', 'database', 'download', 'server', 'globe'];

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await contentApi.getFeatures();
      setFeatures(response.data.features);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load features' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (feature = null) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        order_index: feature.order_index,
        is_active: !!feature.is_active
      });
    } else {
      setEditingFeature(null);
      setFormData({
        title: '',
        description: '',
        icon: 'check-circle',
        order_index: features.length,
        is_active: true
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingFeature(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingFeature) {
        await contentApi.updateFeature(editingFeature.id, formData);
        setMessage({ type: 'success', text: 'Feature updated successfully!' });
      } else {
        await contentApi.createFeature(formData);
        setMessage({ type: 'success', text: 'Feature created successfully!' });
      }
      fetchFeatures();
      closeModal();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save feature' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      await contentApi.deleteFeature(id);
      setMessage({ type: 'success', text: 'Feature deleted successfully!' });
      fetchFeatures();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete feature' });
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-section">
      <div className="items-header">
        <div>
          <h1>Features</h1>
          <p>Manage your hosting features</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} />
          Add Feature
        </button>
      </div>

      {message.text && !modalOpen && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {features.length === 0 ? (
        <div className="empty-state card">
          <Award size={48} />
          <p>No features yet</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            Add Your First Feature
          </button>
        </div>
      ) : (
        <div className="items-list">
          {features.map(feature => (
            <div key={feature.id} className="item-card">
              <div className="item-content">
                <div className="item-title">{feature.title}</div>
                <div className="item-description">{feature.description}</div>
                <div className="item-meta">
                  <span className="item-badge">{feature.icon}</span>
                  <span>Order: {feature.order_index}</span>
                  <span>{feature.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="item-actions">
                <button className="icon-btn edit" onClick={() => openModal(feature)}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(feature.id)}>
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
              <h2>{editingFeature ? 'Edit Feature' : 'Add Feature'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Icon</label>
                    <select
                      className="form-input"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
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
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFeature ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeaturesManager;
