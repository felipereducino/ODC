const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    social: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
    photo: String,
  },
  {
    timestamps: true,
  }
);

mongoose.model('User', UserSchema);
