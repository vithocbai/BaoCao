const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
        },
        icon: {
            type: String,
            default: "",
        },
        specSuggestions: {
            type: [String],
            default: [],
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
    },
    { timestamps: true }
);

categorySchema.pre("save", function (next) {
    if (!this.slug || this.isModified("name")) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: "vi", // giúp xử lý tiếng Việt tốt hơn
        });
    }
    next();
});

module.exports = mongoose.model("Category", categorySchema);
