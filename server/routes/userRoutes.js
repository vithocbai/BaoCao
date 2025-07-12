// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Lấy tất cả người dùng
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Cập nhật role
router.put("/:id", async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

module.exports = router;
