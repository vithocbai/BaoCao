const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
    try {
        const { customerInfo, items, totalAmount, paymentMethod, notes } = req.body;

        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Không xác định được người dùng" });
        }

        const newOrderData = {
            customerInfo: {
                ...customerInfo,
                userId: userId, 
            },
            products: items.map((item) => ({
                productId: item.productId,
                name: item.name || item.productName,
                quantity: item.quantity,
                price: item.price,
                color: item.color,
                imageUrl: item.imageUrl,
            })),
            totalAmount,
            paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
            notes,
        };

        const newOrder = new Order(newOrderData);
        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Đặt hàng thành công", orderId: savedOrder._id, order: savedOrder });
    } catch (err) {
        console.error("Lỗi khi tạo đơn hàng:", err); // <-- Log rõ lỗi
        res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: err.message });
    }
};

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 }); // <-- Lỗi có thể xảy ra ở đây
        res.status(200).json(orders);
    } catch (err) {
        console.error("Lỗi chi tiết trong getAllOrders:", err); // <-- ĐẢM BẢO CÓ DÒNG NÀY ĐỂ LOG LỖI
        res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: err.message });
    }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error: err.message });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: err.message });
    }
};

// Xoá đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.status(200).json({ message: "Xoá đơn hàng thành công" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xoá đơn hàng", error: err.message });
    }
};
