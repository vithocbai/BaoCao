const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// controllers/authController.js
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email đã được sử dụng" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
};

// login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email không tồn tại" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Sai mật khẩu" });

        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        //     expiresIn: "1d",
        // });

        const token = jwt.sign(
            { userId: user._id, name: user.username }, // ✅ phải là userId
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Debug log to check the user role
        console.log("User:", user);
        console.log("Role:", user.role); // Check the role here

        res.json({
            message: "Đăng nhập thành công",
            token,
            username: user.username,
            email: user.email,
            role: user.role, // Return role here
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
};

// googleLogin controller
exports.googleLogin = async (req, res) => {
    try {
        const { email, name, sub } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                username: name,
                password: sub, // dùng Google sub làm password giả
                role: "user", // Ensure that role is set when creating a new user
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Debug log to check the user role
        console.log("Google Login User:", user);
        console.log("Role:", user.role); // Check the role here

        res.json({
            message: "Đăng nhập bằng Google thành công",
            token,
            username: user.username,
            email: user.email,
            role: user.role, // Return role here
        });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
};
