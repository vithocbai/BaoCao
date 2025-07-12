import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./FeaturedProducts.module.scss";
import { getProducts } from "@/api/productApi";

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatPrice = (price) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await getProducts({ category: "phu-kien", limit: 2 });
                setProducts(data.slice(0, 6));
            } catch (err) {
                setError("Không thể tải sản phẩm nổi bật.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) return <div className={styles.products}>Đang tải...</div>;
    if (error) return <div className={styles.products}>{error}</div>;

    return (
        <div className={styles.products}>
            <h3>Sản phẩm nổi bật</h3>
            <ul>
                {products.map((item, index) => (
                    <li key={index}>
                        <Link to={`/detail/${item._id}`} className={styles.productLink}>
                            <img
                                src={`http://localhost:5000${item.images[0]}`}
                                className={styles.productImage}
                                alt={item.name}
                            />
                            <div>
                                <p>{item.name}</p>
                                <span className={styles.price}>{formatPrice(item.price)}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FeaturedProducts;
