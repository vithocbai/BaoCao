import styles from "./Profile.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");

      // Giả sử đơn hàng sẽ được gọi ở đây sau
      try {
        const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(orderRes.data);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng", err);
      }

      setUser({ username, email });
    };

    fetchData();
  }, []);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.infoBox}>
        <img src="/images/avatar-default.png" alt="avatar" />
        <div>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className={styles.orderSection}>
        <h3>Đơn hàng của bạn</h3>
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Ngày Đặt</th>
                <th>Trạng Thái</th>
                <th>Tổng Tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.total.toLocaleString()}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Profile;
