import styles from "./HeaderTop.module.scss";
import { IoSearch } from "react-icons/io5";
import { BsCartCheckFill } from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import { useState } from "react";
import { RiLoginCircleLine } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";
import { Link } from "react-router-dom";
import { getUser } from "../../utils/auth";
import UserDropdown from "@components/UserDropdown/UserDropdown";

function HeaderTop() {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const user = getUser();

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
                            <img src="./logo/logo.png" alt="" />
                        </a>
                        <div className={styles.search}>
                            <input type="text" placeholder="Nhập tên điện thoại, máy tính, phụ kiện...cần tìm" />
                            <button>
                                <IoSearch />
                            </button>
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

                        <a href="#" className={styles.info}>
                            <img src="./images/tinhay.png" alt="" />
                            Tin hay
                        </a>

                        <Link to="/cart" className={styles.info}>
                            <div style={{ margin: "auto" }}>
                                <BsCartCheckFill style={{ fontSize: "24px" }} />
                                <span className={styles["cart-count"]}>0</span>
                            </div>
                            Giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderTop;
