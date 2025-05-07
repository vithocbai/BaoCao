import React from "react";
import styles from "./TopBrand.module.scss";

const brands = [
    { id: 1, image: "/images/brand/apple.png" },
    { id: 2, image: "/images/brand/meizu.png" },
    { id: 3, image: "/images/brand/nokia.png" },
    { id: 4, image: "/images/brand/oppo.png" },
    { id: 5, image: "/images/brand/samsung.png" },
    { id: 6, image: "/images/brand/sony.png" },
    { id: 7, image: "/images/brand/vivo.png" },
];

const TopBrand = () => {
    return (
        <div className={styles.topBrand}>
            <h3>TOP THƯƠNG HIỆU ĐIỆN THOẠI</h3>
            <div className={styles.brandList}>
                {brands.map((brand) => (
                    <img key={brand.id} src={brand.image} alt="Brand" />
                ))}
            </div>
        </div>
    );
};

export default TopBrand;
