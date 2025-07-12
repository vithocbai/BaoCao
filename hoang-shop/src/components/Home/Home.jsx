import Banner from "@components/Banner/Banner";
import Header from "@components/Header/Header";
import Product from "@components/Product/Product";
import TopBrand from "@components/TopBrand/TopBrand";
import Footer from "@components/Footer/Footer";

function Home() {
    return (
        <div>
            <Header />
            <section style={{ backgroundColor: "#f3f3f3" }}>
                <Banner />
                <Product
                    title="ĐIỆN THOẠI ĐƯỢC QUAN TÂM"
                    view="Xem tất cả điện thoại"
                    viewAllLink="/dien-thoai"
                    category="dien-thoai"
                />
                <TopBrand />
                <Product
                    title="LAPTOP ĐƯỢC QUAN TÂM"
                    view="Xem tất cả laptop"
                    viewAllLink="/dien-thoai"
                    bannerImage="/images/mobileProduct/bannerLaptop.jpg"
                    category="laptop"
                />

                <Product
                    title="TABLET ĐƯỢC QUAN TÂM"
                    view="Xem tất cả Tablet"
                    viewAllLink="/dien-thoai"
                    bannerImage="/images/mobileProduct/bannerTablet.jpg"
                    category="tablet"
                />

                <Product title="PHỤ KIỆN HOT" view="Xem tất cả phụ kiện" viewAllLink="/phu-kien" category="phu-kien" />
            
            </section>

            <Footer />
        </div>
    );
}
export default Home;
