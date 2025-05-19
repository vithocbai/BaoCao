import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminProductDelete.module.scss";

const AdminProductDelete = ({ productId, onClose, onConfirm }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                alert("Xóa sản phẩm thành công.");
                navigate("/admin/products");
            } else {
                const data = await res.json();
                alert(`Lỗi khi xóa: ${data.error || "Không xác định"}`);
            }
        } catch (err) {
            console.error("Lỗi:", err);
            alert("Đã xảy ra lỗi khi xóa sản phẩm.");
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Bạn có chắc muốn xóa sản phẩm này không?</h3>
                <div className={styles.actions}>
                    <button className={styles.confirm} onClick={onConfirm}>
                        Xác nhận
                    </button>
                    
                    <button className={styles.cancel} onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDelete;
