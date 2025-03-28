import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/vacancy';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.access_token) {
    return { Authorization: `Bearer ${user.access_token}` };
  }
  return {};
};

const getVacancies = async () => {
  const response = await axios.get(`${API_URL}/get`, {
    headers: getAuthHeader(),
  });
  return response.data.vacancies;
};

const getVacancyById = async (id) => {
  const response = await axios.get(`${API_URL}/get/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const createVacancy = async (vacancyData) => {
  const response = await axios.post(`${API_URL}/create`, vacancyData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const updateVacancy = async (id, vacancyData) => {
  const response = await axios.put(`${API_URL}/update/${id}`, vacancyData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const deleteVacancy = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export default {
  getVacancies,
  getVacancyById,
  createVacancy,
  updateVacancy,
  deleteVacancy,
};