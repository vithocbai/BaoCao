import React from "react";
import styles from "./SidebarAdmin.module.scss";
import { Link } from "react-router-dom";
import { FaChartBar, FaBoxOpen, FaUsers, FaClipboardList, FaTags } from "react-icons/fa";

const SidebarAdmin = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>MonaShop Admin</div>
            <nav className={styles.nav}>
                <Link to="/admin" className={styles.navItem}>
                    <FaChartBar />
                    <span>Thống kê</span>
                </Link>
                <Link to="/admin/categories" className={styles.navItem}>
                    <FaTags />
                    <span>Quản lý danh mục</span>
                </Link>
                <Link to="/admin/products" className={styles.navItem}>
                    <FaBoxOpen />
                    <span>Quản lý sản phẩm</span>
                </Link>
                <Link to="/admin/users" className={styles.navItem}>
                    <FaUsers />
                    <span>Quản lý người dùng</span>
                </Link>
                <Link to="/admin/orders" className={styles.navItem}>
                    <FaClipboardList />
                    <span>Quản lý đơn hàng</span>
                </Link>
            </nav>
            <div className={styles.footer}>
                <span>© 2025 MonaShop</span>
            </div>
        </div>
    );
};

export default SidebarAdmin;
