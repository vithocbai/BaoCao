import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@components/Home/Home";
import SmartPhone from "./Pages/SmartPhone/SmartPhone";
import Laptop from "./Pages/Laptop/Laptop";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ProductForm from "./Pages/Admin/ProductForm";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dien-thoai" element={<SmartPhone />} />
                    <Route path="/laptop" element={<Laptop />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/product/new" element={<ProductForm />} />
                    <Route path="/admin/product/:id/edit" element={<ProductForm />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
