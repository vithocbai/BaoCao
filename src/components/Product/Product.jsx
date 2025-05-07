import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Product.module.scss";
import ProductItem from "../ProductItem/ProductItem"; 

const HotProduct = ({ title, view, viewAllLink, bannerImage, products, isHome = true }) => {
    return (
        <div className={styles.hotProduct}>
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
                                <SwiperSlide key={item.id}>
                                    <ProductItem item={item} /> {/* <<< Thay thế bằng component mới */}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotProduct;
