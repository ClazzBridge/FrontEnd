const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username is unique"],
  },
  token: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
});