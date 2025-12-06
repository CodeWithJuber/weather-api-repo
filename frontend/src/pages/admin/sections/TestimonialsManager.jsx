import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, MessageSquare, Star } from 'lucide-react';
import { contentApi } from '../../../services/api';
import './AdminSections.css';

function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    content: '',
    rating: 5,
    avatar: '',
    is_active: true,
    order_index: 0
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await contentApi.getTestimonials();
      setTestimonials(response.data.testimonials);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load testimonials' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        company: testimonial.company || '',
        role: testimonial.role || '',
        content: testimonial.content,
        rating: testimonial.rating,
        avatar: testimonial.avatar || '',
        is_active: !!testimonial.is_active,
        order_index: testimonial.order_index
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        company: '',
        role: '',
        content: '',
        rating: 5,
        avatar: '',
        is_active: true,
        order_index: testimonials.length
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingTestimonial) {
        await contentApi.updateTestimonial(editingTestimonial.id, formData);
        setMessage({ type: 'success', text: 'Testimonial updated successfully!' });
      } else {
        await contentApi.createTestimonial(formData);
        setMessage({ type: 'success', text: 'Testimonial created successfully!' });
      }
      fetchTestimonials();
      closeModal();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save testimonial' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await contentApi.deleteTestimonial(id);
      setMessage({ type: 'success', text: 'Testimonial deleted successfully!' });
      fetchTestimonials();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete testimonial' });
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-section">
      <div className="items-header">
        <div>
          <h1>Testimonials</h1>
          <p>Manage customer testimonials</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      {message.text && !modalOpen && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {testimonials.length === 0 ? (
        <div className="empty-state card">
          <MessageSquare size={48} />
          <p>No testimonials yet</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            Add Your First Testimonial
          </button>
        </div>
      ) : (
        <div className="items-list">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="item-card">
              <div className="item-content">
                <div className="item-title">
                  {testimonial.name}
                  <span style={{ marginLeft: 8, display: 'inline-flex', gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < testimonial.rating ? '#f59e0b' : 'none'}
                        color={i < testimonial.rating ? '#f59e0b' : '#d1d5db'}
                      />
                    ))}
                  </span>
                </div>
                <div className="item-description">"{testimonial.content}"</div>
                <div className="item-meta">
                  {testimonial.role && <span>{testimonial.role}</span>}
                  {testimonial.company && <span>at {testimonial.company}</span>}
                  <span>{testimonial.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="item-actions">
                <button className="icon-btn edit" onClick={() => openModal(testimonial)}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(testimonial.id)}>
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
              <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role/Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="CEO, Developer, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Testimonial Content</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Rating (1-5)</label>
                    <select
                      className="form-input"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    >
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
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
                  {editingTestimonial ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestimonialsManager;
