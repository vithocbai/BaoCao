import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDropdown.module.scss";

const UserDropdown = ({ username }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
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
            Tài khoản của tôi
          </div>
          <div className={styles.item} onClick={handleLogout}>
            Đăng xuất
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
