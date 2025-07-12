// const express = require("express");
// const {
//     createCategory,
//     getCategories,
//     getCategory,
//     updateCategory,
//     deleteCategory,
// } = require("../controllers/categoryController");

// const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Create
// router.post("/category", requireSignIn, isAdmin, createCategory);

// // Read all
// router.get("/categories", getCategories);

// // Read one
// router.get("/category/:slug", getCategory);

// // Update
// // router.put("/category/:slug", requireSignIn, isAdmin, updateCategory);
// router.put("/category/:id", requireSignIn, isAdmin, updateCategory);

// // Delete
// // router.delete("/category/:slug", requireSignIn, isAdmin, deleteCategory);
// router.delete("/category/:id", requireSignIn, isAdmin, deleteCategory);

// router.get("/category/:slug/specs", async (req, res) => {
//     try {
//         const category = await require("../models/Category").findOne({ slug: req.params.slug });
//         if (!category) return res.status(404).send({ error: "Không tìm thấy danh mục" });
//         res.send(category.specSuggestions || []);
//     } catch (err) {
//         res.status(500).send({ error: "Lỗi server khi lấy specSuggestions" });
//     }
// });

// module.exports = router;

const express = require("express");
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryTreeBySlug,
} = require("../controllers/categoryController");

const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const Category = require("../models/Category");

const router = express.Router();

// CREATE - Tạo danh mục mới
router.post("/category", requireSignIn, isAdmin, createCategory);

// READ - Lấy toàn bộ danh mục
router.get("/categories", getCategories);

// READ - Lấy một danh mục theo slug
router.get("/category/:slug", getCategory);

// READ - Lấy specSuggestions theo slug (dành cho form nhập specs động)
router.get("/category/:slug/specs", async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).send({ error: "Không tìm thấy danh mục" });
        res.send(category.specSuggestions || []);
    } catch (err) {
        res.status(500).send({ error: "Lỗi server khi lấy specSuggestions" });
    }
});

// UPDATE - Cập nhật danh mục theo ID
router.put("/category/:id", requireSignIn, isAdmin, updateCategory);

// DELETE - Xóa danh mục theo ID
router.delete("/category/:id", requireSignIn, isAdmin, deleteCategory);

// Lọc danh mục theo slug và trả về cây danh mục
router.get("/categories/tree", getCategoryTreeBySlug);

module.exports = router;
