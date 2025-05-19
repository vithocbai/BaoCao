import styles from './NavbarAdmin.module.scss';
import { FaUserCircle } from 'react-icons/fa';

const NavbarAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className={styles.navbar}>
            <div className={styles.title}>MonaShop Admin</div>
            <div className={styles.right}>
                <span className={styles.username}>
                    <FaUserCircle className={styles.icon} /> {user?.username || 'Admin'}
                </span>
            </div>
        </div>
    );
};

export default NavbarAdmin;
