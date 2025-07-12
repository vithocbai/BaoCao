import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDropdown.module.scss";
import { CgProfile, CgList, CgLogOut } from "react-icons/cg";
import { useUser } from "@/context/UserContext";

const UserDropdown = ({ username }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useUser();

    const handleLogout = () => {
        logout(); // xoá dữ liệu
        window.location.href = "/login";
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.avatarBox} onClick={() => setOpen(!open)}>
                <img
                    src={`https://ui-avatars.com/api/?name=${username}&background=random`}
                    alt="avatar"
                    className={styles.avatar}
                />
                <span className={styles.name}>{username}</span>
            </div>

            {open && (
                <div className={styles.dropdown}>
                    <div className={styles.item} onClick={() => navigate("/profile")}>
                        <CgProfile className={styles.icon} /> Thông tin tài khoản
                    </div>
                    <div className={styles.item} onClick={() => navigate("/profile")}>
                        <CgList className={styles.icon} /> Đơn hàng của tôi
                    </div>
                    <div className={styles.item} onClick={handleLogout}>
                        <CgLogOut className={styles.icon} /> Đăng xuất
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
