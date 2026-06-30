
const Board = require('../models/Board');


exports.createBoard = async (req, res) => {
  try {
    // Lấy dữ liệu từ body request
    const { name, description, isPublic } = req.body;
    
    // Lấy userId từ user đã đăng nhập
    const userId = req.user._id;

    // Kiểm tra xem đã có board nào trùng tên chưa
    const existingBoard = await Board.findOne({ userId, name });
    
    if (existingBoard) {
      return res.status(400).json({
        success: false,
        message: 'Board name already exists. Please choose another name.'
      });
    }

    // Tạo board mới
    const board = await Board.create({
      userId,
      name: name.trim(),
      description: description || '',
      isPublic: isPublic !== undefined ? isPublic : true
    });

    // Trả về kết quả thành công
    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      data: board
    });

  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create board',
      error: error.message
    });
  }
};


exports.deleteBoard = async (req, res) => {
  try {
    // Lấy boardId từ URL params
    const { boardId } = req.params;
    
    // Lấy userId từ user đã đăng nhập
    const userId = req.user._id;

    // Tìm và xóa board (chỉ xóa nếu thuộc về user này)
    const board = await Board.findOneAndDelete({ 
      _id: boardId, 
      userId: userId 
    });
    
    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found or you do not have permission to delete it'
      });
    }

    // Trả về kết quả thành công
    res.json({
      success: true,
      message: 'Board deleted successfully',
      data: {
        boardId: board._id,
        boardName: board.name
      }
    });

  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete board',
      error: error.message
    });
  }
};

///lấy ds board
exports.getBoards = async (req, res) => {
  try {
    const userId = req.user._id;

    // Lấy tất cả board của user
    const boards = await Board.find({ userId })
      .sort({ createdAt: -1 })  
      .lean();

    res.json({
      success: true,
      total: boards.length,
      data: boards
    });

  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get boards',
      error: error.message
    });
  }
};