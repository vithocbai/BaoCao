import React from 'react';
import styles from './ProductDetail.module.scss';
import frontImg from './images/bb-keyone-front.jpg';
import backImg from './images/bb-keyone-back.jpg';
import sideImg from './images/bb-keyone-side.jpg';

const ProductDetail = () => {
  return (
    <div className={styles.productDetail}>
      <div className={styles.left}>
        <img src={frontImg} alt="BlackBerry KeyOne" className={styles.mainImage} />
        <div className={styles.thumbnailGroup}>
          <img src={frontImg} alt="Front" />
          <img src={backImg} alt="Back" />
          <img src={sideImg} alt="Side" />
        </div>
      </div>

      <div className={styles.right}>
        <h1>Điện Thoại BlackBerry KEYone – Hàng Chính Hãng</h1>
        <p className={styles.price}>14,990,000 ₫</p>
        <ul className={styles.features}>
          <li>Chính hãng, Nguyên seal, Mới 100%</li>
          <li>Miễn phí giao hàng toàn quốc</li>
          <li>Thiết kế: Nguyên khối</li>
          <li>Màn hình 4.5 inch, độ phân giải 1620x1080 pixels</li>
          <li>Camera Trước/Sau: 8MP/12MP</li>
          <li>CPU: Snapdragon 625 Octa-Core 2.0 GHz</li>
          <li>Bộ nhớ: 32GB, RAM: 3GB</li>
        </ul>

        <div className={styles.actions}>
          <div className={styles.quantity}>
            <button>-</button>
            <input type="text" value="1" readOnly />
            <button>+</button>
          </div>
          <button className={styles.addToCart}>THÊM VÀO GIỎ</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
