import styles from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";
import {useCategories} from "@/context/CategoryContext";

function Navbar() {
    const {categories} = useCategories();
    return (
        <div className={styles.navbar}>
            <div className={styles.container}>
                <ul className={styles.menu}>
                    {categories
                        .slice()
                        .reverse()
                        .map((cat) => (
                            <li key={cat._id}>
                                <NavLink
                                    to={`/${cat.slug}`}
                                    className={({ isActive }) => (isActive ? styles.active : "")}
                                >
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
