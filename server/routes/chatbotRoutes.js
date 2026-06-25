/**
 * Chatbot Routes — RAG-powered with LangChain + LLaMA 3.3 70B
 * Preserves: JWT auth, crisis detection, rate limiting
 */
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect: auth } = require('../middleware/auth');
const crisisDetection = require('../middleware/crisisDetection');
const { chat: ragChat, initRagChain } = require('../langchain/ragChain');

// ─── Warm up RAG chain at route load time ─────────────────────────────────
// (vector store + model load happens once; subsequent requests are fast)
initRagChain().catch((err) =>
  console.error('RAG chain init error:', err.message)
);

// ─── GET /api/chatbot/messages — fetch chat history ───────────────────────
router.get('/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user.id });
    const messages = chat ? chat.messages : [];
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not fetch messages' });
  }
});

// ─── POST /api/chatbot/message — RAG-powered response ────────────────────
// Rate limited in server.js (20 messages / 15 min)
router.post('/message', auth, crisisDetection, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }
    if (message.trim().length > 1000) {
      return res.status(400).json({ success: false, error: 'Message too long. Max 1000 characters.' });
    }

    // Call RAG chain — retrieves KB context, applies few-shot + CoT prompting,
    // and auto-persists both user + bot messages to MongoDB via MongoDBChatMessageHistory
    const replyText = await ragChat({ message: message.trim(), userId });

    // Build response objects matching frontend format
    const userMessage = {
      _id: `user-${Date.now()}`,
      message: message.trim(),
      isUser: true,
      createdAt: new Date().toISOString(),
    };

    const botMessage = {
      _id: `bot-${Date.now()}`,
      message: replyText,
      isUser: false,
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: { userMessage, botMessage },
    });

  } catch (error) {
    console.error('RAG chatbot error:', error.message);
    res.status(500).json({ success: false, error: 'Something went wrong. Please try again.' });
  }
});

// ─── DELETE /api/chatbot/messages — clear chat history ───────────────────
router.delete('/messages', auth, async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user.id },
      { messages: [] }
    );
    res.json({ success: true, message: 'Chat cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not clear chat' });
  }
});

module.exports = router;