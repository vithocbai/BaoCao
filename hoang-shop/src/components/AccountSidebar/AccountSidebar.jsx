// import React from "react";
// import styles from "./AccountSidebar.module.scss";
// import { CgProfile, CgList, CgLogOut } from 'react-icons/cg';

// const AccountSidebar = ({ activeTab, setActiveTab }) => {
//     return (
//         <div className={styles.sidebar}>
//             <h3 className={styles.title}>Tài khoản của tôi</h3>
//             <ul className={styles.menu}>
//                 <li
//                     className={`${styles.item} ${activeTab === "info" ? styles.active : ""}`}
//                     onClick={() => setActiveTab("info")}
//                 >
//                     <CgProfile className={styles.icon} />
//                     Thông tin cá nhân
//                 </li>
//                 <li
//                     className={`${styles.item} ${activeTab === "orders" ? styles.active : ""}`}
//                     onClick={() => setActiveTab("orders")}
//                 >
//                     <CgList className={styles.icon} />
//                     Quản lý đơn hàng
//                 </li>
//                 <li
//                     className={`${styles.item} ${activeTab === "logout" ? styles.active : ""}`}
//                     onClick={() => setActiveTab("logout")}
//                 >
//                     <CgLogOut className={styles.icon} />
//                     Đăng xuất
//                 </li>
//             </ul>
//         </div>
//     );
// };

// export default AccountSidebar;

import React from "react";
import styles from "./AccountSidebar.module.scss";
import { CgProfile, CgList, CgLogOut } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const AccountSidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // đảm bảo load lại trang
    };

    return (
        <div className={styles.sidebar}>
            <h3 className={styles.title}>Tài khoản của tôi</h3>
            <ul className={styles.menu}>
                <li
                    className={`${styles.item} ${activeTab === "info" ? styles.active : ""}`}
                    onClick={() => setActiveTab("info")}
                >
                    <CgProfile className={styles.icon} />
                    Thông tin cá nhân
                </li>
                <li
                    className={`${styles.item} ${activeTab === "orders" ? styles.active : ""}`}
                    onClick={() => setActiveTab("orders")}
                >
                    <CgList className={styles.icon} />
                    Quản lý đơn hàng
                </li>
                <li className={styles.item} onClick={handleLogout}>
                    <CgLogOut className={styles.icon} />
                    Đăng xuất
                </li>
            </ul>
        </div>
    );
};

export default AccountSidebar;
