import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Change to your backend URL

export const signup = async (data) => {
  return await axios.post(`${API_BASE}/signup`, data);
};

export const login = async (data) => {
  return await axios.post(`${API_BASE}/login`, data);
};

export const getFavorites = async () => {
  return await axios.get(`${API_BASE}/api/user/favorites`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const updateFavorites = async (favorites) => {
  return await axios.post(`${API_BASE}/api/user/favorites`, { favorites }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Add isTokenExpired function export
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payloadBase64] = token.split('.');
    // Replace atob with Buffer decoding for safer base64 decoding
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const exp = payload.exp;
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (error) {
    return true;
  }
}
