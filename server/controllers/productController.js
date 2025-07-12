const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

// --- GET All Products ---
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("❌ Lỗi khi lấy tất cả sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server nội bộ khi lấy tất cả sản phẩm." });
    }
};

// --- GET Product by ID ---
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        }
        res.json(product);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm theo ID:", error);
        res.status(500).json({ message: "Lỗi server nội bộ khi lấy sản phẩm." });
    }
};

// --- GET Products on Sale (Khuyến Mãi) ---
exports.getSaleProducts = async (req, res) => {
    try {
        console.log("------------------------------------------");
        console.log("Backend: Receiving request for /products/sale");
        console.log("Query parameters:", req.query); // Log all incoming query parameters

        let query = { sale: true }; // Start with the sale condition
        let sort = {};

        // --- Handle Price Filtering ---
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {}; // Initialize price object if min or max price is present

            // Convert to number, ensure it's a valid number
            const minPrice = parseFloat(req.query.minPrice);
            const maxPrice = parseFloat(req.query.maxPrice);

            if (!isNaN(minPrice)) {
                query.price.$gte = minPrice;
                console.log("Filtering by minPrice:", minPrice);
            }
            if (!isNaN(maxPrice)) {
                query.price.$lte = maxPrice;
                console.log("Filtering by maxPrice:", maxPrice);
            }

            // If price object was initialized but no valid min/max were added, delete it
            if (Object.keys(query.price).length === 0) {
                delete query.price;
                console.log("No valid minPrice or maxPrice, removing price filter.");
            }
        }

        // --- Handle Sorting ---
        if (req.query.sort) {
            console.log("Sorting by:", req.query.sort);
            switch (req.query.sort) {
                case "new":
                    sort.createdAt = -1;
                    break;
                case "price-asc":
                    sort.price = 1;
                    break;
                case "price-desc":
                    sort.price = -1;
                    break;
                default:
                    // If sort value is not recognized, do not apply a specific sort
                    console.warn("Unrecognized sort parameter:", req.query.sort);
                    break;
            }
        } else {
            sort.createdAt = -1; // Default sort for sale products (newest first)
            console.log("No sort parameter, defaulting to createdAt: -1");
        }

        console.log("Final Mongoose query:", query);
        console.log("Final Mongoose sort:", sort);

        // Execute the Mongoose query
        const saleProducts = await Product.find(query).sort(sort);

        console.log(`Found ${saleProducts.length} sale products.`);
        console.log("------------------------------------------");

        res.json(saleProducts);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server nội bộ khi lấy sản phẩm khuyến mãi.",
            error: error.message,
            stack: error.stack,
        });
    }
};

// --- CREATE New Product ---
exports.createProduct = async (req, res) => {
    try {
        const { name, price, discountPercent, category, brand, stock, description } = req.body;

        // 1. Basic validation
        if (!name || !price || !category || !brand || !stock) {
            return res
                .status(400)
                .json({ error: "Thiếu thông tin bắt buộc: Tên, Giá, Danh mục, Thương hiệu, Số lượng tồn." });
        }

        // 2. Generate slug from name
        const slug = slugify(name, { lower: true, strict: true, locale: "vi" });

        // 3. Check for duplicate slug
        const existing = await Product.findOne({ slug });
        if (existing) {
            return res.status(400).json({ error: "Sản phẩm với tên này đã tồn tại (slug trùng)." });
        }

        // 4. Handle colors (parse if stringified JSON)
        let colors = [];
        if (req.body.colors) {
            try {
                colors = typeof req.body.colors === "string" ? JSON.parse(req.body.colors) : req.body.colors;
            } catch (err) {
                return res.status(400).json({ error: "Dữ liệu màu sắc (colors) không hợp lệ." });
            }
        }

        // 5. Handle specs (parse if stringified JSON)
        let specs = {};
        if (req.body.specs) {
            try {
                specs = typeof req.body.specs === "string" ? JSON.parse(req.body.specs) : req.body.specs;
            } catch (err) {
                return res.status(400).json({ error: "Dữ liệu thông số kỹ thuật (specs) không hợp lệ." });
            }
        }

        // 6. Handle images upload
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "Vui lòng tải lên ít nhất 1 ảnh cho sản phẩm." });
        }
        const images = req.files.map((file) => `/uploads/${file.filename}`);

        // 7. Create new Product instance
        const newProduct = new Product({
            name,
            slug,
            price: parseInt(price),
            // discountPercent will be processed by the pre('save') hook
            discountPercent: parseInt(discountPercent) || 0,
            // discountPrice and sale will be set by the pre('save') hook
            category,
            brand,
            stock: parseInt(stock),
            colors,
            specs,
            description,
            images,
        });

        // 8. Save the product (this triggers the pre('save') hook)
        await newProduct.save();

        res.status(201).json({
            message: "Thêm sản phẩm thành công.",
            product: newProduct,
        });
    } catch (error) {
        console.error("❌ Lỗi tạo sản phẩm:", error);
        res.status(500).json({ error: "Lỗi server khi tạo sản phẩm." });
    }
};

// --- UPDATE Existing Product ---
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật." });
        }

        // 1. Parse oldImages from req.body (for managing existing images)
        let oldImages = [];
        if (req.body.oldImages) {
            try {
                oldImages =
                    typeof req.body.oldImages === "string" ? JSON.parse(req.body.oldImages) : req.body.oldImages;
            } catch (err) {
                return res.status(400).json({ error: "oldImages không hợp lệ." });
            }
        }

        // 2. Parse specs from req.body
        let parsedSpecs = req.body.specs;
        if (parsedSpecs) {
            try {
                if (typeof parsedSpecs === "string") {
                    parsedSpecs = JSON.parse(parsedSpecs);
                }
            } catch (err) {
                return res.status(400).json({ error: "Thông số kỹ thuật (specs) không hợp lệ." });
            }
        }

        // 3. Parse colors from req.body
        let parsedColors = req.body.colors;
        if (parsedColors) {
            try {
                if (typeof parsedColors === "string") {
                    parsedColors = JSON.parse(parsedColors);
                }
            } catch (err) {
                return res.status(400).json({ error: "Màu sắc (colors) không hợp lệ." });
            }
        }

        // 4. Combine new uploaded images with retained old images
        const newImagePaths = req.files?.map((file) => `/uploads/${file.filename}`) || [];
        const updatedImages = [...oldImages, ...newImagePaths];

        // 5. Update product fields. `set` method with spread operator safely applies updates.
        // Mongoose automatically handles updating fields that exist in req.body
        // The pre('save') hook will handle discountPrice and sale status based on discountPercent.
        product.set({
            ...req.body, // Copies all fields from req.body
            // Explicitly override complex fields after parsing
            price: req.body.price ? parseInt(req.body.price) : product.price,
            stock: req.body.stock ? parseInt(req.body.stock) : product.stock,
            discountPercent: req.body.discountPercent ? parseInt(req.body.discountPercent) : product.discountPercent, // Ensure this is parsed
            specs: parsedSpecs,
            colors: parsedColors,
            images: updatedImages,
        });

        // If product name is updated, re-generate slug
        if (req.body.name && req.body.name !== product.name) {
            product.slug = slugify(req.body.name, { lower: true, strict: true, locale: "vi" });
            const existingWithNewSlug = await Product.findOne({ slug: product.slug, _id: { $ne: product._id } });
            if (existingWithNewSlug) {
                return res.status(400).json({ error: "Sản phẩm với tên mới này đã tồn tại (slug trùng)." });
            }
        }

        // 6. Save the product (this triggers the pre('save') hook)
        await product.save();

        // 7. Clean up old images that are no longer referenced
        const imagesToDelete = product.images.filter((img) => !updatedImages.includes(img));
        imagesToDelete.forEach((imgPath) => {
            const fullPath = path.join(__dirname, `..${imgPath}`);
            // Check if file exists before trying to delete
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        });

        res.json({ message: "Cập nhật sản phẩm thành công.", product });
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
        res.status(500).json({ error: err.message || "Lỗi server khi cập nhật sản phẩm." });
    }
};

// --- DELETE Product ---
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa." });
        }

        // Delete associated image files
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach((imgPath) => {
                const fullPath = path.join(__dirname, `..${imgPath}`);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        res.json({ message: "Xóa sản phẩm thành công." });
    } catch (err) {
        console.error("❌ Lỗi server khi xóa sản phẩm:", err);
        res.status(500).json({ message: "Lỗi server khi xóa sản phẩm.", error: err.message });
    }
};

// --- SEARCH Products by Name (Case-insensitive) ---
exports.searchProductsByName = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Thiếu từ khóa tìm kiếm (parameter 'q')." });
        }

        const results = await Product.find({
            name: { $regex: query, $options: "i" }, // 'i' for case-insensitive
        }).select("name images price discountPrice"); // Select only necessary fields for search results

        res.json(results);
    } catch (err) {
        console.error("❌ Lỗi tìm kiếm sản phẩm:", err);
        res.status(500).json({ error: "Lỗi server khi tìm kiếm sản phẩm." });
    }
};

// --- GET Products with Filtering and Sorting ---
exports.getProducts = async (req, res) => {
    try {
        let query = {};
        let sort = {};

        // 1. Category Filtering
        if (req.query.category) {
            let categorySlugsToFilter = [];
            if (Array.isArray(req.query.category)) {
                categorySlugsToFilter = req.query.category;
            } else if (typeof req.query.category === "string") {
                categorySlugsToFilter = req.query.category
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s);
            }
            if (categorySlugsToFilter.length > 0) {
                query.category = { $in: categorySlugsToFilter };
            }
        }

        // 2. Price Filtering
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            const parsedMinPrice = parseFloat(req.query.minPrice);
            const parsedMaxPrice = parseFloat(req.query.maxPrice);

            if (!isNaN(parsedMinPrice)) {
                query.price.$gte = parsedMinPrice;
            }
            if (!isNaN(parsedMaxPrice)) {
                query.price.$lte = parsedMaxPrice;
            }

            // Remove price object if no valid min/max were found
            if (Object.keys(query.price).length === 0) {
                delete query.price;
            }
        }

        // 3. Sorting
        if (req.query.sort) {
            switch (req.query.sort) {
                case "new":
                    sort.createdAt = -1; // Newest first
                    break;
                case "price-asc":
                    sort.price = 1; // Price ascending
                    break;
                case "price-desc":
                    sort.price = -1; // Price descending
                    break;
                case "default":
                default:
                    sort.createdAt = -1; // Default to newest
                    break;
            }
        } else {
            sort.createdAt = -1; // Default sort if no 'sort' query param
        }

        // Execute query
        const products = await Product.find(query).sort(sort);

        res.json(products);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm với bộ lọc/sắp xếp:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi xử lý yêu cầu sản phẩm." });
    }
};
