const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");
const Order = require("../models/Order"); // ✅

// routes/orderRoutes.js
router.get("/orders/user", verifyToken, async (req, res) => {
    try {
        // const orders = await Order.find({ "customerInfo.userId": req.user.id }).sort({ orderDate: -1 });
        const orders = await Order.find({ "customerInfo.userId": req.user._id }).sort({ orderDate: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng người dùng:", error);
        res.status(500).json({ message: "Lỗi server khi lấy đơn hàng của người dùng", error: error.message });
    }
});

// 1. Lấy TẤT CẢ đơn hàng (GET /api/orders) - PHẢI ĐẶT TRƯỚC CÁC ROUTE CÓ :id
router.get("/orders", orderController.getAllOrders);

// 2. Lấy đơn hàng theo ID (GET /api/orders/:id)
router.get("/orders/:id", orderController.getOrderById);

// 3. Cập nhật trạng thái đơn hàng (PUT /api/orders/:id/status)
router.put("/orders/:id/status", orderController.updateOrderStatus);

// 4. Tạo đơn hàng mới (POST /api/orders)
router.post("/orders", verifyToken, orderController.createOrder);

// 5. Xóa đơn hàng (DELETE /api/orders/:id)
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;
