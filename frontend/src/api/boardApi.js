import Cookies from 'js-cookie';
import axios from 'axios';

// Base URL
const API = 'http://localhost:5000/api/boards';

// Lấy token từ localStorage

export const getBoards = async () => {
  try {
    const token = Cookies.get('token');
    const res = await axios.get(
      API,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error('Get boards error:', error);
    throw error;
  }
};


export const createBoard = async (name, description = '') => {
  try {
    const token = Cookies.get('token');
    const res = await axios.post(
      `${API}/create_board`,
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error('Create board error:', error);
    throw error;
  }
};


export const deleteBoard = async (boardId) => {
  try {
    const token = Cookies.get('token');
    const res = await axios.delete(
      `${API}/${boardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error('Delete board error:', error);
    throw error;
  }
};