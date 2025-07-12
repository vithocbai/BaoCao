import React, { useState, useEffect } from "react";
import RevenueChart from "@components/RevenueChart/RevenueChart";
import styles from "./DashboardAdmin.module.scss";
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";

const formatCurrency = (amount) => {
    // Nếu amount không phải là số hoặc là NaN, trả về "0 ₫"
    if (typeof amount !== "number" || isNaN(amount)) {
        return "0 ₫"; // Hoặc bất kỳ chuỗi mặc định nào bạn muốn cho trường hợp lỗi
    }
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(amount);
};

const DashboardAdmin = () => {
    // State to hold fetched data
    const [statsData, setStatsData] = useState({
        totalUsers: { value: "...", subText: "..." },
        totalProducts: { value: "...", subText: "..." },
        totalOrders: { value: "...", subText: "..." },
        totalRevenue: { value: "...", subText: "..." },
    });
    const [revenueChartData, setRevenueChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const BASE_API_URL = "";

                // Fetch overview stats
                const statsResponse = await fetch(`${BASE_API_URL}/api/dashboard/stats`);
                if (!statsResponse.ok) {
                    throw new Error(`HTTP error! status: ${statsResponse.status}`);
                }
                const statsJson = await statsResponse.json();

                // Format revenue value from number to currency string
                const formattedStatsJson = { ...statsJson };
                if (typeof formattedStatsJson.totalRevenue.value === "number") {
                    formattedStatsJson.totalRevenue.value = formatCurrency(formattedStatsJson.totalRevenue.value);
                }
                setStatsData(formattedStatsJson);

                // Fetch revenue chart data
                const revenueChartResponse = await fetch(`${BASE_API_URL}/api/dashboard/revenue/last7days`);
                if (!revenueChartResponse.ok) {
                    throw new Error(`HTTP error! status: ${revenueChartResponse.status}`);
                }
                const revenueChartJson = await revenueChartResponse.json();
                setRevenueChartData(revenueChartJson);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Empty dependency array means this runs once on mount

    // Map the fetched stats data to the format expected by the existing `stats` array structure
    // This allows you to keep your rendering logic consistent even after switching to API.
    const displayStats = [
        {
            title: "Người dùng",
            value: statsData.totalUsers.value,
            icon: <FaUsers className={styles.icon} />,
            color: "#3498db",
            subText: statsData.totalUsers.subText,
        },
        {
            title: "Sản phẩm",
            value: statsData.totalProducts.value,
            icon: <FaBox className={styles.icon} />,
            color: "#27ae60",
            subText: statsData.totalProducts.subText,
        },
        {
            title: "Đơn hàng",
            value: statsData.totalOrders.value,
            icon: <FaShoppingCart className={styles.icon} />,
            color: "#e67e22",
            subText: statsData.totalOrders.subText,
        },
        {
            title: "Doanh thu",
            value: statsData.totalRevenue.value,
            icon: <FaDollarSign className={styles.icon} />,
            color: "#f1c40f",
            subText: statsData.totalRevenue.subText,
        },
    ];

    if (loading) {
        return <div className={styles.loadingMessage}>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.heading}>Tổng quan</h2>
            <div className={styles.grid}>
                {displayStats.map((item, idx) => (
                    <div className={styles.card} key={idx} style={{ borderColor: item.color }}>
                        <div className={styles.cardInfo}>
                            <div className={styles.value}>{item.value}</div>
                            <div className={styles.title}>{item.title}</div>
                            {item.subText && <div className={styles.subText}>{item.subText}</div>}
                        </div>
                        <div className={styles.cardIcon}>{item.icon}</div>
                    </div>
                ))}
            </div>

            {/* Doanh thu Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>Doanh thu</div>
                <div className={styles.sectionTabs}>
                    <button className={styles.activeTab}>Doanh thu</button>
                </div>
                <h3 className={styles.chartSubHeading}>Doanh thu 7 ngày gần đây</h3>
                {/* Pass the fetched revenueChartData to RevenueChart */}
                <RevenueChart data={revenueChartData} />
            </div>
        </div>
    );
};

export default DashboardAdmin;
