const crypto = require('crypto');

// Derive 32-byte key for AES-256
const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'zen-wellness-secret-key-32bytes!';
const KEY = crypto.createHash('sha256').update(String(secret)).digest();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard GCM IV length

/**
 * Encrypt plain text using AES-256-GCM
 * @param {string} text 
 * @returns {string} iv:authTag:encryptedText (in hex)
 */
function encrypt(text) {
  if (!text || typeof text !== 'string') return text;
  
  // If already encrypted format, return as is
  if (/^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i.test(text)) {
    return text;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt ciphertext using AES-256-GCM
 * @param {string} ciphertext 
 * @returns {string} decrypted plain text (or original text if unencrypted)
 */
function decrypt(ciphertext) {
  if (!ciphertext || typeof ciphertext !== 'string') return ciphertext;

  // Check if string matches encryption payload format
  const parts = ciphertext.split(':');
  if (parts.length !== 3) {
    // Return unencrypted plaintext as-is (legacy backwards compatibility)
    return ciphertext;
  }

  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    if (iv.length !== IV_LENGTH || authTag.length !== 16) {
      return ciphertext;
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // If decryption fails (e.g. legacy text containing colons), fallback gracefully
    return ciphertext;
  }
}

module.exports = { encrypt, decrypt };
