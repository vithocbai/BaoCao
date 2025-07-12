// import styles from "./NavbarAdmin.module.scss";
// import { FaUserCircle } from "react-icons/fa";

// const NavbarAdmin = () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     return (
//         <div className={styles.navbar}>
//             <div className={styles.title}>MonaShop Admin </div>
//             <div className={styles.right}>
//                 <span className={styles.username}>
//                     <FaUserCircle className={styles.icon} /> {user?.username || "Admin"}
//                 </span>
//             </div>
//         </div>
//     );
// };

// export default NavbarAdmin;

import styles from "./NavbarAdmin.module.scss";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavbarAdmin = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login"); // Đảm bảo có route "/login"
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.title}>MonaShop Admin</div>

            <div className={styles.right}>
                <span className={styles.username}>
                    <FaUserCircle className={styles.icon} /> {user?.username || "Admin"}
                </span>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    <FaSignOutAlt className={styles.icon} /> Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default NavbarAdmin;
