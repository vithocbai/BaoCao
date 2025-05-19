import RevenueChart from "@components/RevenueChart/RevenueChart";
import styles from "./DashboardAdmin.module.scss";
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";

const DashboardAdmin = () => {
    // TODO: Replace these static values with API calls later
    const stats = [
        {
            title: "Người dùng",
            value: 1250,
            icon: <FaUsers className={styles.icon} />,
            color: "#3498db",
        },
        {
            title: "Sản phẩm",
            value: 328,
            icon: <FaBox className={styles.icon} />,
            color: "#27ae60",
        },
        {
            title: "Đơn hàng",
            value: 780,
            icon: <FaShoppingCart className={styles.icon} />,
            color: "#e67e22",
        },
        {
            title: "Doanh thu",
            value: "120,000,000₫",
            icon: <FaDollarSign className={styles.icon} />,
            color: "#f1c40f",
        },
    ];

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.heading}>Thống kê tổng quan</h2>
            <div className={styles.grid}>
                {stats.map((item, idx) => (
                    <div className={styles.card} key={idx} style={{ borderColor: item.color }}>
                        <div className={styles.cardIcon}>{item.icon}</div>
                        <div className={styles.cardInfo}>
                            <div className={styles.value}>{item.value}</div>
                            <div className={styles.title}>{item.title}</div>
                        </div>
                    </div>
                ))}
            </div>
            <RevenueChart />
        </div>
    );
};

export default DashboardAdmin;
