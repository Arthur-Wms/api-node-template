const service = require('../services/user-service');

module.exports = {
  async register(req, res) {
    return await service.createUser(req.body)
        .then(resolve => res.status(resolve.status_code || 200).json(resolve.response))
        .catch(reject => res.status(reject.status_code || 400).json(reject.response));
  },

  async localAuth(req, res) {
    return await service.localAuth(req.body)
        .then(resolve => res.status(resolve.status_code || 200).json(resolve.response))
        .catch(reject => res.status(reject.status_code || 400).json(reject.response));
  },

  async loadSession(req, res) {
    // User
    const user = res.locals['User'];

    return await service.loadSession(user, {language: user.language})
        .then(resolve => res.status(resolve.status_code || 200).json(resolve.response))
        .catch(reject => res.status(reject.status_code || 400).json(reject.response));
  },

  async validateEmail(req, res) {
    const token = req.query.t;

    return await service.validateEmail({token})
        .then(resolve => res.status(resolve.status_code || 200).json(resolve.response))
        .catch(reject => res.status(reject.status_code || 400).json(reject.response));
  },

};
