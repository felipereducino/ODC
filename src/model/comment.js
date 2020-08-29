const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

mongoose.model('Comment', CommentSchema);
