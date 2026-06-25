/**
 * MongoDB-backed Chat Message History for LangChain
 * Implements BaseListChatMessageHistory so LangChain's
 * RunnableWithMessageHistory auto-persists messages.
 */
const { BaseListChatMessageHistory } = require('@langchain/core/chat_history');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');
const Chat = require('../models/Chat');

class MongoDBChatMessageHistory extends BaseListChatMessageHistory {
  // Required by LangChain serialization
  lc_namespace = ['zen', 'memory', 'mongodb'];

  constructor({ userId }) {
    super();
    this.userId = userId;
  }

  /**
   * Load the last 20 messages from MongoDB for this user.
   */
  async getMessages() {
    try {
      const chat = await Chat.findOne({ userId: this.userId }).lean();
      if (!chat || !chat.messages?.length) return [];

      return chat.messages.slice(-20).map((msg) =>
        msg.isUser
          ? new HumanMessage(msg.message)
          : new AIMessage(msg.message)
      );
    } catch (err) {
      console.error('MongoDBChatMessageHistory.getMessages error:', err.message);
      return [];
    }
  }

  /**
   * Called automatically by RunnableWithMessageHistory after each turn.
   */
  async addMessage(message) {
    try {
      const isUser = message._getType() === 'human';
      const content =
        typeof message.content === 'string'
          ? message.content
          : JSON.stringify(message.content);

      await Chat.findOneAndUpdate(
        { userId: this.userId },
        {
          $push: {
            messages: {
              _id: `${isUser ? 'user' : 'bot'}-${Date.now()}`,
              message: content,
              isUser,
              createdAt: new Date(),
            },
          },
          $setOnInsert: { userId: this.userId },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('MongoDBChatMessageHistory.addMessage error:', err.message);
    }
  }

  async clear() {
    await Chat.findOneAndUpdate({ userId: this.userId }, { messages: [] });
  }
}

module.exports = { MongoDBChatMessageHistory };
