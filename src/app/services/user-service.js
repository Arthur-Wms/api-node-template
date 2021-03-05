const User = require('../models/User');
const emailService = require('./email-service');
const registerEmail = require('../../utils/mails/register-email');
const {JWT_SECRET_SECONDARY} = require('../../config/env.config');

const {default_language, buildSuccessResponse, buildErrorResponse, buildMessage, comparePass, generateToken} = require('../../utils');
const {USR_CRE, USR_BCR, NOT_FOUND} = require('../../utils/codes');

module.exports = {
  async createUser(body, options = defOptions) {
    return await new Promise(async (resolve, reject) => {
      try {
        // Create
        const user = await User.create(body);

        const userResponse = await User.findById(user._id);

        // Email
        const html = registerEmail.getHTML(generateToken({sub: user._id}, JWT_SECRET_SECONDARY, '15d'));
        emailService.sendEmail({to: user.email, subject: 'Validação da conta.', html})

        const response = buildSuccessResponse({
          body: userResponse,
          status_code: 201,
          message: buildMessage(USR_CRE, options.language),
        });

        return resolve(response);
      } catch (err) {
        const response = buildErrorResponse({
          log: err.message,
        });
        return reject(response);
      }
    });
  },

  async localAuth(body, options = defOptions) {
    return await new Promise(async (resolve, reject) => {
      try {
        // User
        const user = await User.findOne({email: body.email.toLowerCase()}, {password: 1});

        if (!user)
          return reject(buildErrorResponse({
            message: buildMessage(USR_BCR, options.language),
            code: USR_BCR
          }));

        const passCheck = await comparePass(body.password, user.password);

        // Invalid Pass
        if (!passCheck)
          return reject(buildErrorResponse({
            message: buildMessage(USR_BCR, options.language),
            code: USR_BCR
          }));

        // Token
        const accessToken = generateToken({sub: user._id});

        // User Response
        const userResponse = await User.findById(user._id);

        // Response Body
        const responseBody = {
          token: accessToken,
          user: userResponse
        }

        const response = buildSuccessResponse({
          body: responseBody
        });

        return resolve(response);
      } catch (err) {
        const response = buildErrorResponse({
          log: err.message,
        });
        return reject(response);
      }
    });
  },

  async loadSession(body, options = defOptions) {
    return await new Promise(async (resolve, reject) => {
      try {
        // User
        const user = await User.findById(body._id);

        if (!user)
          return reject(buildErrorResponse({
            message: buildMessage(NOT_FOUND, options.language),
            code: NOT_FOUND
          }));

        // Token
        const accessToken = generateToken({sub: user._id});

        // Response
        const response = buildSuccessResponse({
          token: accessToken,
          body: user,
        });

        return resolve(response);
      } catch (err) {
        const response = buildErrorResponse({
          log: err.message,
        });
        return reject(response);
      }
    });
  },

}

const defOptions = {language: default_language}
