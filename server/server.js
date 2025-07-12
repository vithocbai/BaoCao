const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRouter");
const orderRoutes = require("./routes/orderRouter");
const dashboardRoutes = require("./routes/dashboardRoutes");
const newsArticleRoutes = require('./routes/newsArticleRoutes');

const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/news', newsArticleRoutes);
app.use("/api", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/cart", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

// MongoDB connection & server start
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));
