const mongoose = require("mongoose");
const slugify = require("slugify");
const newsArticleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: true,
            trim: true,
        },
        fullContent: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

newsArticleSchema.pre("validate", function (next) {
    if (this.isModified("title") || this.isNew) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            locale: "vi",
            remove: /[*+~.()'"!:@]/g,
        });
    }
    next();
});

module.exports = mongoose.model("NewsArticle", newsArticleSchema);
