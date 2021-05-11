require('dotenv').config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 4000,
  SERVER_IP: process.env.SERVER_IP || '127.0.0.1',
  SERVER_BASE_URL: process.env.SERVER_BASE_URL || 'http://localhost:4000',
  DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1/template',
  JWT_SECRET: process.env.JWT_SECRET || 'sec_123abc$S',
  JWT_EXP: process.env.JWT_EXP || '10m',
  EMAIL_USER: process.env.EMAIL_USER || 'teste@email.com',
  EMAIL_PASS: process.env.EMAIL_PASS || '#Pass123',
  AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID || '',
  AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET || '',
  AUTH_GOOGLE_CALLBACK_URL: process.env.AUTH_GOOGLE_CALBACK_URL || '',
}
