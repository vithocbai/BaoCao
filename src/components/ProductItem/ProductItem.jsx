import React, { useState } from "react";
import styles from "./ProductItem.module.scss";
import { Link } from "react-router-dom";
const ProductItem = ({ item, setHeight = false }) => {
    console.log(item.image[0]);

    return (
        <div className={styles.productCard}>
            <Link to='/Detail'
                className={styles.imageWrapper}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <img
                    style={{
                        minHeight: setHeight ? "197px" : "293px",
                    }}
                    src={item.image[0]}
                    alt={item.name}
                />
                {item.image[1] && (
                    <img
                        className={styles.hoverImage}
                        style={{
                            minHeight: setHeight ? "197px" : "293px",
                        }}
                        src={item.image[1]}
                        alt={item.name}
                    />
                )}

                {item.sale && <span className={styles.saleTag}>Giảm giá</span>}

                <div className={styles.info}>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.price}>{item.price}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductItem;
