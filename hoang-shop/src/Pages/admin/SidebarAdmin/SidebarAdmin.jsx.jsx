import React from "react";
import styles from "./SidebarAdmin.module.scss";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaBoxOpen, FaUsers, FaClipboardList, FaTags, FaNewspaper  } from "react-icons/fa";

const SidebarAdmin = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>MonaShop Admin</div>
            <nav className={styles.nav}>
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
                >
                    <FaChartBar />
                    <span>Thống kê</span>
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
                >
                    <FaTags />
                    <span>Quản lý danh mục</span>
                </NavLink>
                <NavLink
                    to="/admin/products"
                    className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
                >
                    <FaBoxOpen />
                    <span>Quản lý sản phẩm</span>
                </NavLink>
                <NavLink
                    to="/admin/users"
                    className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
                >
                    <FaUsers />
                    <span>Quản lý người dùng</span>
                </NavLink>
                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
                >
                    <FaClipboardList />
                    <span>Quản lý đơn hàng</span>
                </NavLink>
                <NavLink
                    to="/admin/news"
                    className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
                >
                    <FaNewspaper />
                    <span>Quản lý tin tức</span>
                </NavLink>
            </nav>
            <div className={styles.footer}>
                <span>© 2025 MonaShop</span>
            </div>
        </div>
    );
};

export default SidebarAdmin;
