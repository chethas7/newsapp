// models/newsModel.js
const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
