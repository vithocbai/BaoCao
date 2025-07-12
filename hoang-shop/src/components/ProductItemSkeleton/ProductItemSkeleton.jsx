// src/components/ProductItemSkeleton/ProductItemSkeleton.jsx
import React from "react";
import styles from "./ProductItemSkeleton.module.scss"; // Tạo file CSS module cho skeleton

const ProductItemSkeleton = () => {
  return (
    <div className={styles.ProductItemSkeleton}>
      <div className={styles.imagePlaceholder}></div>
      <div className={styles.textPlaceholderWrapper}>
        <div className={`${styles.textPlaceholder} ${styles.title}`}></div>
        <div className={`${styles.textPlaceholder} ${styles.price}`}></div>
      </div>
    </div>
  );
};

export default ProductItemSkeleton;