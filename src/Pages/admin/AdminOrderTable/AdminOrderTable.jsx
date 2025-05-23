import styles from "./AdminOrderTable.module.scss";

const statusClass = {
    "Chờ xác nhận": styles.pending,
    "Đã giao hàng": styles.delivered,
    "Đã hủy": styles.cancelled,
};

function AdminOrderTable({ orders }) {
    return (
        <div className={styles.orderContainer}>
            <h2 className={styles.title}>Quản lý đơn hàng</h2>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr className={styles.tr}>
                        <th className={styles.th}>Mã đơn hàng</th>
                        <th className={styles.th}>Khách hàng</th>
                        <th className={styles.th}>Ngày đặt</th>
                        <th className={styles.th}>Tổng tiền</th>
                        <th className={styles.th}>Phương thức thanh toán</th>
                        <th className={styles.th}>Trạng thái</th>
                        <th className={styles.th}>Thao tác</th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {orders.map((order, index) => (
                        <tr key={index} className={styles.tr}>
                            <td className={styles.td}>{order.id}</td>
                            <td className={styles.td}>{order.customer}</td>
                            <td className={styles.td}>{order.date}</td>
                            <td className={styles.td}>{order.total.toLocaleString("vi-VN")} ₫</td>
                            <td className={styles.td}>{order.paymentMethod}</td>
                            <td className={styles.td}>
                                <span className={`${styles.status} ${statusClass[order.status]}`}>{order.status}</span>
                            </td>
                            <td className={styles.td}>
                                <button className={styles.viewBtn}>Xem chi tiết</button>
                                <select defaultValue={order.status} className={styles.statusSelect}>
                                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                                    <option value="Đã xác nhận">Đã xác nhận</option>
                                    <option value="Đã giao hàng">Đã giao hàng</option>
                                    <option value="Đã hủy">Đã hủy</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminOrderTable;

