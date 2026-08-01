const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Transparently encrypt content before saving
JournalSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.content = encrypt(this.content);
  }
  next();
});

// Transparently decrypt content when retrieving documents
JournalSchema.post('init', function (doc) {
  if (doc && doc.content) {
    doc.content = decrypt(doc.content);
  }
});

module.exports = mongoose.model('Journal', JournalSchema);
 