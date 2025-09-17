import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Use relative URLs for proxy

export const fetchTemplates = async (search = '') => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`http://localhost:5000/api/templates?search=${encodeURIComponent(search)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchTemplatesByAuthor = async (author) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`http://localhost:5000/api/templates/author/${encodeURIComponent(author)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const searchTemplates = async (query) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`http://localhost:5000/api/templates/search?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createTemplate = async (templateData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE}/api/templates`, templateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.template;
};

export const updateTemplate = async (id, templateData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_BASE}/api/templates/${id}`, templateData, {
    headers: { Authorization: `Bearer ${token}` },
  }); 
  return response.data.template;
};

export const deleteTemplate = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_BASE}/api/templates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
