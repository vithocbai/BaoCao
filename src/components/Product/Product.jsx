import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Product.module.scss";
import ProductItem from "../ProductItem/ProductItem";

const Product = ({ title, view, viewAllLink, bannerImage, isHome = true, category }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => {
                const filtered = category ? data.filter((item) => item.category === category) : data;
                setProducts(filtered);
            })
            .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
    }, [category]); 

    return (
        <div className={styles.Product}>
            <div className={styles.container}>
                {isHome && (
                    <div className={styles.header}>
                        <h2>{title}</h2>
                        <a className={styles.viewAll} href={viewAllLink}>
                            {view}
                        </a>
                    </div>
                )}
                <div className={`${styles.content} ${bannerImage ? styles.withBanner : ""}`}>
                    {bannerImage && (
                        <div className={styles.banner}>
                            <img src={bannerImage} alt="Banner" />
                        </div>
                    )}
                    <div className={styles.slider}>
                        <Swiper
                            modules={[Navigation]}
                            navigation={true}
                            loop={true}
                            spaceBetween={10}
                            slidesPerView={bannerImage ? 3 : 4}
                            breakpoints={{
                                1024: { slidesPerView: bannerImage ? 3 : 4 },
                                768: { slidesPerView: bannerImage ? 2 : 2 },
                                0: { slidesPerView: 1 },
                            }}
                        >
                            {products.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <ProductItem item={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
