const { encrypt, decrypt } = require('../utils/encryption');

describe('AES-256-GCM Encryption Utility', () => {
  it('should encrypt plaintext into IV:authTag:ciphertext format', () => {
    const text = 'Sensitive journal content about stress at work';
    const encrypted = encrypt(text);

    expect(encrypted).not.toBe(text);
    expect(encrypted.split(':').length).toBe(3);
  });

  it('should accurately decrypt ciphertext back to original plaintext', () => {
    const originalText = 'Today I felt calm and practiced box breathing';
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(originalText);
  });

  it('should handle legacy unencrypted plaintext gracefully', () => {
    const plainText = 'Legacy unencrypted entry';
    const decrypted = decrypt(plainText);

    expect(decrypted).toBe(plainText);
  });

  it('should handle empty or non-string inputs safely', () => {
    expect(encrypt(null)).toBeNull();
    expect(decrypt(null)).toBeNull();
    expect(encrypt('')).toBe('');
  });
});
