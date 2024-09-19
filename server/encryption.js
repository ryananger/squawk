const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; // Encryption algorithm
const secretKey = process.env.ENCRYPT_KEY; // Initialization vector

const encrypt = function(message) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

  let encrypted = cipher.update(message);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  };
};

const decrypt = function(encryptedMessage) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(encryptedMessage.iv, 'hex'));

  let decrypted = decipher.update(Buffer.from(encryptedMessage.encryptedData, 'hex'));

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

module.exports = {encrypt, decrypt};

