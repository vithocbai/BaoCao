const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProductsByName,
    getProducts,
    getSaleProducts,
} = require("../controllers/productController");

router.get("/search", searchProductsByName); // 💥 Phải đặt trước
router.get("/sale", getSaleProducts);
router.get("/", getProducts);
router.get("/:id", getProductById); // 💥 Đặt sau

router.post("/", upload.array("images", 10), createProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
