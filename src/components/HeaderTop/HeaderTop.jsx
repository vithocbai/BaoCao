import styles from "./HeaderTop.module.scss";
import { IoSearch } from "react-icons/io5";
import { BsCartCheckFill } from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import { useState } from "react";

function HeaderTop() {
    const [isOpenMenu, setIsOpenMenu] = useState(false);

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
                        <a href="#" className={styles.info}>
                            <img src="./images/tinhay.png" alt="" />
                            Tin hay
                        </a>
                        <a href="#" className={styles.info}>
                            <img src="./images/hoidap.png" alt="" />
                            Hỏi đáp
                        </a>
                        <a href="#">
                            <div style={{ margin: "auto" }}>
                                <BsCartCheckFill style={{ fontSize: "24px" }} />
                                <span className={styles["cart-count"]}>0</span>
                            </div>
                            Giỏ hàng
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderTop;
