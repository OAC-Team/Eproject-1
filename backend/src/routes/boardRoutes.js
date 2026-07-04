
const express = require('express');
const router = express.Router();

// Import middleware xác thực
const { auth } = require('../middlewares/auth');

// Import controller
const {
  createBoard,
  deleteBoard,
  getBoards
} = require('../controllers/boardController');

router.use(auth);

// GET /api/boards - Lấy danh sách boards
router.get('/', getBoards);

router.post('/create_board', createBoard);

router.delete('/:boardId', deleteBoard);

module.exports = router;