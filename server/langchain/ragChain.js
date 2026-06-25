/**
 * RAG Chain — assembles the full LangChain LCEL pipeline:
 *   History-Aware Retriever → Stuff Documents → ChatGroq (LLaMA 3.3 70B)
 *   Wrapped in RunnableWithMessageHistory for automatic MongoDB persistence
 */
const { ChatGroq } = require('@langchain/groq');
const { createHistoryAwareRetriever } = require('langchain/chains/history_aware_retriever');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');
const { createRetrievalChain } = require('langchain/chains/retrieval');
const { RunnableWithMessageHistory } = require('@langchain/core/runnables');

const { getRetriever } = require('./vectorStore');
const { chatPrompt, historyAwarePrompt } = require('./prompts');
const { MongoDBChatMessageHistory } = require('./mongoMemory');

let ragChainWithHistory = null;

/**
 * Initialize the full RAG chain (call once at server startup).
 * Subsequent calls return the cached singleton.
 */
const initRagChain = async () => {
  if (ragChainWithHistory) return ragChainWithHistory;

  // 1. LLM — Groq free tier, LLaMA 3.3 70B
  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    maxTokens: 1024,
  });

  // 2. Retriever (semantic search over mental health KB)
  const retriever = await getRetriever(4); // top-4 relevant documents

  // 3. History-aware retriever — reformulates query given chat history
  //    e.g. "tell me more" → "more about anxiety breathing techniques"
  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  // 4. Document chain — stuffs retrieved docs into the prompt {context}
  const documentChain = await createStuffDocumentsChain({
    llm,
    prompt: chatPrompt,
  });

  // 5. Retrieval chain — connects retriever + document chain
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever: historyAwareRetriever,
  });

  // 6. Wrap with message history — auto-persists to MongoDB each turn
  ragChainWithHistory = new RunnableWithMessageHistory({
    runnable: retrievalChain,
    getMessageHistory: ({ userId }) =>
      new MongoDBChatMessageHistory({ userId }),
    inputMessagesKey: 'input',
    historyMessagesKey: 'chat_history',
    outputMessagesKey: 'answer',
  });

  console.log('✅ RAG Chain initialized (LangChain + LLaMA 3.3 70B + local embeddings)');
  return ragChainWithHistory;
};

/**
 * Send a message through the RAG chain.
 * @param {string} message - User's message
 * @param {string} userId  - MongoDB user ID (used as session key)
 * @returns {Promise<string>} - AI response
 */
const chat = async ({ message, userId }) => {
  const chain = await initRagChain();

  const result = await chain.invoke(
    { input: message },
    {
      configurable: {
        sessionId: userId.toString(),
        userId: userId.toString(),
      },
    }
  );

  return result.answer;
};

module.exports = { initRagChain, chat };
