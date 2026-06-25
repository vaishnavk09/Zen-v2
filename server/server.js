const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many messages sent. Please wait 15 minutes.' }
});

app.use('/api/chatbot/message', chatLimiter);
// Import routes
const userRoutes = require('./routes/userRoutes');
const journalRoutes = require('./routes/journalRoutes');
const moodRoutes = require('./routes/moodRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Use API routes FIRST
app.use('/api/users', userRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use("/api/contact", contactRoutes);
// Serve static assets ONLY after API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// ENABLE ERROR HANDLING (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
