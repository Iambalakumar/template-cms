// src/services/authService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Change to your backend URL

export const signup = async (data) => {
  return await axios.post(`${API_BASE}/signup`, data);
};

export const login = async (data) => {
  return await axios.post(`${API_BASE}/login`, data);
};
