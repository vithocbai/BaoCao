const API_BASE_URL = "http://localhost:5000";
import React, { useEffect, useState } from "react";
import styles from "./UserOrderList.module.scss";
import { getUser, getToken } from "@/utils/auth";
import { fetchOrdersByUser } from "@/api/orderApi";

const ORDERS_PER_PAGE = 3; // Số đơn hàng hiển thị trên mỗi trang

const UserOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null); // State để lưu đơn hàng được chọn xem chi tiết

    // Lấy thông tin user và token ngay khi component được render
    const user = getUser();
    const token = getToken();

    useEffect(() => {
        const loadOrders = async () => {
            if (!user || !token) {
                setError("Người dùng chưa đăng nhập hoặc không có token.");
                setLoading(false);
                return;
            }

            console.log("UserOrderList (frontend): Đang gọi fetchOrdersByUser...");
            try {
                const data = await fetchOrdersByUser();
                console.log("UserOrderList (frontend): Dữ liệu đơn hàng nhận được:", data);
                setOrders(data);
            } catch (err) {
                console.error("UserOrderList (frontend): Lỗi khi tải đơn hàng:", err);
                setError("Failed to load orders: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user, token]); // Thêm user và token vào dependency array để re-fetch nếu chúng thay đổi

    // Hàm tiện ích để định dạng tiền tệ
    const formatCurrency = (amount) => {
        return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    // Hàm tiện ích để định dạng ngày và giờ
    const formatDateTime = (dateString) => {
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("vi-VN", options);
    };

    // Logic phân trang
    const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
    const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Xử lý xem chi tiết đơn hàng
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    // Đóng modal chi tiết đơn hàng
    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    if (loading) {
        return <div className={styles.loading}>Đang tải danh sách đơn hàng...</div>;
    }

    if (error) {
        return <div className={styles.error}>Lỗi: {error}</div>;
    }

    if (orders.length === 0 && !loading) {
        return <div className={styles.noOrders}>Bạn chưa có đơn hàng nào.</div>;
    }

    return (
        <div className={styles.userOrderList}>
            <h2>Quản lý đơn hàng</h2>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Phương thức</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr key={order._id}>
                                <td className={styles.orderCode}>
                                    <span className={styles.orderCodeText}>
                                        {order.orderCode || order._id.substring(0, 8).toUpperCase()}
                                    </span>
                                </td>
                                <td>{new Date(order.orderDate).toLocaleDateString("vi-VN")}</td>
                                <td>
                                    {order.products.map((product, index) => (
                                        <div key={product._id || index} className={styles.productItem}>
                                            <img
                                                src={
                                                    product.imageUrl
                                                        ? `${API_BASE_URL}${product.imageUrl}`
                                                        : "/default-product.png"
                                                }
                                                alt={product.name}
                                                className={styles.productImage}
                                            />
                                            {/* <div className={styles.productDetails}>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productQuantity}>SL: {product.quantity}</p>
                      </div> */}
                                        </div>
                                    ))}
                                </td>
                                <td className={styles.totalAmount}>{formatCurrency(order.totalAmount)}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <span
                                        className={`${styles.statusBadge} ${
                                            styles[order.status.replace(/\s/g, "").toLowerCase()]
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.actionButton} onClick={() => handleViewDetails(order)}>
                                        {order.status === "Đã giao" ? "Đánh giá" : "Xem chi tiết"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Trước
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={currentPage === index + 1 ? styles.active : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={handleCloseDetails}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>
                            Chi tiết đơn hàng #
                            {selectedOrder.orderCode || selectedOrder._id.substring(0, 8).toUpperCase()}
                        </h3>
                        <p>
                            <strong>Ngày đặt:</strong> {formatDateTime(selectedOrder.orderDate)}
                        </p>
                        <p>
                            <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}
                        </p>
                        <p>
                            <strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}
                        </p>
                        <p>
                            <strong>Trạng thái:</strong>{" "}
                            <span
                                className={`${styles.statusBadge} ${
                                    styles[selectedOrder.status.replace(/\s/g, "").toLowerCase()]
                                }`}
                            >
                                {selectedOrder.status}
                            </span>
                        </p>

                        <h4>Sản phẩm:</h4>
                        <ul className={styles.detailProductList}>
                            {selectedOrder.products.map((product, index) => (
                                <li key={product._id || index} className={styles.detailProductItem}>
                                    <img
                                        src={
                                            product.imageUrl
                                                ? `${API_BASE_URL}${product.imageUrl}`
                                                : "/default-product.png"
                                        }
                                        alt={product.name}
                                        className={styles.detailProductImage}
                                    />
                                    <div className={styles.detailProductInfo}>
                                        <p className={styles.detailProductName}>{product.name}</p>
                                        <p>Số lượng: {product.quantity}</p>
                                        {product.color && <p>Màu: {product.color}</p>}
                                        <p>Giá: {formatCurrency(product.price)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className={styles.detailTotalAmount}>
                            <strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.totalAmount)}
                        </p>
                        <button className={styles.closeButton} onClick={handleCloseDetails}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrderList;
