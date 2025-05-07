import styles from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <div className={styles.navbar}>
            <div className={styles.container}>
                <ul className={styles.menu}>
                    <li>
                        <NavLink to="/dien-thoai" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img className={styles.icon} src="./images/dienthoai.png" alt="Điện thoại" />
                            Điện thoại
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/laptop" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img className={styles.icon} src="./images/laptop.png" alt="Laptop" />
                            Laptop
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/apple" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img className={styles.icon} src="./images/apple.png" alt="Apple" />
                            Apple
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/samsung" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img className={styles.icon} src="./images/samsung.png" alt="Samsung" />
                            Samsung
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tablet" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img className={styles.icon} src="./images/taplet.png" alt="Tablet" />
                            Tablet
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/phu-kien" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img className={styles.icon} src="./images/phukien.png" alt="Phụ kiện" />
                            Phụ kiện
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/khuyen-mai" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img className={styles.icon} src="./images/khuyenmai.png" alt="Khuyến mãi" />
                            Khuyến mãi
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
