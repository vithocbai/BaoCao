import React, { useEffect, useState, useCallback } from "react";
import ProductItem from "../ProductItem/ProductItem";
import styles from "./CategoryProductList.module.scss";
import Sidebar from "@components/Sidebar/Sidebar";
// Import both getProducts and getSaleProducts from your API
import { getProducts, getCategories, getSaleProducts } from "@/api/productApi";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import ProductItemSkeleton from "../ProductItemSkeleton/ProductItemSkeleton";

function CategoryProductList({ slug, title, sortOrder, isPromotionPage = false }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterParams, setFilterParams] = useState({
        minPrice: null,
        maxPrice: null,
        category: null,
        sort: null,
    });

    const handlePriceFilterChange = useCallback((newPriceFilters) => {
        setFilterParams((prevParams) => ({
            ...prevParams,
            minPrice: newPriceFilters.minPrice,
            maxPrice: newPriceFilters.maxPrice,
        }));
    }, []);

    const fetchProductsByFilters = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let apiParams = { ...filterParams };

            let fetchedProducts;

            if (isPromotionPage) {
                if (sortOrder && sortOrder !== "default") {
                    apiParams.sort = sortOrder;
                } else {
                    delete apiParams.sort;
                }

                fetchedProducts = await getSaleProducts(apiParams);
            } else {
                let currentCategorySlugs = [];

                if (slug) {
                    const allCategories = await getCategories();
                    const currentCategory = allCategories.find((cat) => cat.slug === slug);

                    if (currentCategory) {
                        currentCategorySlugs.push(currentCategory.slug);
                        const findSubCategories = (parentId) => {
                            return allCategories.filter(
                                (cat) => cat.parent?._id === parentId || cat.parent === parentId
                            );
                        };

                        let queue = [currentCategory];
                        let visited = new Set();

                        while (queue.length > 0) {
                            const current = queue.shift();
                            if (visited.has(current._id)) continue;
                            visited.add(current._id);

                            const children = findSubCategories(current._id);
                            children.forEach((child) => {
                                if (!currentCategorySlugs.includes(child.slug)) {
                                    currentCategorySlugs.push(child.slug);
                                }
                                queue.push(child);
                            });
                        }
                    } else {
                        console.warn(`Không tìm thấy danh mục với slug: ${slug}`);
                    }
                }

                if (currentCategorySlugs.length > 0) {
                    apiParams.category = currentCategorySlugs.join(",");
                } else {
                    delete apiParams.category;
                }

                if (sortOrder && sortOrder !== "default") {
                    apiParams.sort = sortOrder;
                } else {
                    delete apiParams.sort;
                }

                fetchedProducts = await getProducts(apiParams);
            }

            setProducts(fetchedProducts);
        } catch (err) {
            setError("Không thể tải sản phẩm. Vui lòng thử lại.");
            console.error("Lỗi khi lấy sản phẩm:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [slug, sortOrder, filterParams, isPromotionPage]);

    useEffect(() => {
        fetchProductsByFilters();
    }, [fetchProductsByFilters]);

    useEffect(() => {
        if (loading) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [loading]);

    return (
        <section className={styles.CategorySection}>
            <div className={styles.CategoryContainer}>
                <aside className={styles.CategoryWrapper}>
                    <Sidebar onPriceFilterChange={handlePriceFilterChange} />
                </aside>
                <section className={styles.CategoryGrid}>
                    {loading ? (
                        <div className={styles.productGridSkeleton}>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <ProductItemSkeleton key={index} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className={styles.productGrid}>
                            {products.map((item) => (
                                <ProductItem setHeight key={item._id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noProductsMessage}>Không có sản phẩm khuyến mãi nào.</p>
                    )}
                </section>
            </div>
        </section>
    );
}

export default CategoryProductList;
