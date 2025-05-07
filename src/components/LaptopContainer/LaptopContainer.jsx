import Sidebar from "../Sidebar/Sidebar";
import styles from "./LaptopContainer.module.scss";
import ProductItem from "../ProductItem/ProductItem";

function LaptopContainer() {
    const products = [
        {
            id: 1,
            name: "Apple Macbook Air 2017 13.3 inch MQD32 – Hàng Chính Hãng",
            price: "14,990,000đ",
            image: [
                "/images/laptopProduct/img01.jpg", 
                "/images/laptopProduct/img01.1.jpg"
            ],
            sale: true,
        },
        {
            id: 2,
            name: "Apple Macbook Pro 2017 13.3 Inch Touch Bar & ID MPXW2 Gray – Hàng Chính Hãng",
            price: "19,990,000đ",
            image: [
                "/images/laptopProduct/img02.jpg", 
                "/images/laptopProduct/img02.2.jpg"
            ],
            sale: true,
        },
        {
            id: 3,
            name: "Laptop Asus Rog G752VS-BA263 – Core i7-7700HQ/Freedos (17.3 inch) – Xám – Hàng Chính Hãng",
            price: "12,100,000đ",
            image: [
                "/images/laptopProduct/img03.jpg", 
                "/images/laptopProduct/img03.3.jpg"
            ],
            sale: true,
        },
        {
            id: 4,
            name: "Laptop ASUS ROG Strix SCAR GL503VS-EI037T Core i7-7700HQ/ Win 10 15.6 inch – Hàng Chính Hãng",
            price: "14,300,000đ",
            image: [
                "/images/laptopProduct/img04.jpg", 
                "/images/laptopProduct/img04.4.jpg"
            ],
            sale: true,
        },
        {
            id: 5,
            name: "Laptop Dell Inspiron 7567 N7567A – Core i7-7700HQ/Win10 (15.6 inch) – Đen – Hàng Chính Hãng",
            price: "15,990,000đ",
            image: [
                "/images/laptopProduct/img05.jpg", 
                "/images/laptopProduct/img05.5.jpg"
            ],
            sale: true,
        },
        {
            id: 6,
            name: "Laptop Dell Vostro V3568 XF6C61 Core i5-7200U",
            price: "5,860,000đ",
            image: [
                "/images/laptopProduct/img06.jpg", 
                "/images/laptopProduct/img06.6.jpg"
            ],
            sale: true,
        },
        {
            id: 7,
            name: "Laptop HP Envy 13-ad074TU 2LR92PA Core i7-7500U/Win10 (13.3 inch) – Hàng Chính Hãng",
            price: "13,990,000đ",
            image: [
                "/images/laptopProduct/img07.jpg", 
                "/images/laptopProduct/img07.7.jpg"
            ],
            sale: true,
        },
        {
            id: 8,
            name: "Laptop HP ProBook 440 G3 T9S24PA Bạc",
            price: "19,990,000đ",
            image: [
                "/images/laptopProduct/img08.jpg", 
                "/images/laptopProduct/img08.8.jpg"
            ],
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

export default LaptopContainer;
