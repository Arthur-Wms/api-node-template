const {AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET, AUTH_GOOGLE_CALLBACK_URL} = require('./env.config');

module.exports = {
  googleAuth: {
    clientID: AUTH_GOOGLE_CLIENT_ID,
    clientSecret: AUTH_GOOGLE_CLIENT_SECRET,
    callbackURL: AUTH_GOOGLE_CALLBACK_URL,
  }
}
