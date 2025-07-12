import React, { useState, useEffect } from "react"; // Import useEffect
import styles from "./AdminOrderTable.module.scss";
import { updateOrderStatus } from "@/api/orderApi";

const statusClass = {
    "Chờ xác nhận": styles.pending,
    "Đã xác nhận": styles.confirmed,
    "Đã giao hàng": styles.delivered,
    "Hoàn thành": styles.completed, // New status
    "Đã hủy": styles.cancelled,
};

function AdminOrderTable({ orders: initialOrders, onStatusChange }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState(initialOrders);
    console.log(orders);
    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    const openDetail = (order) => {
        setSelectedOrder(order);
    };

    const closeDetail = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        console.log("Cập nhật trạng thái cho đơn hàng ID:", orderId, "Trạng thái mới:", newStatus);
        try {
            await updateOrderStatus(orderId, newStatus);

            const updatedOrders = orders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);

            if (onStatusChange) {
                onStatusChange(orderId, newStatus);
            }

            alert(`Trạng thái đơn hàng ${orderId} đã được cập nhật thành "${newStatus}"`);
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái:", error);
            alert("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.");
        }
    };

    return (
        <div className={styles.orderContainer}>
            <h2 className={styles.title}>Quản lý đơn hàng</h2>

            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr className={styles.tr}>
                        <th className={styles.th}>Mã đơn hàng</th>
                        <th className={styles.th}>Khách hàng</th>
                        <th className={styles.th}>Số điện thoại</th>
                        <th className={styles.th}>Ngày đặt</th>
                        <th className={styles.th}>Tổng tiền</th>
                        <th className={styles.th}>Trạng thái</th>
                        <th className={styles.th}>Thao tác</th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {orders.map((order) => (
                        <tr key={order.id} className={styles.tr}>
                            <td className={styles.td}>{order.orderCode}</td>
                            <td className={styles.td}>{order.customer}</td>
                            <td className={styles.td}>{order.phone}</td>
                            <td className={styles.td}>{order.date}</td>
                            <td className={styles.td}>{order.total.toLocaleString("vi-VN")} VND</td>
                            <td className={styles.td}>
                                <span className={`${styles.status} ${statusClass[order.status]}`}>{order.status}</span>
                            </td>
                            <td className={styles.td}>
                                <button className={styles.viewBtn} onClick={() => openDetail(order)}>
                                    Xem chi tiết
                                </button>
                                {/* <select
                                    defaultValue={order.status}
                                    className={styles.statusSelect}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                                    <option value="Đã xác nhận">Đã xác nhận</option>
                                    <option value="Đã giao hàng">Đã giao hàng</option>
                                    <option value="Đã hủy">Đã hủy</option>
                                </select> */}
                                <select
                                    defaultValue={order.status}
                                    className={styles.statusSelect}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                                    <option value="Đã xác nhận">Đã xác nhận</option>
                                    <option value="Đã giao hàng">Đã giao hàng</option>
                                    <option value="Hoàn thành">Hoàn thành</option> {/* Added option */}
                                    <option value="Đã hủy">Đã hủy</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Popup chi tiết đơn hàng */}
            {selectedOrder && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.modalHeader}>
                            <h2>Chi tiết đơn hàng</h2>
                            <button className={styles.closeButton} onClick={closeDetail}>
                                &times;
                            </button>
                        </div>

                        <div className={styles.orderSummary}>
                            <p className={styles.orderIdText}>Đơn hàng #{selectedOrder.id}</p>
                            <p className={styles.orderDateText}>Ngày đặt: {selectedOrder.fullDate}</p>
                            <button className={`${styles.statusButton} ${statusClass[selectedOrder.status]}`}>
                                {selectedOrder.status}
                            </button>
                        </div>

                        <div className={styles.customerInfoSection}>
                            <h3>Thông tin khách hàng</h3>
                            <p>
                                <strong>Họ tên:</strong> {selectedOrder.customer}
                            </p>
                            <p>
                                <strong>Số điện thoại:</strong> {selectedOrder.phone}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedOrder.email}
                            </p>
                            <p>
                                <strong>Địa chỉ:</strong> {selectedOrder.address}, {selectedOrder.district},{" "}
                                {selectedOrder.province}
                            </p>{" "}
                            {/* Assuming these fields exist */}
                            <p>
                                <strong>Ghi chú:</strong> {selectedOrder.note || "Không có ghi chú"}
                            </p>{" "}
                            {/* Assuming a note field */}
                        </div>

                        <div className={styles.productListSection}>
                            <h3>Danh sách sản phẩm</h3>
                            <table className={styles.productTable}>
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedOrder.products &&
                                        selectedOrder.products.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <img
                                                        src={`http://localhost:5000${product.imageUrl}`}
                                                        alt={product.name}
                                                        className={styles.productImage}
                                                    />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.quantity}</td>
                                                <td>{product.price.toLocaleString("vi-VN")} đ</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className={styles.productListTotal}>
                                <span>Tổng cộng:</span>
                                <span>{selectedOrder.total.toLocaleString("vi-VN")} đ</span>
                            </div>
                        </div>

                        <div className={styles.paymentInfoSection}>
                            <h3>Thông tin thanh toán</h3>
                            <p>
                                <strong>Phương thức:</strong> {selectedOrder.paymentMethod}
                            </p>
                            <p>
                                <strong>Tổng tiền:</strong> {selectedOrder.total.toLocaleString("vi-VN")} đ
                            </p>
                        </div>

                        <div className={styles.statusUpdateFooter}>
                            <p>Cập nhật trạng thái:</p>
                            <div className={styles.statusAction}>
                                {/* <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                    className={styles.footerStatusSelect}
                                >
                                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                                    <option value="Đã xác nhận">Đã xác nhận</option>
                                    <option value="Đã giao hàng">Đã giao hàng</option>
                                    <option value="Đã hủy">Đã hủy</option>
                                </select> */}
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                    className={styles.footerStatusSelect}
                                >
                                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                                    <option value="Đã xác nhận">Đã xác nhận</option>
                                    <option value="Đã giao hàng">Đã giao hàng</option>
                                    <option value="Hoàn thành">Hoàn thành</option> {/* Added option */}
                                    <option value="Đã hủy">Đã hủy</option>
                                </select>
                                <button
                                    className={styles.footerActionButton}
                                    onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status)} // Retrigger with current selected status
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrderTable;
