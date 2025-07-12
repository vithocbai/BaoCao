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
import AdminOrdersPage from "@pages/admin/AdminOrdersPage/AdminOrdersPage";
import Checkout from "@components/Checkout/Checkout";
import CartView from "@pages/cartView/CartView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSuccess from "@pages/OrderSuccess/OrderSuccess";
import CateApple from "@pages/CateApple/CateApple";
import CateSamsung from "@pages/CateSamSung/CateSamSung";
import CateTablet from "@pages/CateTablet/CateTablet";
import Accessory from "@pages/Accessory/Accessory";
import NewsPage from "@pages/NewsPage/NewsPage";
import AdminNewsPage from "@pages/admin/AdminNewsPage/AdminNewsPage";
import SingleNewsPage from "@pages/SingleNewsPage/SingleNewsPage";
import Promotion from "@pages/Promotion/Promotion";
import ChatbotWidget from "@components/ChatbotWidget/ChatbotWidget";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tin-hay" element={<NewsPage />} />
                    <Route path="/tin-hay/:slug" element={<SingleNewsPage />} />
                    <Route path="/dien-thoai" element={<SmartPhone />} />
                    <Route path="/laptop" element={<Laptop />} />
                    <Route path="/apple" element={<CateApple />} />
                    <Route path="/samsung" element={<CateSamsung />} />
                    <Route path="/tablet" element={<CateTablet />} />
                    <Route path="/phu-kien" element={<Accessory />} />
                    <Route path="/khuyen-mai" element={<Promotion />} />
                    <Route path="/detail/:productId" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/cart" element={<CartView />} />
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
                        <Route path="/admin/orders" element={<AdminOrdersPage />} />
                        <Route path="/admin/news" element={<AdminNewsPage />} />
                    </Route>
                </Routes>
            </Router>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ChatbotWidget />
        </>
    );
}

export default App;
