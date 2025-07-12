// src/components/Product/Product.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Product.module.scss";
import ProductItem from "../ProductItem/ProductItem";
// Import skeletal loader component
import ProductItemSkeleton from "../ProductItemSkeleton/ProductItemSkeleton"; // Bạn sẽ tạo component này

import { getCategories, getProducts } from "@/api/productApi";

const Product = ({ title, view, viewAllLink, bannerImage, isHome = true, category }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Thêm state isLoading

    // Lấy danh sách danh mục
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Lỗi khi lấy danh mục:", err);
            }
        };
        fetchAllCategories();
    }, []);

    // Lấy danh sách sản phẩm kèm lọc theo category + danh mục con
    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            setIsLoading(true); // Bắt đầu tải, đặt isLoading là true
            try {
                const allProducts = await getProducts();

                if (!category) {
                    setProducts(allProducts);
                    return;
                }

                if (categories.length === 0) {
                    return;
                }

                const subCategories = categories
                    .filter((c) => c.parent?.slug === category || c.parent === category)
                    .map((c) => c.slug);

                const allRelevantCategories = [category, ...subCategories];

                const filtered = allProducts.filter((item) => allRelevantCategories.includes(item.category));
                setProducts(filtered);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
            } finally {
                setIsLoading(false); // Kết thúc tải, đặt isLoading là false dù thành công hay thất bại
            }
        };

        fetchAndFilterProducts();
    }, [category, categories]);

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
                            {isLoading
                                ? // Hiển thị skeletal loader khi đang tải
                                  Array.from({ length: bannerImage ? 3 : 4 }).map((_, index) => (
                                      <SwiperSlide key={index}>
                                          <ProductItemSkeleton />
                                      </SwiperSlide>
                                  ))
                                : // Hiển thị sản phẩm khi đã tải xong
                                  products.map((item) => (
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


