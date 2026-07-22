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
    <div className="board-manager-container">
      {/* Header */}
      <div className="collections-header-row">
        <h2>My Boards</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-add-collection-styled"
        >
          {showForm ? 'Cancel' : '+ Create Board'}
        </button>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Form tạo board */}
      {showForm && (
        <div className="board-form-card">
          <form onSubmit={handleCreateBoard}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--admin-text-secondary)' }}>Board Name *</label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter board name..."
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text-primary)' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--admin-text-secondary)' }}>Description (optional)</label>
              <textarea
                value={newBoardDesc}
                onChange={(e) => setNewBoardDesc(e.target.value)}
                placeholder="Add a description..."
                rows="2"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text-primary)' }}
              />
            </div>
            
            <button
              type="submit"
              className="btn-add-collection-styled"
            >
              Create Board
            </button>
          </form>
        </div>
      )}

      {/* Danh sách boards */}
      {boards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No boards created yet</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Click "Create Board" to get started</p>
        </div>
      ) : (
        <div className="board-grid">
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
    <div className="board-card-styled">
      <div className="board-card-header">
        <div style={{ flex: 1 }}>
          <h3 className="board-card-title">{board.name}</h3>
          {board.description && (
            <p className="board-desc">{board.description}</p>
          )}
        </div>
        
        <button
          onClick={() => onDelete(board._id, board.name)}
          className="board-delete-btn"
          title="Delete board"
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        </button>
      </div>
      
      <div className="board-meta-row">
        <span>📌 {board.pinCount || 0} pins</span>
        <span>📅 {new Date(board.createdAt).toLocaleDateString()}</span>
        <span>
          {board.isPublic ? '🔓 Public' : '🔒 Private'}
        </span>
      </div>
    </div>
  );
};

export default BoardManager;
