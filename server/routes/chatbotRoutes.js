/**
 * Chatbot Routes — RAG-powered with LangChain + LLaMA 3.3 70B
 * Preserves: JWT auth, crisis detection, rate limiting
 */
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const { protect: auth } = require('../middleware/auth');
const crisisDetection = require('../middleware/crisisDetection');
const { chat: ragChat, chatStream, initRagChain } = require('../langchain/ragChain');

// ─── Warm up RAG chain at route load time ─────────────────────────────────
initRagChain().catch((err) =>
  console.error('RAG chain init error:', err.message)
);

/**
 * Helper to fetch recent wellness context (Moods & Journal entries) for user context fusion
 */
async function getUserWellnessContext(userId) {
  try {
    const recentMoods = await Mood.find({ user: userId }).sort({ date: -1 }).limit(3);
    const recentJournals = await Journal.find({ user: userId }).sort({ date: -1 }).limit(2);

    let contextStr = '';
    if (recentMoods && recentMoods.length > 0) {
      const moodSummaries = recentMoods.map(m => `Score: ${m.mood}/5 (${m.notes || 'No note'}), tags: [${(m.tags || []).join(', ')}]`);
      contextStr += `Recent Mood Logs: ${moodSummaries.join(' | ')}. `;
    }

    if (recentJournals && recentJournals.length > 0) {
      const journalSummaries = recentJournals.map(j => `Title: "${j.title}" - ${j.content ? j.content.slice(0, 100) : ''}...`);
      contextStr += `Recent Journal Entries: ${journalSummaries.join(' | ')}.`;
    }

    return contextStr || 'User has no recent mood or journal entries.';
  } catch (err) {
    return 'Context retrieval unavailable.';
  }
}

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

// ─── POST /api/chatbot/message — Standard RAG-powered response ────────────
router.post('/message', auth, crisisDetection, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }
    if (message.trim().length > 1000) {
      return res.status(400).json({ success: false, error: 'Message too long. Max 1000 characters.' });
    }

    const userContext = await getUserWellnessContext(userId);
    const replyText = await ragChat({ message: message.trim(), userId, userContext });

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

// ─── POST /api/chatbot/stream — SSE Token Streaming RAG Response ────────
router.post('/stream', auth, crisisDetection, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const userContext = await getUserWellnessContext(userId);

    let accumulatedAnswer = '';
    await chatStream({
      message: message.trim(),
      userId,
      userContext,
      onToken: (token) => {
        accumulatedAnswer += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    });

    const userMessage = {
      _id: `user-${Date.now()}`,
      message: message.trim(),
      isUser: true,
      createdAt: new Date().toISOString(),
    };

    const botMessage = {
      _id: `bot-${Date.now()}`,
      message: accumulatedAnswer,
      isUser: false,
      createdAt: new Date().toISOString(),
    };

    res.write(`data: ${JSON.stringify({ done: true, data: { userMessage, botMessage } })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Streaming RAG chatbot error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Streaming error occurred.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Streaming interrupted' })}\n\n`);
      res.end();
    }
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