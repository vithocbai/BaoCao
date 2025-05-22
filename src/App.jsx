import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@components/Home/Home";
import SmartPhone from "@pages/SmartPhone/SmartPhone";
import Laptop from "@pages/Laptop/Laptop";
import ProductDetail from "@components/ProductDetail/ProductDetail";
import Login from "@pages/Login/Login";
import Register from "@pages/Register/Register";
import PrivateRoute from "@components/PrivateRoute/PrivateRoute";
import NewsSection from "@pages/NewSection/NewsSection";
import Profile from "@pages/Profile/Profile";
import AdminRoute from "@components/AdminRoute/AdminRoute";
import AdminLayout from "@pages/admin/AdminLayout.jsx/AdminLayout.jsx";
import DashboardAdmin from "@pages/admin/DashboardAdmin/DashboardAdmin";
import AdminProduct from "@pages/admin/AdminProduct/Adminproduct";
import AdminCategory from "@pages/admin/AdminCategory/AdminCategory";
import AdminUser from "@pages/admin/AdminUser/AdminUser";


const initialProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 32990000,
        category: "Điện thoại",
        brand: "Apple",
        stock: 12,
        image: "/images/products/iphone-15-pm.jpg",
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 28990000,
        category: "Điện thoại",
        brand: "Samsung",
        stock: 7,
        image: "/images/products/galaxy-s24-ultra.jpg",
    },
    // ...
];

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dien-thoai" element={<SmartPhone />} />
                    <Route path="/laptop" element={<Laptop />} />
                    <Route path="/detail/:productId" element={<ProductDetail />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/tin-tuc" element={<NewsSection />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminLayout />
                            </AdminRoute>
                        }
                    >
                        <Route index element={<DashboardAdmin />} />
                        <Route path="products" element={<AdminProduct />} />
                        <Route path="/admin/categories" element={<AdminCategory />} />
                        <Route path="/admin/users" element={<AdminUser />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
