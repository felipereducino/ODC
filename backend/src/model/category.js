const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

mongoose.model('Category', CategorySchema);
