import React, { useState } from "react";
import styles from "./ProductItem.module.scss";
import { Link } from "react-router-dom";

const ProductItem = ({ item, setHeight = false }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <div className={styles.productCard}>
            <Link to={`/detail/${item._id}`} className={styles.link}>
                <div
                    className={styles.imageWrapper}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    {/* Ảnh chính */}
                    <img
                        style={{ minHeight: setHeight ? "197px" : "293px" }}
                        src={`http://localhost:5000${item.images?.[0]}`}
                        alt={item.name}
                    />

                    {/* Nếu có ảnh thứ 2 và hover thì hiển thị */}
                    {item.images?.[1] && isHover && (
                        <img
                            className={styles.hoverImage}
                            style={{
                                minHeight: setHeight ? "197px" : "293px",
                            }}
                             src={`http://localhost:5000${item.images?.[1]}`}
                            alt={`${item.name} hover`}
                        />
                    )}
                
                    {Number(item.discountPercent) > 0 && <span className={styles.saleTag}>Giảm giá</span>}

                </div>

                <div className={styles.info}>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.price}>{item.price.toLocaleString()}₫</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductItem;
