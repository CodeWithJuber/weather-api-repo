import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Layers } from 'lucide-react';
import { contentApi } from '../../../services/api';
import './AdminSections.css';

function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'server',
    order_index: 0,
    is_active: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const iconOptions = ['server', 'cloud', 'database', 'cloud-upload', 'wordpress', 'globe', 'harddrive'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await contentApi.getServices();
      setServices(response.data.services);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load services' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        order_index: service.order_index,
        is_active: !!service.is_active
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: 'server',
        order_index: services.length,
        is_active: true
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingService) {
        await contentApi.updateService(editingService.id, formData);
        setMessage({ type: 'success', text: 'Service updated successfully!' });
      } else {
        await contentApi.createService(formData);
        setMessage({ type: 'success', text: 'Service created successfully!' });
      }
      fetchServices();
      closeModal();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save service' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await contentApi.deleteService(id);
      setMessage({ type: 'success', text: 'Service deleted successfully!' });
      fetchServices();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete service' });
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-section">
      <div className="items-header">
        <div>
          <h1>Services</h1>
          <p>Manage your hosting services</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {message.text && !modalOpen && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {services.length === 0 ? (
        <div className="empty-state card">
          <Layers size={48} />
          <p>No services yet</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="items-list">
          {services.map(service => (
            <div key={service.id} className="item-card">
              <div className="item-content">
                <div className="item-title">{service.title}</div>
                <div className="item-description">{service.description}</div>
                <div className="item-meta">
                  <span className="item-badge">{service.icon}</span>
                  <span>Order: {service.order_index}</span>
                  <span>{service.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="item-actions">
                <button className="icon-btn edit" onClick={() => openModal(service)}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(service.id)}>
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
              <h2>{editingService ? 'Edit Service' : 'Add Service'}</h2>
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
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesManager;
