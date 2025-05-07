import { useEffect } from "react";
import styles from "./MobileMenu.module.scss";
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";

function MobileMenu({ isOpen, onClose }) {
    // Khóa scroll khi mở menu
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay đen */}
            <div className={styles.overlay} onClick={onClose}></div>

            <div className={styles.mobileMenu}>
                <IoIosCloseCircleOutline className={styles.closeIcon} onClick={onClose} />
                <div className={styles.search}>
                    <input type="text" placeholder="Nhập tên điện thoại, máy tính, phụ kiện...cần tìm" />
                    <button onClick={onClose}>
                        <IoSearch />
                    </button>
                </div>

                <div className={styles.menuList}>
                    <ul className={styles.menu}>
                        <li>
                            <a href="#">
                                <img className={styles.icon} src="./images/dienthoai.png" alt="" />
                                Điện thoại
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img className={styles.icon} src="./images/laptop.png" alt="" />
                                Laptop
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img className={styles.icon} src="./images/apple.png" alt="" />
                                Apple
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img className={styles.icon} src="./images/samsung.png" alt="" />
                                Sam sung
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img className={styles.icon} src="./images/taplet.png" alt="" />
                                Tablet
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img className={styles.icon} src="./images/phukien.png" alt="" />
                                Phụ kiện
                            </a>
                        </li>

                        <li>
                            <a href="#">
                                <img className={styles.icon} src="./images/khuyenmai.png" alt="" />
                                Khuyến mãi
                            </a>
                        </li>
                    </ul>
                </div>

                <div className={styles.login}>
                    <a href="">Đăng Nhập</a>
                </div>
                <div className={styles.socials}>
                    <span>
                        <FaFacebook />
                    </span>
                    <span>
                        <FaInstagramSquare />
                    </span>
                    <span>
                        <FaTwitter />
                    </span>
                    <span>
                        <MdMarkEmailUnread />
                    </span>
                </div>
            </div>
        </>
    );
}

export default MobileMenu;
