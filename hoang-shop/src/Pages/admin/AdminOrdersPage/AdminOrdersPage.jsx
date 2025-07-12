import React, { useEffect, useState, useCallback } from "react";
import { fetchAllOrders } from "@/api/orderApi";
import AdminOrderTable from "@pages/admin/AdminOrderTable/AdminOrderTable";

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm định dạng dữ liệu đơn hàng
    const formatOrderData = (order) => ({
        id: order._id,
        orderCode: order.orderCode || "Không rõ",
        customer: order.customerInfo?.fullName || "Không rõ",
        email: order.customerInfo?.email || "Không rõ",
        phone: order.customerInfo?.phone || "Không rõ",
        address: order.customerInfo?.address || "Không rõ",
        date: new Date(order.orderDate).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
        // Định dạng đầy đủ ngày/tháng/năm và giờ/phút/giây cho xem chi tiết
        fullDate: new Date(order.orderDate).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
        total: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        notes: order.notes || "",
        products:
            order.products?.map((p) => ({
                productId: p.productId,
                name: p.name,
                quantity: p.quantity,
                price: p.price,
                color: p.color,
                imageUrl: p.imageUrl,
            })) || [],
    });

    // Gọi API lấy đơn hàng
    const loadOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllOrders();
            const formattedOrders = data.map(formatOrderData);
            setOrders(formattedOrders);
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
            setError(err?.message || "Đã xảy ra lỗi khi tải đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Xử lý khi đổi trạng thái đơn hàng
    const handleStatusChangeInTable = async (orderId, newStatus) => {
        console.log(`Đơn hàng ${orderId} đã thay đổi trạng thái thành ${newStatus}`);
        // TODO: Có thể gọi API cập nhật trạng thái ở đây nếu muốn
    };
    
    // Loading và Error UI
    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // Giao diện bảng đơn hàng
    return <AdminOrderTable orders={orders} onStatusChange={handleStatusChangeInTable} />;
}

export default AdminOrdersPage;
