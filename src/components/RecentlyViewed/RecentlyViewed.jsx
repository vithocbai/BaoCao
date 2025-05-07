import styles from './RecentlyViewed.module.scss';

const RecentlyViewed = () => {
  return (
    <section className={styles.recentlyViewed}>
      <div className={styles.container}>
        <h2>Sản phẩm bạn vừa xem</h2>

        <div className={styles.productGrid}>
          <div className={styles.productItem}>
            <img src="/images/product1.png" alt="Product" />
            <span className={styles.badge}>Giảm giá</span>
          </div>
          {/* Thêm các sản phẩm khác tương tự */}
        </div>

        <div className={styles.categoryList}>
          <button className={styles.categoryItem}>Apple</button>
          <button className={styles.categoryItem}>Samsung</button>
          {/* Thêm danh mục khác */}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
