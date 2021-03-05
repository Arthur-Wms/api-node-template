const {SUCCESS, ERR} = require('./codes');
const {JWT_SECRET, JWT_EXP} = require('../config/env.config');

const pt = require('./locale/pt.locale.json');
const en = require('./locale/en.locale.json');
const languages = {pt, en};
const available_languages = ['pt', 'en'];
const default_language = 'pt';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  available_languages, default_language, buildMessage,

  buildSuccessResponse: ({message = "", body = {}, code = SUCCESS, status_code = 200}) => {
    const response = {
      status_code: status_code,
      response: {
        success: true,
        code, message, body,
      },
    };

    if (!message || message.length < 1)
      response.response.message = buildMessage(code || SUCCESS, default_language);

    return response;
  },

  buildErrorResponse: ({message = "", log = "", body = {}, code = ERR, status_code = 400}) => {
    const response = {
      status_code: status_code,
      response: {
        success: false,
        code, message, log, body,
      }
    }

    if (!message || message.length < 1)
      response.response.message = buildMessage(code || ERR, default_language);

    return response;
  },

  comparePass: (pass, hash) => {
    return bcrypt.compare(pass, hash)
        .then(result => result)
        .catch(err => console.log(err.message));
  },

  generateToken: (payload = {sub: null}, secret = JWT_SECRET, exp = JWT_EXP) => {
    if (!payload.sub) throw new Error("Sub not informed.");

    return jwt.sign(payload, secret, {expiresIn: exp});
  },

  verifyToken(token) {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);

        return resolve(decoded);
      } catch (err) {
        return reject({message: err.message});
      }
    })
  }

}

function buildMessage(key = '', lang = default_language) {
  // Default
  if (!available_languages.includes(lang))
    lang = default_language;

  return languages[lang][key] || key || "";
}
