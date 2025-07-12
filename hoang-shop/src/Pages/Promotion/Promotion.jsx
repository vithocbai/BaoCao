
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import Breadcrumb from "@components/Breadcrumb/Breadcrumb";
import CategoryProductList from "@components/CategoryProductList/CategoryProductList";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Promotion() {
    const location = useLocation();

    const getInitialSortOrder = () => {
        const params = new URLSearchParams(location.search);
        return params.get("sort") || "default";
    };

    const [sortOrder, setSortOrder] = useState(getInitialSortOrder);

    useEffect(() => {
        setSortOrder(getInitialSortOrder());
    }, [location.search]);

    const handleSortChangeFromBreadcrumb = (selectedSort) => {
        setSortOrder(selectedSort);
    };

    return (
        <div>
            <Header />
            <Breadcrumb onSortChange={handleSortChangeFromBreadcrumb} />
            <CategoryProductList
                slug="khuyen-mai"
                title="Sản phẩm khuyến mãi"
                sortOrder={sortOrder}
                isPromotionPage={true}
            />
            <Footer />
        </div>
    );
}

export default Promotion;
