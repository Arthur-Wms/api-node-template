const User = require('../models/User');
const emailService = require('./email-service');
const registerEmail = require('../../utils/mails/validate-email');
const {JWT_SECRET_SECONDARY} = require('../../config/env.config');

const auth = require('../../config/auth.config');

const {OAuth2Client} = require('google-auth-library');
const googleClient = new OAuth2Client(auth.googleAuth.clientID, auth.googleAuth.clientSecret, auth.googleAuth.callbackURL);

const {
  default_language,
  available_languages,
  buildSuccessResponse,
  buildErrorResponse,
  buildMessage,
  comparePass,
  generateToken,
  verifyToken
} = require('../../utils');
const {USR_CRE, USR_BCR, NOT_FOUND, EMA_VLD, SUCCESS, ERR} = require('../../utils/codes');

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

  async googleAuth(token, options = {}) {
    return await new Promise(async (resolve, reject) => {
      try {
        await googleClient.verifyIdToken({
          idToken: token,
        }).then(async ticket => {
          const payload = ticket.getPayload();

          // User
          let user = await User.findOne({email: payload.email});

          // Create User
          if (!user)
            user = await User.create({
              email: payload.email,
              firstName: payload.given_name,
              lastName: payload.family_name,
              image: payload.picture,
              validatedEmail: true,
              language: available_languages.includes(payload.locale.substring(0, 2)) ?
                  payload.locale.substring(0, 2) : default_language
            });

          // Token
          const accessToken = generateToken({sub: user._id});

          // Response Body
          const responseBody = {
            token: accessToken,
            user: user
          }

          return resolve(buildSuccessResponse({
            message: buildMessage(SUCCESS, options.language),
            body: responseBody,
          }));
        });
      } catch (err) {
        console.log(err.message);
        return reject(buildErrorResponse({
          message: buildMessage(ERR, options.language),
          log: err.message
        }))
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

  async validateEmail(body, options = defOptions) {
    return await new Promise(async (resolve, reject) => {
      try {
        await verifyToken(body.token, JWT_SECRET_SECONDARY)
            .then(async decoded => {
              const user = await User.updateOne({_id: decoded.sub}, {$set: {validatedEmail: true}});

              // Response
              const response = buildSuccessResponse({
                code: EMA_VLD,
                language: options.language,
                body: user
              });

              return resolve(response);
            })
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
