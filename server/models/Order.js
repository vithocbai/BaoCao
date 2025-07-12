const mongoose = require("mongoose");
const productInOrderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    imageUrl: { type: String },
});
const orderSchema = new mongoose.Schema(
    {
        customerInfo: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },
        products: [productInOrderSchema],
        totalAmount: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ["COD", "Online"],
            default: "COD",
        },
        status: {
            type: String,
            enum: ["Chờ xác nhận", "Đang giao", "Đã giao", "Đã huỷ"],
            default: "Chờ xác nhận",
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
        notes: { type: String },
        orderCode: {
            type: String,
            unique: true,
            default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
