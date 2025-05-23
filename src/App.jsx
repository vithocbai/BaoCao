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
import AdminOrderTable from "@pages/admin/AdminOrderTable/AdminOrderTable";

const orders = [
    {
        id: "6810d09...",
        customer: "Trần Trọng Luân",
        date: "00:31:53 30/4/2025",
        total: 1868708,
        paymentMethod: "Thanh toán khi nhận hàng",
        status: "Chờ xác nhận",
    },
    // Các đơn khác...
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
                        <Route path="/admin/orders" element={<AdminOrderTable orders={orders}/>} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
