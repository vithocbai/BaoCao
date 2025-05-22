import styles from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("/api/categories");
                setCategories(data);
            } catch (err) {
                console.error("Lỗi khi load danh mục:", err);
            }
        };  

        fetchCategories();
    }, []);

    return (
        <div className={styles.navbar}>
            <div className={styles.container}>
                <ul className={styles.menu}>
                    {categories.map((cat) => (
                        <li key={cat._id}>
                            <NavLink to={`/${cat.slug}`} className={({ isActive }) => (isActive ? styles.active : "")}>
                                <img className={styles.icon} src={cat.icon} alt={cat.name} />
                                {cat.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
