import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@components/Home/Home";
import SmartPhone from "@pages/SmartPhone/SmartPhone";
import Laptop from "@pages/Laptop/Laptop";
import ProductDetail from "@components/ProductDetail/ProductDetail";
import Login from "@pages/Login/Login";
import Register from "@pages/Register/Register";
import PrivateRoute from "@components/PrivateRoute/PrivateRoute";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dien-thoai" element={<SmartPhone />} />
                    <Route path="/laptop" element={<Laptop />} />
                    <Route path="/detail" element={<ProductDetail />} />
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
                </Routes>
            </Router>
        </>
    );
}

export default App;
