// frontend/src/components/BoardManager.jsx

import React, { useState, useEffect } from 'react';
import { getBoards, createBoard, deleteBoard } from '../api/boardApi';

// ================================================================
// COMPONENT CHÍNH: QUẢN LÝ BOARD
// ================================================================
const BoardManager = () => {
  // State lưu danh sách boards
  const [boards, setBoards] = useState([]);
  
  // State loading
  const [loading, setLoading] = useState(true);
  
  // State cho form tạo board
  const [showForm, setShowForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [error, setError] = useState('');

  // Load danh sách boards khi component mount
  useEffect(() => {
    loadBoards();
  }, []);

  // ================================================================
  // HÀM LOAD DANH SÁCH BOARDS
  // ================================================================
  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await getBoards();
      setBoards(response.data);
    } catch (error) {
      console.error('Load boards error:', error);
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HÀM TẠO BOARD MỚI
  // ================================================================
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    
    // Validate: tên board không được rỗng
    if (!newBoardName.trim()) {
      setError('Board name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await createBoard(newBoardName.trim(), newBoardDesc.trim());
      
      // Thêm board mới vào danh sách
      setBoards([response.data, ...boards]);
      
      // Reset form
      setNewBoardName('');
      setNewBoardDesc('');
      setShowForm(false);
      setError('');
      
    } catch (error) {
      console.error('Create board error:', error);
      setError(error.response?.data?.message || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HÀM XÓA BOARD
  // ================================================================
  const handleDeleteBoard = async (boardId, boardName) => {
    // Hỏi xác nhận trước khi xóa
    if (!window.confirm(`Delete board "${boardName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteBoard(boardId);
      
      // Xóa board khỏi danh sách
      setBoards(boards.filter(board => board._id !== boardId));
      
    } catch (error) {
      console.error('Delete board error:', error);
      setError(error.response?.data?.message || 'Failed to delete board');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HIỂN THỊ LOADING
  // ================================================================
  if (loading && boards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading boards...</div>
      </div>
    );
  }

  // ================================================================
  // RENDER UI
  // ================================================================
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Boards</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showForm ? 'Cancel' : '+ Create Board'}
        </button>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form tạo board */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <form onSubmit={handleCreateBoard}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board Name *
              </label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter board name..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={newBoardDesc}
                onChange={(e) => setNewBoardDesc(e.target.value)}
                placeholder="Add a description..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="2"
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Create Board
            </button>
          </form>
        </div>
      )}

      {/* Danh sách boards */}
      {boards.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No boards created yet</p>
          <p className="text-sm">Click "Create Board" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boards.map(board => (
            <BoardCard 
              key={board._id} 
              board={board} 
              onDelete={handleDeleteBoard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ================================================================
// COMPONENT: HIỂN THỊ 1 BOARD
// ================================================================
const BoardCard = ({ board, onDelete }) => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{board.name}</h3>
          {board.description && (
            <p className="text-gray-600 text-sm mt-1">{board.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>📌 {board.pinCount || 0} pins</span>
            <span>📅 {new Date(board.createdAt).toLocaleDateString()}</span>
            <span className="text-xs">
              {board.isPublic ? '🔓 Public' : '🔒 Private'}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(board._id, board.name)}
          className="text-red-400 hover:text-red-600 transition p-1"
          title="Delete board"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BoardManager;