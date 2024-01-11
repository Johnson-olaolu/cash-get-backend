const secretKey = 'your-secret-key';
// const algorithm = 'aes-256-cbc';
const secretIv = 'secret';
const ecnryptionMethod = 'aes-256-cbc';
import * as crypto from 'crypto';

// export function encrypt(text) {
//   // const iv = crypto.randomBytes(ivLength);
//   // const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
//   // let encrypted = cipher.update(text, 'utf-8', 'hex');
//   // encrypted += cipher.final('hex');
//   // return `${iv.toString('hex')}:${encrypted}`;
//   const encrypted = crypto.AES.encrypt("TestBird", "test");

// console.log(encrypted.toString());
// }

// export function decrypt(text) {
//   const [iv, encryptedText] = text.split(':');
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     Buffer.from(secretKey),
//     Buffer.from(iv, 'hex'),
//   );
//   let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
//   decrypted += decipher.final('utf-8');
//   return decrypted;
// }

const key = crypto
  .createHash('sha512')
  .update(secretKey)
  .digest('hex')
  .substring(0, 32);
const encryptionIV = crypto
  .createHash('sha512')
  .update(secretIv)
  .digest('hex')
  .substring(0, 16);

// Encrypt data
export function encryptData(data) {
  const cipher = crypto.createCipheriv(ecnryptionMethod, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
  ).toString('base64'); // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, 'base64');
  const decipher = crypto.createDecipheriv(ecnryptionMethod, key, encryptionIV);
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  ); // Decrypts data and converts to utf8
}
