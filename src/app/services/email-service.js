const {EMAIL_USER} = require('../../config/env.config');

const sender = require('../../config/email.config');

module.exports = {
  sendEmail(email = {to: [''], subject: '', text: '', html: ''}) {
    email.from = EMAIL_USER;

    sender.sendMail(email, (err) => {
      if (err) return console.log('fail to send mail, error: ' + err.message);

      return console.log('Email sent successfully!');
    });
  }
}
