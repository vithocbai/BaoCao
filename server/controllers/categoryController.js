const Category = require("../models/Category");
const slugify = require("slugify");

// POST /api/category
const createCategory = async (req, res) => {
    try {
        const { name, icon, specSuggestions, parent } = req.body;

        if (!name) return res.status(400).send({ error: "Tên danh mục là bắt buộc" });

        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).send({ error: "Danh mục đã tồn tại" });

        const slug = slugify(name, { lower: true });

        const category = new Category({
            name,
            icon,
            specSuggestions,
            slug,
            parent: parent || null,
        });

        await category.save();
        res.status(201).send(category);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Lỗi server khi tạo danh mục" });
    }
};

// GET /api/category/:slug
const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug }).populate("parent", "name slug");

        if (!category) return res.status(404).send({ error: "Không tìm thấy danh mục" });
        res.send(category);
    } catch (err) {
        res.status(500).send({ error: "Lỗi server" });
    }
};

// GET /api/categories
const getCategories = async (req, res) => {
    try {
        const { parent } = req.query;

        if (parent) {
            // Tìm danh mục cha theo slug
            const parentCategory = await Category.findOne({ slug: parent });
            if (!parentCategory) {
                return res.status(404).json({ error: "Không tìm thấy danh mục cha" });
            }

            // Lấy danh sách danh mục con theo parent _id
            const children = await Category.find({ parent: parentCategory._id });
            return res.json(children);
        }

        // Nếu không có query ?parent thì trả tất cả
        const categories = await Category.find().populate("parent", "name slug").sort({ createdAt: -1 });

        res.json(categories);
    } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        res.status(500).json({ error: "Lỗi khi lấy danh mục" });
    }
};

// PUT /api/category/:id
const updateCategory = async (req, res) => {
    try {
        const { name, icon, specSuggestions, parent } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send({ error: "Không tìm thấy danh mục" });

        if (name) category.name = name;
        if (icon) category.icon = icon;
        if (specSuggestions) category.specSuggestions = specSuggestions;
        if (parent !== undefined) category.parent = parent || null;

        category.slug = slugify(category.name, { lower: true });

        await category.save();
        res.send(category);
    } catch (err) {
        console.error(err);
        res.status(510).send({ error: "Lỗi cập nhật danh mục" });
    }
};

// DELETE /api/category/:id
const deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send({ error: "Danh mục không tồn tại" });

        res.send({ message: "Xóa danh mục thành công" });
    } catch (err) {
        res.status(500).send({ error: "Lỗi khi xóa danh mục" });
    }
};

// Gọi Điện thoại
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        if (category) {
            const parentCat = await Category.findOne({ slug: category });
            if (!parentCat) {
                return res.status(404).json({ error: "Danh mục không tồn tại" });
            }

            // Lấy danh sách danh mục con
            const subCats = await Category.find({ parent: parentCat._id });
            const subCatIds = subCats.map((c) => c._id);

            // Lọc sản phẩm theo category nằm trong danh sách subCatIds
            const products = await Product.find({
                category: { $in: subCatIds },
            });

            return res.json(products);
        }

        // Nếu không có query category
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        res.status(500).json({ error: "Lỗi server khi lấy sản phẩm" });
    }
};

// Hàm đệ quy lấy tất cả danh mục con
const getAllChildCategories = async (parentId, allCategories) => {
    const children = allCategories.filter((cat) => String(cat.parent) === String(parentId));
    let result = [...children];

    for (let child of children) {
        const subChildren = await getAllChildCategories(child._id, allCategories);
        result = result.concat(subChildren);
    }

    return result;
};

// Controller: GET /api/categories/tree?slug=dien-thoai
const getCategoryTreeBySlug = async (req, res) => {
    const { slug } = req.query;

    try {
        const parentCategory = await Category.findOne({ slug });

        if (!parentCategory) {
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }

        const allCategories = await Category.find();
        const childCategories = allCategories.filter(
            (cat) => cat.parent && cat.parent.toString() === parentCategory._id.toString()
        );

        res.json([parentCategory, ...childCategories]);
    } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryTreeBySlug,
};
