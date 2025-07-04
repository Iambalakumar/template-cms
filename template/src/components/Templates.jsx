import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Available Templates</h1>
      <div className="template-grid">
        {templates.map((template) => (
          <div key={template._id} className="template-card">
            <img src={template.thumbnail} alt={template.title} />
            <div className="template-details">
              <h2>{template.title}</h2>
              <p>{template.description}</p>
              <div className="template-actions">
                <a href={template.previewLink} target="_blank" rel="noopener noreferrer">Preview</a>
                <a href={template.downloadLink} target="_blank" rel="noopener noreferrer">Download</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
