/**
 * Vector Store — local embeddings via @xenova/transformers (100% free, no API key)
 * Uses sentence-transformers/all-MiniLM-L6-v2 running locally in Node.js
 */
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { HuggingFaceTransformersEmbeddings } = require('@langchain/community/embeddings/hf_transformers');
const { mentalHealthDocuments } = require('./knowledgeBase');

let vectorStore = null;

const initVectorStore = async () => {
  if (vectorStore) return vectorStore;

  console.log('⏳ Loading local embedding model (first run downloads ~25MB)...');

  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2', // quantized, runs locally, free
  });

  vectorStore = await MemoryVectorStore.fromDocuments(
    mentalHealthDocuments,
    embeddings
  );

  console.log(`✅ Vector store ready — ${mentalHealthDocuments.length} documents indexed`);
  return vectorStore;
};

const getRetriever = async (k = 4) => {
  const store = await initVectorStore();
  return store.asRetriever({ k });
};

module.exports = { initVectorStore, getRetriever };
