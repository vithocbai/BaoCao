import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "@/api/orderApi";
import styles from "./checkout.module.scss";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import { HiCurrencyDollar } from "react-icons/hi2";

// Hàm kiểm tra định dạng email
const isValidEmail = (email) => {
    // Regex cho email cơ bản (có thể phức tạp hơn nếu cần)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Hàm kiểm tra định dạng số điện thoại Việt Nam
const isValidVietnamesePhoneNumber = (phone) => {
    // Regex cho số điện thoại Việt Nam:
    // Bắt đầu bằng 0
    // Tiếp theo là 2 hoặc 3 (đầu số di động hoặc cố định phổ biến)
    // Tổng cộng 10 chữ số
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
    // Hoặc nếu bạn chỉ muốn 10 số bắt đầu bằng 0
    // const phoneRegex = /^0(3|5|7|8|9)\d{8}$/;
    return phoneRegex.test(phone);
};

const Checkout = () => {
    const { cartItems, loading, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        paymentMethod: "cod", // Default to Cash on Delivery
    });
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({}); // State mới để lưu lỗi validation

    const totalAmount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    useEffect(() => {
        if (!loading && cartItems.length === 0) {
            toast.info("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.");
            navigate("/cart");
        }
    }, [loading, cartItems, navigate]);

    if (loading) {
        return (
            <div className={styles.checkoutContainer}>
                <div className={styles.loadingMessage}>Đang tải giỏ hàng...</div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Xóa lỗi validation khi người dùng bắt đầu nhập lại
        setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const errors = {};

        // Basic validation
        if (!formData.fullName) {
            errors.fullName = "Vui lòng nhập họ tên.";
        }
        if (!formData.phone) {
            errors.phone = "Vui lòng nhập số điện thoại.";
        } else if (!isValidVietnamesePhoneNumber(formData.phone)) {
            // Validation số điện thoại
            errors.phone =
                "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (ví dụ: 0987654321).";
        }
        if (!formData.address) {
            errors.address = "Vui lòng nhập địa chỉ.";
        }
        if (!formData.email) {
            // Email là bắt buộc nếu bạn đã bỏ required trong schema
            errors.email = "Vui lòng nhập email.";
        } else if (!isValidEmail(formData.email)) {
            // Validation email
            errors.email =
                "Địa chỉ email không hợp lệ. Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com).";
        }

        // Kiểm tra nếu có lỗi validation
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
            setSubmitting(false);
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống. Không thể đặt hàng.");
            setSubmitting(false);
            navigate("/cart");
            return;
        }

        try {
            const orderData = {
                customerInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                },
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    name: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    color: item.color,
                    imageUrl: item.images && item.images[0] ? item.images[0] : "/placeholder-image.jpg",
                })),
                totalAmount: totalAmount,
                paymentMethod: formData.paymentMethod,
                notes: formData.notes,
            };

            const response = await placeOrder(orderData);
            toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
            console.log("Order placed:", response);

            if (clearCart) {
                clearCart();
            }

            navigate("/order-success", { state: { orderId: response.orderId || "N/A" } });
        } catch (error) {
            toast.error(error.message || "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section>
            <Header />
            <div className={styles.checkoutContainer}>
                <h2 className={styles.pageHeader}>Thanh Toán Đơn Hàng</h2>
                <form onSubmit={handleSubmit} className={styles.checkoutForm} noValidate>
                    <div className={styles.mainContentGroup}>
                        <div className={`${styles.section} ${styles.shippingInfoSection}`}>
                            <h3 className={styles.title}>1. Thông tin giao hàng</h3>

                            <div className={styles.formGroup}>
                                <label htmlFor="fullName">
                                    Họ và tên <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                {validationErrors.fullName && (
                                    <p className={styles.validationMessage}>{validationErrors.fullName}</p>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    // Bỏ required ở đây nếu bạn muốn nó là tùy chọn,
                                    // nhưng vẫn validate định dạng nếu có nhập
                                />
                                {validationErrors.email && ( // Hiển thị lỗi email
                                    <p className={styles.validationMessage}>{validationErrors.email}</p>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">
                                    Số điện thoại <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                {validationErrors.phone && ( // Hiển thị lỗi số điện thoại
                                    <p className={styles.validationMessage}>{validationErrors.phone}</p>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="address">
                                    Địa chỉ giao hàng <span className={styles.required}>*</span>
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="6"
                                    required
                                />
                                {validationErrors.address && (
                                    <p className={styles.validationMessage}>{validationErrors.address}</p>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="notes">Ghi chú (Tùy chọn)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="8"
                                />
                            </div>
                        </div>

                        {/* RIGHT: Order + Payment */}
                        <div className={styles.rightColumnGroup}>
                            <div className={`${styles.section} ${styles.orderReviewSection}`}>
                                <h3 className={styles.title}>3. Đơn hàng của bạn</h3>
                                <div className={styles.orderSummary}>
                                    {cartItems.length === 0 ? (
                                        <p className={styles.noItemsMessage}>Không có sản phẩm nào trong giỏ hàng.</p>
                                    ) : (
                                        <>
                                            <ul className={styles.itemsList}>
                                                {cartItems.map((item) => (
                                                    <li
                                                        key={`${item.productId}-${item.color}`}
                                                        className={styles.orderItem}
                                                    >
                                                        <div className={styles.itemInfo}>
                                                            <img
                                                                src={`http://localhost:5000${item.images}`}
                                                                alt={item.productName}
                                                            />
                                                            <div className={styles.itemText}>
                                                                <span className={styles.itemName}>
                                                                    {item.productName}
                                                                </span>
                                                                <span className={styles.itemQuantityColor}>
                                                                    Số lượng: {item.quantity}{" "}
                                                                    {item.color ? ` - Màu: ${item.color}` : ""}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className={styles.itemPrice}>
                                                            {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className={styles.totalRow}>
                                                <span>Tổng cộng:</span>
                                                <span className={styles.totalAmount}>
                                                    {totalAmount.toLocaleString("vi-VN")}đ
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={`${styles.section} ${styles.paymentMethodSection}`}>
                                <h3 className={styles.title}>2. Phương thức thanh toán</h3>
                                <div className={styles.paymentMethods}>
                                    {[
                                        {
                                            value: "cod",
                                            label: "Thanh toán khi nhận hàng",
                                            img: "https://st.depositphotos.com/1157537/5050/v/950/depositphotos_50500019-stock-illustration-money-icon-dollar-sign-red.jpg",
                                        },
                                        {
                                            value: "bank_transfer",
                                            label: "Thanh toán qua VNPAY",
                                            img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png",
                                        },
                                        {
                                            value: "momo",
                                            label: "Thanh toán qua MoMo",
                                            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnV4cUM7jBauINof35Yn_unOz976Iz5okV8A&s",
                                        },
                                    ].map((method) => (
                                        <label className={styles.paymentOption} key={method.value}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.value}
                                                checked={formData.paymentMethod === method.value}
                                                onChange={handleChange}
                                            />
                                            <img src={method.img} alt={method.label} className={styles.paymentIcon} />
                                            <span className={styles.paymentText}>{method.label}</span>
                                        </label>
                                    ))}

                                    {formData.paymentMethod === "momo" && (
                                        <div className={styles.qrBox}>
                                            <img src="https://qrcode-gen.com/images/qrcode-default.png" alt="QR Momo" />
                                            <p>Quét mã để thanh toán qua MoMo</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.placeOrderButton}
                                disabled={submitting || cartItems.length === 0}
                            >
                                {submitting ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </section>
    );
};

export default Checkout;
