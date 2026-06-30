
import axios from 'axios';

// Base URL
const API = 'http://localhost:5000/api/boards';

// Lấy token từ localStorage
const getToken = () => localStorage.getItem('token');


export const getBoards = async () => {
  try {
    const res = await axios.get(
      API,
      { 
        headers: { 
          Authorization: `Bearer ${getToken()}` 
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
    const res = await axios.post(
      API,
      { name, description },
      { 
        headers: { 
          Authorization: `Bearer ${getToken()}` 
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
    const res = await axios.delete(
      `${API}/${boardId}`,
      { 
        headers: { 
          Authorization: `Bearer ${getToken()}` 
        } 
      }
    );
    return res.data;
  } catch (error) {
    console.error('Delete board error:', error);
    throw error;
  }
};