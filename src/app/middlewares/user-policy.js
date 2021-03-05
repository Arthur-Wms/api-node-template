const Joi = require('joi');
const User = require('../models/User');
const {verifyToken, buildErrorResponse} = require('../../utils');
const {NOT_AUTH} = require('../../utils/codes');

module.exports = {
  async authenticate(req, res, next) {
    const schema = Joi.object({
      authorization: Joi.string().required(),
    });

    const body = {
      authorization: req.headers.authorization
    }

    const {error} = schema.validate(body);

    // Error
    if (error) return sendError(res, error);

    await verifyToken(body.authorization)
        .then(async decoded => {
          // User
          const user = await User.findOne({_id: decoded.sub});

          // User Not Found
          if (!user) throw new Error("User not found.");

          // Locals
          res.locals['User'] = user;

          next();
        }).catch(err => {
          const {status_code, response} = buildErrorResponse({code: NOT_AUTH, log: err.message, status_code: 401});

          return res.status(status_code).json(response);
        });
  },

  register(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email({minDomainSegments: 2}).required(),
      password: Joi.string().min(6).max(30).required(),
      firstName: Joi.string().min(3).max(30).required(),
      lastName: Joi.string().min(3).max(30).required(),
      ddi: Joi.string().pattern(new RegExp("^[1-9][0-9]{0,2}$")).required(),
      phone: Joi.string().pattern(new RegExp("^[0-9]{10,13}$")).required(),
      image: Joi.string().uri({}).allow(null),
      language: Joi.string(),
    });

    const {error} = schema.validate(req.body);

    // Error
    if (error) return sendError(res, error);

    next();
  },

  login(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const {error} = schema.validate(req.body);

    // Error
    if (error) return sendError(res, error);

    next();
  },

  localAuth(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const {error} = schema.validate(req.body);

    // Error
    if (error) return sendError(res, error)

    next();
  },


}

function sendError(res, error) {
  const {context, message} = error.details[0] ? error.details[0] : {};

  return res.status(400)
      .json({
        invalid_key: context.key,
        message: message.replace(/"/g, '')
      });
}
