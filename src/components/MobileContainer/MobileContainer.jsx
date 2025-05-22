import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MobileContainer.module.scss";
import ProductItem from "../ProductItem/ProductItem";

function MobileContainer() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("❌ Lỗi khi fetch sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className={styles.mobileSection}>
            <div className={styles.mobileContainer}>
                <aside className={styles.sidebarWrapper}>
                    <Sidebar />
                </aside>
                <section className={styles.productGrid}>
                    {loading ? (
                        <p>Đang tải sản phẩm...</p>
                    ) : products.length > 0 ? (
                        products.map((item) => <ProductItem setHeight key={item._id} item={item} />)
                    ) : (
                        <p>Không có sản phẩm nào</p>
                    )}
                </section>
            </div>
        </section>
    );
}

export default MobileContainer;
