const API_BASE_URL = "http://localhost:5000/api";

/** ======== AUTH UTILS ======== **/
export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) return null;

    try {
        return JSON.parse(user);
    } catch (err) {
        console.error("Lỗi parse user từ localStorage:", err);
        return null;
    }
};

/** ======== HELPER ======== **/
const handleResponse = async (res) => {
    if (res.status === 401) {
        console.warn("Token hết hạn hoặc không hợp lệ. Đang xóa token.");
        localStorage.removeItem("token");
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi.");
    }

    return res.json();
};

/** ======== API ======== **/
export const fetchCartItems = async () => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await handleResponse(res);
};

export const updateCartItems = async ({ items, total }) => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");

    try {
        const res = await fetch(`${API_BASE_URL}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                items,
                total,
                paymentMethod: "Thanh toán khi nhận hàng",
                status: "Chờ xác nhận",
            }),
        });

        const data = await handleResponse(res);
        return data;
    } catch (err) {
        // toast.error("Cập nhật giỏ hàng thất bại!");
        console.error("Không thể cập nhật giỏ hàng:", err);
        throw err;
    }
};
