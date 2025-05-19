import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminUser.module.scss";

function AdminUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/users");
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi khi lấy users:", err);
        }
    };

    const updateRole = async (id, newRole) => {
        try {
            await axios.put(`/api/users/${id}`, { role: newRole });
            fetchUsers();
        } catch (err) {
            alert("Lỗi khi cập nhật role");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quản lý người dùng</h2>
            <p className={styles.total}>
                Tổng số: <strong>{users.length}</strong> người
            </p>

            {loading ? (
                <p className={styles.loading}>Đang tải dữ liệu...</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={user.role === "admin" ? styles.adminRole : styles.userRole}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                updateRole(user._id, user.role === "admin" ? "user" : "admin")
                                            }
                                            className={styles.btn}
                                        >
                                            {user.role === "admin" ? "Hạ quyền" : "Cấp quyền"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminUser;
