const NewsArticle = require("../models/NewsArticle");

// @desc    Lấy tất cả bài viết tin tức
// @route   GET /api/news
// @access  Public
// exports.getAllNews = async (req, res) => {
//     try {
//         const { search, page = 1, limit = 20, sort = "new" } = req.query; // Thêm sort
//         const skip = (parseInt(page) - 1) * parseInt(limit);

//         let query = {};
//         if (search) {
//             query.title = { $regex: search, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa/thường theo tiêu đề
//         }

//         let sortOptions = {};
//         switch (sort) {
//             case "new":
//                 sortOptions.publishedAt = -1; // Mới nhất đầu tiên
//                 break;
//             case "old":
//                 sortOptions.publishedAt = 1; // Cũ nhất đầu tiên
//                 break;
//             case "views":
//                 sortOptions.views = -1; // Lượt xem nhiều nhất
//                 break;
//             // Thêm các loại sắp xếp khác nếu cần
//             default:
//                 sortOptions.publishedAt = -1;
//                 break;
//         }

//         const newsArticles = await NewsArticle.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit));

//         const totalArticles = await NewsArticle.countDocuments(query);

//         res.json({
//             articles: newsArticles,
//             totalArticles,
//             totalPages: Math.ceil(totalArticles / parseInt(limit)),
//             currentPage: parseInt(page),
//         });
//     } catch (error) {
//         console.error("Lỗi khi lấy tin tức:", error);
//         res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy tin tức." });
//     }
// };
// @desc    Get all news articles with pagination
// @route   GET /api/news
// @access  Public (or Private, depending on your auth setup)

exports.getAllNews = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const totalArticles = await NewsArticle.countDocuments();
        const totalPages = Math.ceil(totalArticles / limit);

        const results = {};

        if (endIndex < totalArticles) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }

        results.articles = await NewsArticle.find().sort({ createdAt: -1 }).limit(limit).skip(startIndex);

        results.currentPage = page;
        results.totalPages = totalPages;
        results.totalArticles = totalArticles;

        res.json(results);
    } catch (e) {
        // Bắt lỗi và gửi phản hồi lỗi trực tiếp
        console.error("Error in getAllNews controller:", e);
        res.status(500).json({ message: "Lỗi server khi lấy tin tức: " + e.message });
    }
};

// ... (các controller khác cũng cần được bọc trong try...catch tương tự)

// Ví dụ cho một controller khác (ví dụ: tạo bài viết)
exports.createNewsArticle = async (req, res) => {
    try {
        const { title, shortDescription, fullContent, imageUrl } = req.body;

        const newArticle = await NewsArticle.create({
            title,
            shortDescription,
            fullContent,
            imageUrl,
            // ... các trường khác
        });

        res.status(201).json(newArticle);
    } catch (error) {
        console.error("Error creating news article:", error);
        res.status(400).json({ message: error.message || "Lỗi khi tạo bài viết." });
    }
};
// @desc    Lấy một bài viết tin tức theo slug
// @route   GET /api/news/:slug
// @access  Public
exports.getNewsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const newsArticle = await NewsArticle.findOne({ slug });

        if (!newsArticle) {
            return res.status(404).json({ message: "Bài viết tin tức không tìm thấy." });
        }

        // Tăng lượt xem mỗi khi bài viết được truy cập
        newsArticle.views = (newsArticle.views || 0) + 1;
        await newsArticle.save();

        res.json(newsArticle);
    } catch (error) {
        console.error("Lỗi khi lấy tin tức theo slug:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy tin tức." });
    }
};

// @desc    Lấy các bài viết tin tức mới nhất (ví dụ cho sidebar)
// @route   GET /api/news/recent
// @access  Public
exports.getRecentNews = async (req, res) => {
    try {
        const recentNews = await NewsArticle.find({})
            .sort({ publishedAt: -1 }) // Mới nhất
            .limit(10);

        res.json(recentNews);
    } catch (error) {
        console.error("Lỗi khi lấy tin tức gần đây:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy tin tức gần đây." });
    }
};

// @desc    Tạo bài viết tin tức mới
// @route   POST /api/news
// @access  Private (Admin)
exports.createNewsArticle = async (req, res) => {
    try {
        const { title, shortDescription, fullContent, imageUrl } = req.body; // <-- Bỏ slug khỏi đây

        if (!title || !shortDescription || !fullContent || !imageUrl) {
            return res
                .status(400)
                .json({ message: "Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Mô tả, Nội dung, Ảnh)." });
        }

        const newArticle = new NewsArticle({
            title,
            shortDescription,
            fullContent,
            imageUrl,
            // Slug sẽ được tạo tự động bởi pre-save hook trong model
        });

        const createdArticle = await newArticle.save();
        res.status(201).json(createdArticle);
    } catch (error) {
        console.error("Lỗi khi tạo tin tức:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Tiêu đề đã tồn tại. Vui lòng chọn tiêu đề khác." }); // Thông báo rõ hơn
        }
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi tạo tin tức." });
    }
};

// @desc    Cập nhật bài viết tin tức
// @route   PUT /api/news/:id
// @access  Private (Admin)
exports.updateNewsArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, shortDescription, fullContent, imageUrl } = req.body; // <-- Bỏ slug khỏi đây

        const newsArticle = await NewsArticle.findById(id);

        if (!newsArticle) {
            return res.status(404).json({ message: "Bài viết tin tức không tìm thấy." });
        }

        newsArticle.title = title || newsArticle.title;
        newsArticle.shortDescription = shortDescription || newsArticle.shortDescription;
        newsArticle.fullContent = fullContent || newsArticle.fullContent;
        newsArticle.imageUrl = imageUrl || newsArticle.imageUrl;
        // Slug sẽ tự động cập nhật nếu title thay đổi nhờ pre-save hook

        const updatedArticle = await newsArticle.save();
        res.json(updatedArticle);
    } catch (error) {
        console.error("Lỗi khi cập nhật tin tức:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Tiêu đề đã tồn tại. Vui lòng chọn tiêu đề khác." }); // Thông báo rõ hơn
        }
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi cập nhật tin tức." });
    }
};

exports.deleteNewsArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const newsArticle = await NewsArticle.findByIdAndDelete(id);

        if (!newsArticle) {
            return res.status(404).json({ message: "Bài viết tin tức không tìm thấy." });
        }

        res.json({ message: "Bài viết tin tức đã được xóa thành công." });
    } catch (error) {
        console.error("Lỗi khi xóa tin tức:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi xóa tin tức." });
    }
};
