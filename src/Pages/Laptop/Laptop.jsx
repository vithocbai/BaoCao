import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import Breadcrumb from "@components/Breadcrumb/Breadcrumb";
import ProductCategories from "@components/ProductCategories/ProductCategories";
import LaptopContainer from "@components/LaptopContainer/LaptopContainer";

function Laptop() {
    return (
        <div>
            <Header />
            <Breadcrumb />
            <LaptopContainer />
            <ProductCategories />
            <Footer />
        </div>
    );
}

export default Laptop;
