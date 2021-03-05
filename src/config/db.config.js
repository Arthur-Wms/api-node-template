const mongoose = require('mongoose');
const {DB_URI} = require('../config/env.config');

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error);
db.once("open", () => console.log("Successfully Connection on database: " + DB_URI));

module.exports = mongoose;
