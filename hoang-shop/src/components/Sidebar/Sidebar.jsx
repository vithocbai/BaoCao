import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { useCategories } from "@/context/CategoryContext";
import FeaturedProducts from "@components/FeaturedProducts/FeaturedProducts";
import PriceFilter from "@components/PriceFilter/PriceFilter ";


const Sidebar = ({ onPriceFilterChange }) => {
    const { categories } = useCategories();

    // Hàm này sẽ được gọi từ PriceFilter khi người dùng nhấn "LỌC"
    const handlePriceFilter = (minValue, maxValue) => {
        console.log("Lọc giá từ:", minValue, "đến", maxValue);
        // Gọi callback để truyền giá trị minPrice và maxPrice lên component cha
        if (onPriceFilterChange) {
            onPriceFilterChange({ minPrice: minValue, maxPrice: maxValue });
        }
    };

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Danh mục sản phẩm</h2>
            <div className={styles.isDivider}></div>
            <ul className={styles.list}>
                {categories
                    .slice()
                    .reverse()
                    .map((cat) => (
                        <li key={cat._id}>
                            <NavLink to={`/${cat.slug}`} className={({ isActive }) => (isActive ? styles.active : "")}>
                                <img className={styles.icon} src={cat.icon} />
                                {cat.name}
                            </NavLink>
                        </li>
                    ))}
            </ul>

            {/* Truyền handlePriceFilter xuống PriceFilter */}
            <PriceFilter onFilter={handlePriceFilter} />
            <FeaturedProducts />
        </div>
    );
};

export default Sidebar;