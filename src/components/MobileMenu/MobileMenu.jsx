import { useEffect, useState } from "react";
import styles from "./MobileMenu.module.scss";
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { NavLink } from "react-router-dom";

function MobileMenu({ isOpen, onClose }) {
    const [categories, setCategories] = useState([]);

    // Gọi API danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("/api/categories");
                setCategories(data);
            } catch (err) {
                console.error("Lỗi khi lấy danh mục:", err);
            }
        };

        if (isOpen) fetchCategories();
    }, [isOpen]);

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
                        {categories.map((cat) => (
                            <li key={cat._id}>
                                <NavLink to={`/${cat.slug}`} onClick={onClose}>
                                    <img className={styles.icon} src={cat.icon} alt={cat.name} />
                                    {cat.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.login}>
                    <a href="">Đăng Nhập</a>
                </div>
                <div className={styles.socials}>
                    <span><FaFacebook /></span>
                    <span><FaInstagramSquare /></span>
                    <span><FaTwitter /></span>
                    <span><MdMarkEmailUnread /></span>
                </div>
            </div>
        </>
    );
}

export default MobileMenu;
