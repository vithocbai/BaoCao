import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import AccountSidebar from "@components/AccountSidebar/AccountSidebar";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import { getUser } from "../../utils/auth";
import {CgCheck, CgClose, CgCamera } from "react-icons/cg";
import UserOrderList from "@pages/UserOrderList/UserOrderList"; 

const Profile = () => {
    const [activeTab, setActiveTab] = useState("info");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", role: "" });

    const user = getUser(); 

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                role: user.role,
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        if (avatarFile) {
            formDataToSend.append("avatar", avatarFile);
        }

        try {
            const userId = user._id; // đảm bảo user._id tồn tại
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: "PUT",
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Cập nhật thất bại!");
            }

            const updatedUser = await response.json();
            console.log("Cập nhật thành công:", updatedUser);
            // Cập nhật thông tin user trong localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            window.location.reload(); // load lại để phản ánh thay đổi
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi cập nhật: " + err.message);
        }
    };

    const [previewImage, setPreviewImage] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const renderContent = () => {
        if (!user) return <div className={styles.content}>Đang tải...</div>;

        if (activeTab === "info") {
            return (
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h2>Thông tin cá nhân</h2>
                        <button className={styles.editBtn} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Hủy" : "Chỉnh sửa"}
                        </button>
                    </div>

                    {!isEditing ? (
                        <div className={styles.body}>
                            <div className={styles.avatarDisplay}>
                                <img
                                    src={user.avatar ? `http://localhost:5000${user.avatar}` : "/default-avatar.png"}
                                    alt="Avatar"
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.info}>
                                <p>
                                    <strong>Họ tên:</strong> {user.username}
                                </p>
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p>
                                    <strong>Vai trò:</strong> {user.role}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.body}>
                            <div className={styles.formWrapper}>
                                <div className={styles.avatarWrapper}>
                                    <label htmlFor="avatarInput">
                                        <img
                                            src={
                                                previewImage ||
                                                (user.avatar
                                                    ? `http://localhost:5000${user.avatar}`
                                                    : "/default-avatar.png")
                                            }
                                            alt="Avatar"
                                            className={styles.avatar}
                                        />
                                        {/* Overlay for editing avatar */}
                                        <div className={styles.avatarOverlay}>
                                            <CgCamera className={styles.cameraIcon} />
                                            <span>Đổi ảnh</span>
                                        </div>
                                    </label>
                                    <input
                                        id="avatarInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: "none" }}
                                    />
                                </div>

                                <div className={styles.form}>
                                    <label>
                                        Họ tên:
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Role:
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            disabled 
                                        />
                                    </label>
                                    <div className={styles.buttonGroup}>
                                        <button className={styles.saveBtn} onClick={handleSave}>
                                            <CgCheck className={styles.buttonIcon} /> Lưu
                                        </button>
                                        <button
                                            className={styles.cancelBtn}
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Đặt lại formData về giá trị ban đầu của user khi hủy
                                                setFormData({
                                                    username: user.username,
                                                    email: user.email,
                                                    role: user.role,
                                                });
                                                setPreviewImage(null); // Xóa ảnh preview nếu có
                                                setAvatarFile(null); // Xóa file avatar đã chọn
                                            }}
                                        >
                                            <CgClose className={styles.buttonIcon} /> Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === "orders") {
            return (
                <div className={styles.content}>
                    <UserOrderList /> {/* Hiển thị component danh sách đơn hàng */}
                </div>
            );
        }

        if (activeTab === "logout") {
            localStorage.removeItem("user");
            window.location.href = "/login";
            return null;
        }

        return null;
    };

    return (
        <section>
            <Header />
            <div className={styles.container}>
                <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className={styles.main}>{renderContent()}</div>
            </div>
            <Footer />
        </section>
    );
};

export default Profile;
