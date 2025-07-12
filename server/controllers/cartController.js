const Cart = require("../models/Cart");

// const createCart = async (req, res) => {
//     try {
//         const { items, total, paymentMethod = "", status = "pending" } = req.body;
//         const userId = req.user._id;
//         const userName = req.user.name;

//         if (!items || !Array.isArray(items)) {
//             return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ" });
//         }

//         // Tìm giỏ hàng hiện tại
//         let cart = await Cart.findOne({ customerId: userId });

//         if (!cart) {
//             // Tạo mới nếu chưa có
//             cart = new Cart({
//                 customerId: userId,
//                 customerName: userName,
//             });
//         }

//         // ✅ Ghi đè toàn bộ items
//         cart.items = items;
//         cart.total = total;
//         cart.paymentMethod = paymentMethod;
//         cart.status = status;

//         const savedCart = await cart.save();
//         console.log("✅ Đã cập nhật giỏ hàng:", savedCart);

//         res.status(200).json(savedCart);
//     } catch (error) {
//         console.error("🛑 Lỗi khi cập nhật giỏ hàng:", error.message);
//         res.status(500).json({ message: "Lỗi server khi cập nhật giỏ hàng" });
//     }
// };

const createCart = async (req, res) => {
    try {
        const { items, total, paymentMethod = "", status = "pending" } = req.body;
        const userId = req.user._id;
        const userName = req.user.name;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ" });
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { customerId: userId },
            {
                $set: {
                    items,
                    total,
                    paymentMethod,
                    status,
                    customerName: userName,
                },
            },
            {
                new: true, // Trả về document sau update
                upsert: true, // Tạo mới nếu chưa có
                setDefaultsOnInsert: true,
            }
        );

        console.log("✅ Đã cập nhật giỏ hàng:", updatedCart);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("🛑 Lỗi khi cập nhật giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật giỏ hàng" });
    }
};

// Lấy tất cả đơn hàng (admin)
const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate("customerId", "name email");
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa đơn hàng
const deleteCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa đơn hàng thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đặt hàng (lưu đơn hàng)
const createOrder = async (req, res) => {
    try {
        const { items, total, paymentMethod = "Thanh toán khi nhận hàng", status = "Chờ xác nhận" } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng không được trống" });
        }

        const newCart = new Cart({
            customerId: req.user.id,
            customerName: req.user.name,
            items,
            total,
            paymentMethod,
            status,
        });

        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        console.error("🛑 Error saving cart:", error.message);
        res.status(500).json({ message: "Lỗi server khi tạo giỏ hàng" });
    }
};

// Lấy giỏ hàng hiện tại của người dùng
const getCartByUser = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.user.id });
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đơn hàng theo ID (admin)
const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCart,
    getAllCarts,
    getCartById,
    deleteCart,
    createOrder,
    getCartByUser,
};
