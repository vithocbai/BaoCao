import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import Breadcrumb from "@components/Breadcrumb/Breadcrumb";
import ProductCategories from "@components/ProductCategories/ProductCategories";
import MobileContainer from "@components/MobileContainer/MobileContainer";


function SmartPhone() {
    return (
        <div>
            <Header />
            <Breadcrumb />
            <MobileContainer />
            <ProductCategories />
            <Footer />
        </div>
    );
}

export default SmartPhone;
