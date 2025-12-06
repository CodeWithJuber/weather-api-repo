import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, BarChart3 } from 'lucide-react';
import { contentApi } from '../../../services/api';
import './AdminSections.css';

function StatsManager() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: 'globe',
    order_index: 0,
    is_active: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const iconOptions = ['globe', 'users', 'server', 'check', 'shield', 'zap', 'database'];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await contentApi.getStats();
      setStats(response.data.stats);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load stats' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (stat = null) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        label: stat.label,
        value: stat.value,
        icon: stat.icon || 'globe',
        order_index: stat.order_index,
        is_active: !!stat.is_active
      });
    } else {
      setEditingStat(null);
      setFormData({
        label: '',
        value: '',
        icon: 'globe',
        order_index: stats.length,
        is_active: true
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStat(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingStat) {
        await contentApi.updateStat(editingStat.id, formData);
        setMessage({ type: 'success', text: 'Stat updated successfully!' });
      } else {
        await contentApi.createStat(formData);
        setMessage({ type: 'success', text: 'Stat created successfully!' });
      }
      fetchStats();
      closeModal();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save stat' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      await contentApi.deleteStat(id);
      setMessage({ type: 'success', text: 'Stat deleted successfully!' });
      fetchStats();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete stat' });
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-section">
      <div className="items-header">
        <div>
          <h1>Statistics</h1>
          <p>Manage your company statistics displayed on the homepage</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} />
          Add Stat
        </button>
      </div>

      {message.text && !modalOpen && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {stats.length === 0 ? (
        <div className="empty-state card">
          <BarChart3 size={48} />
          <p>No statistics yet</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            Add Your First Stat
          </button>
        </div>
      ) : (
        <div className="items-list">
          {stats.map(stat => (
            <div key={stat.id} className="item-card">
              <div className="item-content">
                <div className="item-title">{stat.value}</div>
                <div className="item-description">{stat.label}</div>
                <div className="item-meta">
                  <span className="item-badge">{stat.icon}</span>
                  <span>Order: {stat.order_index}</span>
                  <span>{stat.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="item-actions">
                <button className="icon-btn edit" onClick={() => openModal(stat)}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(stat.id)}>
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
              <h2>{editingStat ? 'Edit Stat' : 'Add Stat'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Value</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g., 50,000+ or 99.99%"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Websites Hosted"
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
                  {editingStat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsManager;
