import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/auth';

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/token`, {
    username,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const refreshToken = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.access_token) {
    throw new Error('No token found');
  }
  
  const response = await axios.post(`${API_URL}/refresh`, {}, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  });
  
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const getCurrentUser = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.access_token) {
    return null;
  }
  
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        const newTokens = await refreshToken();
        const response = await axios.get(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${newTokens.access_token}`,
          },
        });
        return response.data;
      } catch (refreshError) {
        logout();
        return null;
      }
    }
    throw error;
  }
};

export default {
  login,
  logout,
  getCurrentUser,
  refreshToken,
};