// routes/newsRoutes.js
const express = require("express");
const newsController = require("../controllers/newsController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware"); // Add this line
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", newsController.getNews);
router.put("/:id", newsController.markNewsAsRead);

// Routes protected by admin authentication
router.post("/", adminAuthMiddleware, newsController.addNews);
router.put("/:id", adminAuthMiddleware, newsController.updateNews);
router.delete("/:id", adminAuthMiddleware, newsController.deleteNews);

module.exports = router;
