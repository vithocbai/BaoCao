import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import Breadcrumb from "@components/Breadcrumb/Breadcrumb";
import CategoryProductList from "@components/CategoryProductList/CategoryProductList";

function CateSamsung() {
    const location = useLocation();

    const getInitialSortOrder = () => {
        const params = new URLSearchParams(location.search);
        return params.get("sort") || "default";
    };

    // State để lưu trữ thứ tự sắp xếp hiện tại
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
            <CategoryProductList slug="samsung" title="Samsung" sortOrder={sortOrder} />
            <Footer />
        </div>
    );
}

export default CateSamsung;
