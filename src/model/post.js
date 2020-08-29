const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

mongoose.model('Post', PostSchema);
