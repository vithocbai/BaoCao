import Banner from "@components/Banner/Banner";
import Header from "@components/Header/Header";
import Product from "@components/Product/Product";
import TopBrand from "@components/TopBrand/TopBrand";
import ProductCategories from "@components/ProductCategories/ProductCategories";
import Footer from "@components/Footer/Footer";

function Home() {
    return (
        <div>
            <Header />
            <section style={{ backgroundColor: "#f3f3f3" }}>
                <Banner />

                <Product title="ĐIỆN THOẠI ĐƯỢC QUAN TÂM" view="Xem tất cả điện thoại" viewAllLink="/dien-thoai" />

                <TopBrand />

                <Product
                    title="LAPTOP ĐƯỢC QUAN TÂM"
                    view="Xem tất cả laptop"
                    viewAllLink="/dien-thoai"
                    bannerImage="/images/mobileProduct/bannerLaptop.jpg"
                    // products={[
                    //     {
                    //         id: 1,
                    //         name: "Điện Thoại BlackBerry KEYone – Hàng Chính Hãng",
                    //         price: "14,990,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img01.jpg",
                    //             "/images/mobileProduct/img01.1.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    //     {
                    //         id: 2,
                    //         name: "Điện Thoại iPhone X 64GB - Hàng Chính Hãng",
                    //         price: "19,990,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img02.jpg",
                    //             "/images/mobileProduct/img02.2.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    //     {
                    //         id: 3,
                    //         name: "Điện Thoại iPhone 6s 32GB – Hàng Chính Hãng",
                    //         price: "12,100,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img03.jpg",
                    //             "/images/mobileProduct/img03.3.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    //     {
                    //         id: 4,
                    //         name: "Điện Thoại iPhone 7 32GB – Hàng Chính Hãng",
                    //         price: "14,300,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img04.jpg",
                    //             "/images/mobileProduct/img04.4.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    //     {
                    //         id: 5,
                    //         name: "Điện Thoại Samsung Galaxy S8 – Hàng Chính Hãng",
                    //         price: "15,990,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img05.jpg",
                    //             "/images/mobileProduct/img05.5.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    //     {
                    //         id: 6,
                    //         name: "Điện Thoại Samsung Galaxy J7 Pro – Hàng Chính Hãng",
                    //         price: "5,860,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img06.jpg",
                    //             "/images/mobileProduct/img06.6.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    //     {
                    //         id: 7,
                    //         name: "Điện Thoại Samsung Galaxy Note FE – Hàng Chính Hãng",
                    //         price: "13,990,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img07.jpg",
                    //             "/images/mobileProduct/img07.7.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    //     {
                    //         id: 8,
                    //         name: "Điện Thoại Samsung Galaxy Note 8 – Hàng Chính Hãng",
                    //         price: "19,990,000đ",
                    //         image: [
                    //             "/images/mobileProduct/img08.jpg",
                    //             "/images/mobileProduct/img08.8.jpg",
                    //         ],
                    //         sale: true,
                    //     },
                    // ]}
                />

                <Product
                    title="TABLET ĐƯỢC QUAN TÂM"
                    view="Xem tất cả Tablet"
                    viewAllLink="/dien-thoai"
                    bannerImage="/images/mobileProduct/bannerTablet.jpg"
                />

                <Product title="PHỤ KIỆN HOT" view="Xem tất cả phụ kiện" viewAllLink="/dien-thoai" />

                <ProductCategories />
            </section>

            <Footer />
        </div>
    );
}

export default Home;
