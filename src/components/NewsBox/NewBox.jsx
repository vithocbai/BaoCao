import React from "react";
import styles from "./NewBox.module.scss";

function NewsBox() {
    return (
        <div className={styles.newsBox}>
            <div className={styles.ad}>
                <img src="/images/banner/quancao01.jpg" alt="Quảng cáo nhỏ" />
                <img src="/images/banner/quancao02.jpg" alt="Quảng cáo nhỏ" />
            </div>

            <div className={styles.news}>
                <div className={styles.titleHead}>
                    <h3>TIN CÔNG NGHỆ NỔI BẬT</h3>
                    <a href="">Xem tất cả</a>
                </div>

                <div className={styles.boxNews}>
                    <div className={styles.boxItem}>
                        <img src="/images/newbox/img01.jpg" alt="Product" className={styles.boxItemImg} />
                        <div className={styles.boxItemContent}>
                            <p>Trọn bộ hình nền Huawei Mate 10 đẹp “miễn chê” cho mọi smartphone</p>
                        </div>
                    </div>

                    <div className={styles.boxItem}>
                        <img src="/images/newbox/img02.jpg" alt="Product" className={styles.boxItemImg} />
                        <div className={styles.boxItemContent}>
                            <p>
                                Rò rỉ thông tin Nokia 6 (2018): Màn hình tràn viền, tỉ lệ 18:9, Snapdragon 6XX, RAM 4GB
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsBox;
