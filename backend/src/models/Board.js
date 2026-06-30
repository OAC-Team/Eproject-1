
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  name: {
    type: String,
    required: true,           
    trim: true,               
    maxLength: 100            
  },
  
  // description: Mô tả board (không bắt buộc)
  description: {
    type: String,
    trim: true,
    maxLength: 500,
    default: ''               // Mặc định là rỗng
  },
  
 
  isPublic: {
    type: Boolean,
    default: true             
  },
  

  pinCount: {
    type: Number,
    default: 0
  },
  

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true           
});


boardSchema.index({ userId: 1, name: 1 }, { unique: true });


module.exports = mongoose.model('Board', boardSchema);