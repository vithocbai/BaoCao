
const express = require("express");
const {
    getAllNews,
    getNewsBySlug,
    getRecentNews,
    createNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
} = require("../controllers/newsArticleController");
const { protect } = require("../middleware/authMiddleware"); // <-- Import middleware

const router = express.Router();

// Public routes
router.get("/", getAllNews);
router.get("/recent", getRecentNews);
router.get("/:slug", getNewsBySlug);

// Admin routes (Áp dụng middleware `protect`)
router.post("/", protect, createNewsArticle); // <-- Thêm protect
router.put("/:id", protect, updateNewsArticle); // <-- Thêm protect
router.delete("/:id", protect, deleteNewsArticle); // <-- Thêm protect

module.exports = router;
