import Sidebar from "../Sidebar/Sidebar";
import styles from "./MobileContainer.module.scss";
import ProductItem from "../ProductItem/ProductItem";

function MobileContainer() {
    const products = [
        {
            id: 1,
            name: "Điện Thoại BlackBerry KEYone – Hàng Chính Hãng",
            price: "14,990,000đ",
            image: ["/images/mobileProduct/img05.jpg", "/images/mobileProduct/img05.5.jpg"],
            sale: true,
        },
        {
            id: 2,
            name: "Điện Thoại iPhone 6s 32GB – Hàng Chính Hãng",
            price: "12,100,000đ",
            image: ["/images/mobileProduct/img03.jpg", "/images/mobileProduct/img03.3.jpg"],
            sale: true,
        },
        {
            id: 3,
            name: "Điện Thoại iPhone X 64GB - Hàng Chính Hãng",
            price: "19,990,000đ",
            image: ["/images/mobileProduct/img02.jpg", "/images/mobileProduct/img02.2.jpg"],
            sale: true,
        },
        
        {
            id: 4,
            name: "Điện Thoại iPhone 7 32GB – Hàng Chính Hãng",
            price: "14,300,000đ",
            image: ["/images/mobileProduct/img04.jpg", "/images/mobileProduct/img04.4.jpg"],
            sale: true,
        },
        {
            id: 5,
            name: "Điện Thoại Samsung Galaxy S8 – Hàng Chính Hãng",
            price: "15,990,000đ",
            image: ["/images/mobileProduct/img01.jpg", "/images/mobileProduct/img01.1.jpg"],
            sale: true,
        },
        {
            id: 6,
            name: "Điện Thoại Samsung Galaxy J7 Pro – Hàng Chính Hãng",
            price: "5,860,000đ",
            image: ["/images/mobileProduct/img06.jpg", "/images/mobileProduct/img06.6.jpg"],
            sale: true,
        },
        {
            id: 7,
            name: "Điện Thoại Samsung Galaxy Note FE – Hàng Chính Hãng",
            price: "13,990,000đ",
            image: ["/images/mobileProduct/img07.jpg", "/images/mobileProduct/img07.7.jpg"],
            sale: true,
        },
        {
            id: 8,
            name: "Điện Thoại Samsung Galaxy Note 8 – Hàng Chính Hãng",
            price: "19,990,000đ",
            image: ["/images/mobileProduct/img08.jpg", "/images/mobileProduct/img08.8.jpg"],
            sale: true,
        },
    ];

    return (
        <section className={styles.mobileSection}>
            <div className={styles.mobileContainer}>
                <aside className={styles.sidebarWrapper}>
                    <Sidebar />
                </aside>
                <section className={styles.productGrid}>
                    {products.map((item) => (
                        <ProductItem setHeight key={item.id} item={item} />
                    ))}
                </section>
            </div>
        </section>
    );
}

export default MobileContainer;
