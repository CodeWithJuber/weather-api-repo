import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { contentApi } from '../../../services/api';
import './AdminSections.css';

function ContentSections() {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await contentApi.getAll();
      setSections(response.data.sections);
      const heroSection = response.data.sections.find(s => s.section_key === 'hero');
      if (heroSection) {
        setFormData(heroSection.content);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sectionKey) => {
    setActiveSection(sectionKey);
    const section = sections.find(s => s.section_key === sectionKey);
    if (section) {
      setFormData(section.content);
    }
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await contentApi.updateSection(activeSection, formData);
      setMessage({ type: 'success', text: 'Content saved successfully!' });
      fetchSections();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save content' });
    } finally {
      setSaving(false);
    }
  };

  const renderHeroForm = () => (
    <>
      <div className="form-group">
        <label className="form-label">Headline</label>
        <input
          type="text"
          className="form-input"
          value={formData.headline || ''}
          onChange={(e) => handleInputChange('headline', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Subheadline</label>
        <textarea
          className="form-input form-textarea"
          value={formData.subheadline || ''}
          onChange={(e) => handleInputChange('subheadline', e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Primary CTA Text</label>
          <input
            type="text"
            className="form-input"
            value={formData.primaryCta?.text || ''}
            onChange={(e) => handleInputChange('primaryCta.text', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Primary CTA Link</label>
          <input
            type="text"
            className="form-input"
            value={formData.primaryCta?.link || ''}
            onChange={(e) => handleInputChange('primaryCta.link', e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Secondary CTA Text</label>
          <input
            type="text"
            className="form-input"
            value={formData.secondaryCta?.text || ''}
            onChange={(e) => handleInputChange('secondaryCta.text', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Secondary CTA Link</label>
          <input
            type="text"
            className="form-input"
            value={formData.secondaryCta?.link || ''}
            onChange={(e) => handleInputChange('secondaryCta.link', e.target.value)}
          />
        </div>
      </div>
    </>
  );

  const renderAboutForm = () => (
    <>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-input"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input form-textarea"
          rows={4}
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Highlights (one per line)</label>
        <textarea
          className="form-input form-textarea"
          rows={3}
          value={(formData.highlights || []).join('\n')}
          onChange={(e) => handleInputChange('highlights', e.target.value.split('\n').filter(h => h.trim()))}
        />
      </div>
    </>
  );

  const renderContactForm = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Subtitle</label>
          <input
            type="text"
            className="form-input"
            value={formData.subtitle || ''}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-input"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Address</label>
        <input
          type="text"
          className="form-input"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
      <h4 className="form-section-title">Social Links</h4>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Twitter</label>
          <input
            type="url"
            className="form-input"
            value={formData.socialLinks?.twitter || ''}
            onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Facebook</label>
          <input
            type="url"
            className="form-input"
            value={formData.socialLinks?.facebook || ''}
            onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">LinkedIn</label>
          <input
            type="url"
            className="form-input"
            value={formData.socialLinks?.linkedin || ''}
            onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
          />
        </div>
      </div>
    </>
  );

  const renderFooterForm = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.companyName || ''}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tagline</label>
          <input
            type="text"
            className="form-input"
            value={formData.tagline || ''}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Copyright Text</label>
        <input
          type="text"
          className="form-input"
          value={formData.copyright || ''}
          onChange={(e) => handleInputChange('copyright', e.target.value)}
        />
      </div>
    </>
  );

  const renderForm = () => {
    switch (activeSection) {
      case 'hero': return renderHeroForm();
      case 'about': return renderAboutForm();
      case 'contact': return renderContactForm();
      case 'footer': return renderFooterForm();
      default: return <p>Select a section to edit</p>;
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h1>Content Sections</h1>
        <p>Edit the main content sections of your website</p>
      </div>

      <div className="section-tabs">
        {sections.map(section => (
          <button
            key={section.section_key}
            className={`tab-btn ${activeSection === section.section_key ? 'active' : ''}`}
            onClick={() => handleSectionChange(section.section_key)}
          >
            {section.section_name}
          </button>
        ))}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="section-form card">
        {renderForm()}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={fetchSections} disabled={saving}>
            <RefreshCw size={18} />
            Reset
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentSections;
