// controllers/newsController.js
const News = require("../models/newsModel");

const getNews = async (req, res) => {
  try {
    // Get the user ID from the authenticated user's request object (added by authMiddleware)
    const userId = req.user._id;

    // Retrieve all news articles from the database
    const allNews = await News.find();

    // Separate the news into two arrays: unread and read news
    const unreadNews = allNews.filter((news) => !news.readBy.includes(userId));
    const readNews = allNews.filter((news) => news.readBy.includes(userId));

    // Combine the arrays, with unread news coming first
    const newsToShow = [...unreadNews, ...readNews];

    res.status(200).json(newsToShow);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving news", error });
  }
};

// const markNewsAsRead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await News.findByIdAndUpdate(id, { isRead: true });
//     res.status(200).json({ message: "News marked as read" });
//   } catch (error) {
//     res.status(500).json({ message: "Error marking news as read", error });
//   }
// };

const markNewsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const newsId = req.params.newsId;

    // Check if the news article exists
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News article not found." });
    }

    // Check if the news article has already been read by the user
    if (!news.readBy.includes(userId)) {
      // If not read, add the user's ID to the "readBy" array
      news.readBy.push(userId);

      // Save the updated news article
      await news.save();
    }

    res.status(200).json({ message: "News marked as read successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error marking news as read.", error });
  }
};

const addNews = async (req, res) => {
  try {
    const { title, subtitle, author, publishedDate } = req.body;
    const news = new News({ title, subtitle, author, publishedDate });
    await news.save();
    res.status(201).json({ message: "News added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding news", error });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, author, publishedDate } = req.body;
    await News.findByIdAndUpdate(id, {
      title,
      subtitle,
      author,
      publishedDate,
    });
    res.status(200).json({ message: "News updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating news", error });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news", error });
  }
};

module.exports = { getNews, markNewsAsRead, addNews, updateNews, deleteNews };
