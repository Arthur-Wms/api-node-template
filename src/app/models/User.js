const bcrypt = require('bcryptjs');

const {Schema, model} = require('../../config/db.config');
const {available_languages, default_language} = require('../../utils/index');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  ddi: {
    type: String,
  },
  phone: {
    type: String,
  },
  language: {
    type: String,
    enum: available_languages,
    default: default_language,
    lowercase: true,
    required: true
  },
  validatedEmail: {
    type: Boolean,
    default: false
  },
  validatedPhone: {
    type: Boolean,
    default: false
  },
}, {versionKey: false, timestamps: true});

UserSchema.index({email: "text"});

UserSchema.pre('save', async function (next) {
  if (!this.password)
    next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = model('User', UserSchema);
