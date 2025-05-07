import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { useState } from "react";

const Sidebar = () => {
    const [priceRange, setPriceRange] = useState([3000000, 30000000]);

    const categories = [
        { name: "Điện thoại", path: "/dien-thoai", icon: "./images/dienthoai.png" },
        { name: "Laptop", path: "/laptop", icon: "./images/laptop.png" },
        { name: "Apple", path: "/apple", icon: "./images/apple.png" },
        { name: "Samsung", path: "/samsung", icon: "./images/samsung.png" },
        { name: "Tablet", path: "/tablet", icon: "./images/taplet.png" },
        { name: "Phụ kiện", path: "/phu-kien", icon: "./images/phukien.png" },
        { name: "Khuyến mãi", path: "/khuyen-mai", icon: "./images/khuyenmai.png" },
    ];

    const products = [
        {
            name: "Ốp Lưng Dẻo Cho iPhone 6 Plus",
            price: 90000,
            image: "./images/productSidebar/img01.jpg",
        },
        {
            name: "Bao Da iPad Pro 10.5 inch",
            price: 1034000,
            image: "./images/productSidebar/img02.jpg",
        },
        {
            name: "Bluetooth Kasimura BL-40",
            price: 749000,
            image: "./images/productSidebar/img03.jpg",
        },
        {
            name: "HD Headphone Creative",
            price: 2345000,
            image: "./images/productSidebar/img04.jpg",
        },
        {
            name: "Máy Nghe Nhạc Astell & Kern",
            price: 27469000,
            image: "./images/productSidebar/img05.jpg",
        },
    ];

    const min = 3750000;
    const max = 29990000;

    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxValue - 1000000);
        setMinValue(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minValue + 1000000);
        setMaxValue(value);
    };

    const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

    const formatPrice = (price) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Danh mục sản phẩm</h2>
            <div className={styles.isDivider}></div>
            <ul className={styles.list}>
                {categories.map((item, index) => (
                    <li key={index}>
                        <NavLink to={item.path} className={({ isActive }) => (isActive ? styles.active : "")}>
                            <img src={item.icon} alt={item.name} className={styles.icon} />
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className={styles.filter}>
                <h2 className={styles.title}>Lọc theo giá</h2>
                <div className={styles.isDivider}></div>
                <div className={styles.rangeSlider}>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={minValue}
                        onChange={handleMinChange}
                        className={`${styles.thumb} ${styles.left}`}
                    />
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={maxValue}
                        onChange={handleMaxChange}
                        className={`${styles.thumb} ${styles.right}`}
                    />

                    <div className={styles.sliderTrack}></div>
                    <div
                        className={styles.sliderRange}
                        style={{
                            left: `${getPercent(minValue)}%`,
                            width: `${getPercent(maxValue) - getPercent(minValue)}%`,
                        }}
                    ></div>
                </div>

                <p>
                    Giá: {formatPrice(minValue)} – {formatPrice(maxValue)}
                </p>
                <button className={styles.btn}>Lọc</button>
            </div>

            <div className={styles.products}>
                <h3>Sản phẩm nổi bật</h3>
                <ul>
                    {products.map((item, index) => (
                        <li key={index}>
                            <img src={item.image}  className={styles.productImage} />
                            <div>
                                <p>{item.name}</p>
                                <span className={styles.price}>
                                    {item.price.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
