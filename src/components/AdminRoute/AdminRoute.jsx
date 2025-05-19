import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    let user = null;
    try {
        user = JSON.parse(userRaw);
    } catch (err) {
        console.error("Lỗi parse user:", err);
    }

    if (!user || !token || user.role !== "admin") {
        console.warn("Redirecting to / because role is not admin or missing token");
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
