const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        price: { type: Number, required: true },

        discountPrice: { type: Number, default: 0 }, // discountPrice sẽ được tính toán tự động.
        discountPercent: { type: Number, default: 0 }, // discountPercent sẽ là trường bạn nhập để xác định mức giảm.
        category: { type: String, required: true },
        brand: { type: String, required: true },
        stock: { type: Number, required: true },
        colors: [{ type: String }],
        sale: { type: Boolean, default: false },
        specs: {
            type: Map,
            of: String,
            default: {},
        },
        description: { type: String },
        images: [{ type: String }],

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);
productSchema.pre("save", function (next) {
    if (this.discountPercent > 0 && this.discountPercent <= 100) {
        this.discountPrice = this.price * (1 - this.discountPercent / 100);
        this.discountPrice = Math.round(this.discountPrice);
        this.sale = true; // <--- Add this line to automatically mark as sale
    } else {
        this.discountPrice = this.price;
        this.discountPercent = 0;
        this.sale = false;
    }
    next();
});
module.exports = mongoose.model("Product", productSchema);
