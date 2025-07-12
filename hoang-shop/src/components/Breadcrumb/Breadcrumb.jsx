import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useEffect
import styles from "./Breadcrumb.module.scss";
import { IoMdArrowDropdown } from "react-icons/io";

// Component Breadcrumb giờ đây nhận một prop `onSortChange`
function Breadcrumb({ onSortChange }) {
    const location = useLocation();
    const navigate = useNavigate();
    const pathnames = location.pathname.split("/").filter((x) => x);

    const nameMap = {
        "dien-thoai": "Điện thoại",
        laptop: "Laptop",
        tablet: "Tablet",
        // Thêm các ánh xạ khác nếu cần
    };

    // Lấy giá trị sort ban đầu từ URL
    const initialSortOrder = new URLSearchParams(location.search).get("sort") || "default";
    const [sortOrder, setSortOrder] = useState(initialSortOrder);

    // Cập nhật sortOrder khi URL thay đổi (ví dụ: khi người dùng điều hướng qua lại)
    useEffect(() => {
        const currentSort = new URLSearchParams(location.search).get("sort") || "default";
        if (currentSort !== sortOrder) {
            setSortOrder(currentSort);
        }
    }, [location.search]);

    const handleSortChange = (e) => {
        const selectedSort = e.target.value;
        setSortOrder(selectedSort); // Cập nhật state nội bộ của Breadcrumb

        // Cập nhật URL query string
        const params = new URLSearchParams(location.search);
        if (selectedSort === "default") {
            params.delete("sort"); // Xóa tham số sort nếu là default
        } else {
            params.set("sort", selectedSort);
        }
        navigate(`${location.pathname}?${params.toString()}`);

        // GỌI HÀM CALLBACK để thông báo cho component cha
        if (onSortChange) {
            onSortChange(selectedSort);
        }
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
                    {/* Bạn có thể truyền tổng số kết quả từ component cha xuống */}
                    <span>Xem tất cả sắp xếp</span>
                    <div className={styles.selectWrapper}>
                        <select value={sortOrder} onChange={handleSortChange}>
                            <option value="default">Thứ tự mặc định</option>
                            <option value="new">Thứ tự theo sản phẩm mới</option>
                            <option value="price-asc">Thứ tự theo giá: thấp đến cao</option>
                            <option value="price-desc">Thứ tự theo giá: cao xuống thấp</option>
                        </select>
                        <IoMdArrowDropdown className={styles.dropdownIcon} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Breadcrumb;
