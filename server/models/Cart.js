const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    images: [{ type: String, required: true }],
});

// const cartSchema = new mongoose.Schema({
//     customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     customerName: String,
//     items: [cartItemSchema],
//     date: { type: Date, default: Date.now },
//     total: { type: Number, default: 0 },
//     paymentMethod: { type: String, default: "Thanh toán khi nhận hàng" },
//     status: { type: String, default: "Chờ xác nhận" },
// });
const cartSchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        customerName: String,
        items: [cartItemSchema],
        date: { type: Date, default: Date.now },
        total: { type: Number, default: 0 },
        paymentMethod: { type: String, default: "Thanh toán khi nhận hàng" },
        status: { type: String, default: "Chờ xác nhận" },
    },
    {
        optimisticConcurrency: false, // ✅ TẮT kiểm tra version (__v)
        versionKey: false, // (Tuỳ chọn) Không tạo luôn field __v
    }
);

module.exports = mongoose.model("Cart", cartSchema);
