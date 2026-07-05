import axios from 'axios';

const API = 'http://localhost:5000/api/favorites';
const getToken = () => localStorage.getItem('token');

// Thêm yêu thích
export const addFavorite = async (paintingId) => {
  const res = await axios.post(
    API,
    { paintingId },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};

// Xóa yêu thích
export const removeFavorite = async (paintingId) => {
  const res = await axios.delete(
    `${API}/${paintingId}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};

// Lấy danh sách yêu thích
export const getFavorites = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(
    `${API}?${query}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};

// Kiểm tra có yêu thích không
export const checkFavorite = async (paintingId) => {
  const res = await axios.get(
    `${API}/check/${paintingId}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};
