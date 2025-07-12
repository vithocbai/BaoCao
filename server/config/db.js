const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI ||
                "mongodb+srv://hoang16tq:0338502748@cluster0.7e5iqsl.mongodb.net/hoangshop?retryWrites=true&w=majority&appName=Cluster0"
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
