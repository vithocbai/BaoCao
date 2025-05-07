import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumb.module.scss";
import { IoMdArrowDropdown } from "react-icons/io";

function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    const nameMap = {
        "dien-thoai": "Điện thoại",
        laptop: "Laptop",
        tablet: "Tablet",
    };

    return (
        <section className={styles.breadcrumbWrapper}>
            <div className={styles.breadcrumbContainer}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Trang chủ</Link>
                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                        const displayName = nameMap[name] || decodeURIComponent(name).replace(/-/g, " ");
                        return (
                            <span key={index}>
                                {" / "}
                                <Link to={routeTo} className={styles.localLink}>
                                    {displayName}
                                </Link>
                            </span>
                        );
                    })}
                </div>

                <div className={styles.breadcrumbRight}>
                    <span>Xem tất cả 12 kết quả</span>
                    <div className={styles.selectWrapper}>
                        <select>
                            <option>Thứ tự mặc định</option>
                            <option>Thứ tự theo mức độ phổ biến</option>
                            <option>Thứ tự theo điểm đánh giá</option>
                            <option>Thứ tự theo sản phẩm mới</option>
                            <option>Thứ tự theo giá: thấp đến cao</option>
                            <option>Thứ tự theo giá: cao xuống thấp</option>
                        </select>
                        <IoMdArrowDropdown className={styles.dropdownIcon} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Breadcrumb;
