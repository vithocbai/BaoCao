const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded.userId || decoded._id,
            email: decoded.email,
            role: decoded.role || "user",
            name: decoded.name || decoded.username || "Unknown",
        };

        console.log("✅ Token decoded:", req.user);
        next();
    } catch (err) {
        console.error("❌ Token decode failed:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};

const requireSignIn = (req, res, next) => {
    console.log("Giả lập đăng nhập");
    next();
};

const isAdmin = (req, res, next) => {
    console.log("Giả lập admin");
    next();
};

const protect = (req, res, next) => {
    // Để đơn giản, giả định luôn là admin cho mục đích phát triển.
    // TRONG SẢN PHẨM THỰC TẾ: Bạn phải triển khai logic xác thực JWT và kiểm tra vai trò admin ở đây.
    console.log("Mock Auth: Người dùng được giả định là admin.");
    next();
};

module.exports = {
    requireSignIn,
    isAdmin,
    verifyToken,
    protect,
};
