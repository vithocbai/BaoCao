import styles from "./HeaderTop.module.scss";
import { IoSearch } from "react-icons/io5";
import { BsCartCheckFill } from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import { useState, useEffect } from "react";
import { RiLoginCircleLine } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";
import { Link } from "react-router-dom";
import { getUser } from "../../utils/auth";
import UserDropdown from "@components/UserDropdown/UserDropdown";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
function HeaderTop() {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    // const user = getUser();
    const { cartItems, removeItemFromCart } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const { user } = useUser();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setSearchResults([]);
                return;
            }

            fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(
                        data.map((p) => ({
                            id: p._id,
                            name: p.name,
                            image: p.images[0], // lấy ảnh đầu tiên
                            price: p.price,
                            discountPrice: p.discountPrice,
                        }))
                    );
                })
                .catch((err) => {
                    console.error("Lỗi tìm kiếm:", err);
                    setSearchResults([]);
                });
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <div className={styles.headerTop}>
            <div>
                <div className={styles.container}>
                    {/* Menu mobile */}
                    <div className={styles.menuMobile}>
                        <IoMenu
                            style={{ fontSize: "32px", color: "#fff" }}
                            onClick={() => {
                                setIsOpenMenu(true);
                            }}
                        />
                    </div>

                    <MobileMenu isOpen={isOpenMenu} onClose={() => setIsOpenMenu(false)} />

                    <div className={styles.left}>
                        <a href="/" className={styles.logo}>
                            <img src="/logo/logo.png" alt="" />
                        </a>
                        <div className={styles.search}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Nhập tên điện thoại, máy tính, phụ kiện...cần tìm"
                            />
                            <button className={styles.searchButton}>
                                <IoSearch />
                            </button>

                            {searchResults.length > 0 &&
                                (console.log(searchResults),
                                (
                                    <div className={styles.searchDropdown}>
                                        {searchResults.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={`/product/${item.id}`}
                                                className={styles.searchResultItem}
                                            >
                                                <img src={`http://localhost:5000${item.image}`} />
                                                <div>
                                                    <p>{item.name}</p>
                                                    <p className={styles.price}>
                                                        {/* {item.discountPrice?.toLocaleString() || */}
                                                        {item.price.toLocaleString()} ₫
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className={styles.right}>
                        {!user ? (
                            <>
                                <Link to="/login" className={styles.info}>
                                    <RiLoginCircleLine style={{ fontSize: "30px" }} />
                                    Đăng Nhập
                                </Link>
                                <Link to="/register" className={styles.info}>
                                    <GiArchiveRegister style={{ fontSize: "30px" }} />
                                    Đăng Ký
                                </Link>
                            </>
                        ) : (
                            <div className={styles.userBox}>
                                <UserDropdown username={user.username} />
                            </div>
                        )}

                        <Link to="/tin-hay" className={styles.info}>
                            <img src="/images/tinhay.png" alt="" />
                            Tin tức
                        </Link>

                        <div className={styles.cartWrapper}>
                            <Link to="/cart" className={styles.info}>
                                <div style={{ margin: "auto", position: "relative" }}>
                                    <BsCartCheckFill style={{ fontSize: "24px" }} />
                                    <span className={styles["cart-count"]}>{cartItems.length}</span>
                                </div>
                                Giỏ hàng
                            </Link>

                            <div className={styles.cartPreview}>
                                {cartItems.length > 0 ? (
                                    <>
                                        <div className={styles.cartItems}>
                                            {cartItems.map((item, id) => (
                                                <div key={id} className={styles.cartItem}>
                                                    <img src={`http://localhost:5000${item.images}`} />
                                                    <div>
                                                        <p className={styles.productName}>{item.productName}</p>
                                                        <p>
                                                            {item.quantity}{" "}
                                                            <span className={styles.timesSymbol}>&times;</span>{" "}
                                                            {item.price.toLocaleString()} ₫
                                                        </p>
                                                    </div>
                                                    <button
                                                        className={styles.removeItemButton}
                                                        onClick={() => removeItemFromCart(item.productId, item.color)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.total}>
                                            Tổng cộng:{" "}
                                            <span>
                                                {cartItems
                                                    .reduce((sum, i) => sum + i.quantity * i.price, 0)
                                                    .toLocaleString()}{" "}
                                                ₫
                                            </span>
                                        </div>
                                        <div className={styles.cartActions}>
                                            <Link to="/cart" className={styles.viewCart}>
                                                XEM GIỎ HÀNG
                                            </Link>
                                            <Link to="/checkout" className={styles.checkout}>
                                                THANH TOÁN
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <p className={styles.emptyCartMessage}>Giỏ hàng trống</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderTop;
