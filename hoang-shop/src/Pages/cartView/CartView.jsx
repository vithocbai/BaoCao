import React, { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./cartView.module.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";

const CartView = () => {
    const { cartItems, loading, removeItemFromCart, updateItemQuantity } = useCart();
    const navigate = useNavigate();

    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    if (loading) {
        return (
            <div className={styles.cartViewContainer}>
                <div className={styles.loadingMessage}>Đang tải giỏ hàng...</div>
            </div>
        );
    }

    const handleQuantityChange = (productId, color, newQuantity) => {
        if (newQuantity < 1) {
            if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
                removeItemFromCart(productId, color);
                toast.info("Đã xóa sản phẩm khỏi giỏ hàng!");
            }
        } else {
            updateItemQuantity(productId, color, newQuantity);
        }
    };

    const handleGoToCheckout = () => {
        if (cartItems.length > 0) {
            navigate("/checkout");
        } else {
            toast.error("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.");
        }
    };

    return (
        <section>
            <Header />
            <div className={styles.cartViewContainer}>
                <h2 className={styles.pageHeader}>Giỏ hàng của bạn</h2>

                {cartItems.length === 0 ? (
                    <div className={styles.emptyCartMessage}>
                        <p>Giỏ hàng của bạn đang trống.</p>
                        <p>Hãy tiếp tục mua sắm để thêm sản phẩm vào giỏ!</p>
                        <button onClick={() => navigate("/")} className={styles.continueShoppingEmptyCartButton}>
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className={styles.cartContent}>
                        {/* Left Panel: Cart Items */}
                        <div className={styles.cartItemsSection}>
                            <p className={styles.itemCount}>{cartItems.length} sản phẩm trong giỏ hàng</p>
                            {cartItems.map((item) => (
                                <div key={`${item.productId}-${item.color}`} className={styles.cartItem}>
                                    <img
                                        src={`http://localhost:5000${item.images}`}
                                        alt={item.productName}
                                        className={styles.itemImage}
                                    />
                                    <div className={styles.itemDetails}>
                                        <h3 className={styles.itemName}>{item.productName}</h3>
                                        <p className={styles.itemPriceOriginal}>
                                            {(item.price * 1.1).toLocaleString("vi-VN")}đ
                                        </p>
                                        <p className={styles.itemPriceCurrent}>{item.price.toLocaleString("vi-VN")}đ</p>
                                        <div className={styles.quantityControl}>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(item.productId, item.color, item.quantity - 1)
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="text"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const newQty = value === "" ? "" : parseInt(value, 10);
                                                    if (newQty === "" || (!isNaN(newQty) && newQty >= 0)) {
                                                        handleQuantityChange(item.productId, item.color, newQty);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const newQty = parseInt(e.target.value, 10);
                                                    if (isNaN(newQty) || newQty < 1) {
                                                        handleQuantityChange(item.productId, item.color, 1);
                                                    }
                                                }}
                                                min="1"
                                                className={styles.quantityInput}
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(item.productId, item.color, item.quantity + 1)
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <span className={styles.itemTotalPrice}>
                                            {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                        </span>
                                        <button
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                                                    )
                                                ) {
                                                    removeItemFromCart(item.productId, item.color);
                                                    toast.info("Đã xóa sản phẩm khỏi giỏ hàng!");
                                                }
                                            }}
                                            className={styles.removeItemButton}
                                            aria-label={`Remove ${item.productName} from cart`}
                                        >
                                            &times; {/* <--- Changed from 'X' to &times; */}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Panel: Order Summary & Commitments */}
                        <div className={styles.orderSummarySection}>
                            <h3 className={styles.orderSummaryHeader}>Thông tin đơn hàng</h3>
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Tổng tiền:</span>
                                <span className={styles.totalAmount}>{subtotal.toLocaleString("vi-VN")}đ</span>
                            </div>
                            <button
                                onClick={handleGoToCheckout}
                                className={styles.checkoutButton}
                                disabled={cartItems.length === 0}
                            >
                                THANH TOÁN
                            </button>
                            <button onClick={() => navigate("/")} className={styles.continueShoppingLink}>
                                Tiếp tục mua hàng
                            </button>

                            <div className={styles.commitments}>
                                <div className={styles.commitmentItem}>
                                    <span className={styles.commitmentIcon}>✓</span>
                                    <p>
                                        Bảo vệ sản phẩm toàn diện với dịch vụ bảo hành mở rộng Xem chi tiết (Khách hàng
                                        đăng ký thông tin để được hỗ trợ tư vấn và thanh toán tại cửa hàng nhanh nhất,
                                        số tiền phải thanh toán chưa bao gồm giá trị của gói bảo hành mở rộng)
                                    </p>
                                </div>
                                <div className={styles.commitmentItem}>
                                    <span className={styles.commitmentIcon}>✓</span>
                                    <p>
                                        Không rủi ro. Đặt hàng trước, thanh toán sau tại nhà. Miễn phí giao hàng & lắp
                                        đặt tại tất cả quận huyện thuộc TP.HCM, Hà Nội, Khu đô thị Ecopark, Biên Hòa và
                                        một số khu vực thuộc Bình Dương (*)
                                    </p>
                                </div>
                                <div className={styles.commitmentItem}>
                                    <span className={styles.commitmentIcon}>✓</span>
                                    <p>
                                        Đơn hàng của quý khách sẽ được giao hàng trong vòng 3 ngày, vui lòng đợi nhân
                                        viên tư vấn xác nhận lịch giao hàng trước khi thực hiện chuyển khoản đơn hàng
                                    </p>
                                </div>
                                <div className={styles.commitmentItem}>
                                    <span className={styles.commitmentIcon}>✓</span>
                                    <p>Miễn phí 1 đổi 1 - Bảo hành 2 năm - Bảo trì trọn đời (**)</p>
                                </div>

                                <div className={styles.commitmentItem}>
                                    <span className={styles.commitmentIcon}>✓</span>
                                    <p>Chất lượng Quốc Tế đảm bảo theo tiêu chuẩn cho người dùng tại Việt Nam</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </section>
    );
};

export default CartView;
