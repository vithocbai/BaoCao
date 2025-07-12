import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminProductDelete.module.scss";

const AdminProductDelete = ({ productId, onClose, onConfirm }) => {
    const navigate = useNavigate();

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
