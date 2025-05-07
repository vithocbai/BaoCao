import React from "react";
import styles from "./ProductCategories.module.scss";

function ProductCategories() {
    // Dữ liệu danh mục sản phẩm (tạm thời để demo)
    const categories = [
        "Apple",
        "Bao da - Ốp lưng - Dán màn hình",
        "BlackBerry",
        "Laptop",
        "Laptop Asus 1",
        "Laptop Dell",
        "Laptop HP",
        "Laptop Lenovo",
        "Loa",
        "Macbook",
        "Motorola",
        "Máy nghe nhạc",
        "Nokia",
        "Phụ kiện",
        "Phụ kiện âm thanh",
        "Samsung",
        "Tablet",
        "Tablet Beneve",
        "Tablet Cutepad",
        "Tablet Huawei",
        "Tablet Ipad",
        "Tablet Itel",
        "Tablet Kindle",
        "Tablet Mobell",
        "Tablet Samsung",
        "Tai nghe",
        "Điện thoại",
    ];

    return (
        <div className={styles.categories}>
            <div className={styles.container}>
                <h3 className={styles.title}>Danh mục sản phẩm</h3>
                <div className={styles.containerBox}>
                    {categories.map((category, index) => (
                        <div key={index} className={styles.item}>
                            {category}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductCategories;
