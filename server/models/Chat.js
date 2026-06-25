const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: { type: String },
  message: { type: String, required: true },
  isUser: { type: Boolean, required: true },
  createdAt: { type: String }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema]
});

module.exports = mongoose.model('Chat', chatSchema);