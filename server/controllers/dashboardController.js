const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(amount);
};

// Controller function for GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
    console.log("--- Bắt đầu getDashboardStats ---"); // Log 1

    try {
        // Total Users
        const totalUsers = await User.countDocuments();
        const googleUsers = await User.countDocuments({ source: "google" });

        // Total Products
        const totalProducts = await Product.countDocuments();
        const uniqueCategories = await Product.distinct("category");

        // Total Orders
        const totalOrders = await Order.countDocuments();
        const deliveredOrders = await Order.countDocuments({ status: "delivered" });

        console.log("Tổng số đơn hàng (tất cả trạng thái):", totalOrders); // Log 2
        console.log("Tổng số đơn hàng đã giao (delivered):", deliveredOrders); // Log 3

        // Total Revenue
        const result = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["shipped", "delivered", "Hoàn thành"] },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                },
            },
        ]);
        const totalRevenue = result.length > 0 ? result[0].totalAmount : 0;

        console.log("Kết quả Aggregation cho tổng doanh thu:", result); // Log 4
        console.log("Giá trị totalRevenue sau aggregation:", totalRevenue); // Log 5

        const responseData = {
            totalUsers: {
                value: totalUsers,
                subText: `${googleUsers} qua Google`,
            },
            totalProducts: {
                value: totalProducts,
                subText: `${uniqueCategories.length} danh mục`,
            },
            totalOrders: {
                value: totalOrders,
                subText: `${deliveredOrders} đã giao`,
            },
            totalRevenue: {
                value: totalRevenue,
                subText: "Doanh thu thành công",
            },
        };

        console.log("Dữ liệu phản hồi gửi về frontend:", responseData); // Log 6
        res.json(responseData);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê bảng điều khiển:", error); // Log lỗi
        res.status(500).json({ message: "Lỗi server khi lấy dữ liệu thống kê." });
    }
    console.log("--- Kết thúc getDashboardStats ---"); // Log 7
};

// Controller function for GET /api/dashboard/revenue/last7days
exports.getRevenueLast7Days = async (req, res) => {
    console.log("--- Bắt đầu getRevenueLast7Days ---"); // Log 8
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the day 7 days ago

        console.log("Thời gian 7 ngày trước:", sevenDaysAgo); // Log 9

        const dailyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: { $in: ["shipped", "delivered", "Hoàn thành"] },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    dailyTotal: { $sum: "$totalAmount" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        console.log("Kết quả Aggregation cho doanh thu 7 ngày:", dailyRevenue); // Log 10

        // Create a map for quick lookup
        const revenueMap = new Map();
        dailyRevenue.forEach((item) => {
            revenueMap.set(item._id, item.dailyTotal);
        });

        // Generate data for the last 7 days, filling in 0 for days with no revenue
        const result = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateString = date.toISOString().split("T")[0];

            result.push({
                date: dateString,
                revenue: revenueMap.get(dateString) || 0,
            });
        }

        console.log("Dữ liệu doanh thu 7 ngày gửi về frontend:", result); // Log 11
        res.json(result);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu 7 ngày:", error); // Log lỗi
        res.status(500).json({ message: "Lỗi server khi lấy dữ liệu doanh thu 7 ngày." });
    }
    console.log("--- Kết thúc getRevenueLast7Days ---"); // Log 12
};
