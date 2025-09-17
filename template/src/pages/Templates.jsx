import React, { useEffect, useState } from 'react';
import { fetchTemplates, createTemplate, updateTemplate, deleteTemplate } from '../services/templateService';
import { useFavorites } from '../context/FavoritesContext.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { useAuth } from '../context/authContext.jsx';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { favoritedIds, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useAuth();
  const [isload, setisload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    previewLink: '',
    downloadLink: '',
  });
  
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true); // Start loading
      const data = await fetchTemplates();
      setTemplates(data);
      setLoading(false); // End loading
    };

    
    loadTemplates();
  }, []);

  const openAddModal = () => {
    setEditingTemplate(null);
    setForm({
      title: '',
      description: '',
      thumbnail: '',
      previewLink: '',
      downloadLink: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setForm({
      title: template.title,
      description: template.description,
      thumbnail: template.thumbnail,
      previewLink: template.previewLink,
      downloadLink: template.downloadLink,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        const updated = await updateTemplate(editingTemplate._id, form);
        setTemplates(templates.map(t => (t._id === updated._id ? updated : t)));
      } else {
        const created = await createTemplate(form);
        setTemplates([...templates, created]);
      }
      closeModal();
    } catch (error) {
      alert('Error saving template');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await deleteTemplate(id);
      setTemplates(templates.filter(t => t._id !== id));
    } catch (error) {
      alert('Error deleting template');
    }
  };

  return (
    <div className="container" style={{ position: 'relative', minHeight: '400px' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(255,255,255,0.8)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className="loader" style={{
            border: '6px solid #f3f3f3',
            borderTop: '6px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: 'auto'
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>Loading templates...</div>
        </div>
      )}
      <h2 className="page-title">Templates</h2>
      {user?.role === 'admin' && (
        <button onClick={openAddModal} style={{ marginBottom: '1rem' }}>Add Template</button>
      )}
      <div className="template-grid">
        {templates.map(template => (
          <TemplateCard
            key={template._id}
            template={template}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {isModalOpen && (
        <div className="modal" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column', justifyContent:'center',gap:'10px', alignContent:'center',backgroundColor: 'white', padding: '1rem', borderRadius: '10px',width:'400px', justifyItems:'center' }}>
            <h3 style={{color:'black'}}>{editingTemplate ? 'Edit Template' : 'Add Template'}</h3>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <textarea style={{
              backgroundColor:'white',
            }} name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            <input name="thumbnail" placeholder="Thumbnail URL" value={form.thumbnail} onChange={handleChange} required />
            <input name="previewLink" placeholder="Preview Link" value={form.previewLink} onChange={handleChange} required />
            <input name="downloadLink" placeholder="Download Link" value={form.downloadLink} onChange={handleChange} required />
            <div style={{ marginTop: '1rem' }}>
              <button type="submit">{editingTemplate ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Templates;
