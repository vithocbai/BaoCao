import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchOrderById } from "@/api/orderApi";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import styles from "./orderSuccess.module.scss";
import { IoCheckmarkCircle } from "react-icons/io5";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = location.state || {}; // Lấy orderId từ state của navigate
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrderDetail = async () => {
            if (!orderId) {
                // Nếu không có orderId, có thể redirect về trang chủ hoặc giỏ hàng
                toast.error("Không tìm thấy thông tin đơn hàng.");
                navigate("/");
                return;
            }

            try {
                const data = await fetchOrderById(orderId);
                setOrderDetail(data);
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
                setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
                toast.error("Không thể tải thông tin đơn hàng.");
            } finally {
                setLoading(false);
            }
        };

        getOrderDetail();
    }, [orderId, navigate]);

    if (loading) {
        return (
            <section>
                <Header />
                <div className={styles.container}>
                    <div className={styles.loadingMessage}>Đang tải thông tin đơn hàng...</div>
                </div>
                <Footer />
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <Header />
                <div className={styles.container}>
                    <div className={styles.errorMessage}>{error}</div>
                </div>
                <Footer />
            </section>
        );
    }

    if (!orderDetail) {
        return (
            <section>
                <Header />
                <div className={styles.container}>
                    <div className={styles.noOrderFound}>Không tìm thấy đơn hàng.</div>
                </div>
                <Footer />
            </section>
        );
    }

    // Format ngày đặt hàng
    const formattedOrderDate = orderDetail.orderDate
        ? new Date(orderDetail.orderDate).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          })
        : "N/A";

    const customerName = orderDetail.customerInfo?.fullName || "N/A";
    const customerPhone = orderDetail.customerInfo?.phone || "N/A";
    const customerAddress = orderDetail.customerInfo?.address || "N/A";

    return (
        <section>
            <Header />
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <IoCheckmarkCircle className={styles.successIcon} />
                    <h2 className={styles.title}>Đặt hàng thành công!</h2>
                    <p className={styles.orderIdText}>
                        Mã đơn hàng: <span>{orderDetail._id}</span>
                    </p>
                    <p className={styles.thankYouText}>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
                </div>

                <div className={styles.orderDetails}>
                    <h3 className={styles.sectionTitle}>Thông tin đơn hàng</h3>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Người nhận</span>
                        <span className={styles.value}>{customerName}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Số điện thoại</span>
                        <span className={styles.value}>{customerPhone}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Địa chỉ</span>
                        <span className={styles.value}>{customerAddress}</span>
                    </div>
                    {orderDetail.notes && ( // Chỉ hiển thị ghi chú nếu có
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Ghi chú</span>
                            <span className={styles.value}>{orderDetail.notes}</span>
                        </div>
                    )}
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Trạng thái đơn hàng</span>
                        <span className={`${styles.statusBadge} ${styles[orderDetail.status.replace(/\s/g, "")]}`}>
                            {orderDetail.status}
                        </span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Phương thức thanh toán</span>
                        <span className={styles.value}>
                            {orderDetail.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến"}
                        </span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Ngày đặt hàng</span>
                        <span className={styles.value}>{formattedOrderDate}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Tổng tiền</span>
                        <span className={styles.value}>{orderDetail.totalAmount.toLocaleString("vi-VN")}đ</span>
                    </div>

                    <h4 className={styles.sectionSubTitle}>Các sản phẩm đã đặt:</h4>
                    <ul className={styles.productsList}>
                        {orderDetail.products.map((product) => (
                            <li key={product.productId} className={styles.productItem}>
                                <img
                                src={`http://localhost:5000${product.imageUrl}`}
                                    // src={product.imageUrl || "/placeholder-image.jpg"}
                                    alt={product.name}
                                    className={styles.productImage}
                                />
                                <div className={styles.productInfo}>
                                    <span className={styles.productName}>{product.name}</span>
                                    <span className={styles.productQuantity}>Số lượng: {product.quantity}</span>
                                    {product.color && <span className={styles.productColor}>Màu: {product.color}</span>}
                                </div>
                                <span className={styles.productPrice}>
                                    {(product.price * product.quantity).toLocaleString("vi-VN")}đ
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default OrderSuccess;
