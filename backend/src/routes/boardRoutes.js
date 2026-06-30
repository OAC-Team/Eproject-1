
const express = require('express');
const router = express.Router();

// Import middleware xác thực
const { verifyToken } = require('../middlewares/auth');

// Import controller
const {
  createBoard,
  deleteBoard,
  getBoards
} = require('../controllers/boardController');

router.use(verifyToken);

// GET /api/boards - Lấy danh sách boards
router.get('/', getBoards);

router.post('/', createBoard);

router.delete('/:boardId', deleteBoard);

module.exports = router;