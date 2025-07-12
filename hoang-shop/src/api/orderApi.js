import { getToken } from "@/utils/auth"; // Đảm bảo đường dẫn này đúng với cấu trúc của bạn

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Hàm hỗ trợ xử lý response từ API
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.message || `Lỗi từ server: ${response.status} ${response.statusText}`);
    }
    return data;
};

// 1. Đặt hàng mới (POST /api/orders)
export const placeOrder = async (orderData) => {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }), // Thêm token nếu tồn tại
            },
            body: JSON.stringify(orderData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Lỗi trong placeOrder:", error);
        throw error;
    }
};

// 2. Lấy TẤT CẢ đơn hàng (GET /api/orders) - Thường dùng cho Admin
export const fetchAllOrders = async () => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized: Không có token xác thực.");

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Lỗi trong fetchAllOrders:", error);
        throw error;
    }
};

// 3. Cập nhật trạng thái đơn hàng (PUT /api/orders/:id/status)
export const updateOrderStatus = async (orderId, newStatus) => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized: Không có token xác thực để cập nhật trạng thái.");

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        throw error;
    }
};

// 4. Lấy chi tiết đơn hàng theo ID (GET /api/orders/:id)
export const fetchOrderById = async (orderId) => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized: Không có token xác thực.");

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`Lỗi trong fetchOrderById (ID: ${orderId}):`, error);
        throw error;
    }
};

// 5. Lấy đơn hàng của người dùng đang đăng nhập (GET /api/orders/user)
export const fetchOrdersByUser = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Unauthorized: Người dùng chưa đăng nhập hoặc không có token.");
    }

    try {
        const url = `${API_BASE_URL}/api/orders/user`;
        // Console logs để debug, bạn có thể xóa khi mọi thứ ổn định
        console.log("fetchOrdersByUser (frontend): Gọi URL:", url);
        console.log("fetchOrdersByUser (frontend): Gửi Authorization Header:", `Bearer ${token.substring(0, 10)}...`);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("fetchOrdersByUser (frontend): Response Status:", response.status);

        return handleResponse(response);
    } catch (error) {
        console.error("Lỗi trong fetchOrdersByUser (frontend):", error);
        throw error;
    }
};

// 6. Xóa đơn hàng (DELETE /api/orders/:id)
export const deleteOrder = async (orderId) => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized: Không có token xác thực để xóa đơn hàng.");

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`Lỗi khi xóa đơn hàng (ID: ${orderId}):`, error);
        throw error;
    }
};
