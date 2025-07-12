const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, cartController.getCartByUser);
router.post("/", verifyToken, cartController.createCart);

module.exports = router;
