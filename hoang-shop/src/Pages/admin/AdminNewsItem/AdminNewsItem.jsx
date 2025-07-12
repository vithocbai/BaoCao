// frontend/src/components/AdminNewsItem/AdminNewsItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminNewsItem.module.scss";
import moment from "moment";

// Import icons từ react-icons (ví dụ: Font Awesome)
import { FaEdit, FaTrash } from "react-icons/fa"; // Fa cho Font Awesome

const AdminNewsItem = ({ article, onEdit, onDelete }) => {
    return (
        <tr className={styles.adminNewsItem}>
            <td>
                <img src={article.imageUrl} alt={article.title} className={styles.thumbnail} />
            </td>
            <td>
                <Link to={`/news/${article.slug}`} className={styles.titleLink}>
                    <h4 className={styles.title}>{article.title}</h4>
                </Link>
                <p className={styles.slug}>Slug: {article.slug}</p>
            </td>
            <td>
                <p className={styles.description}>{article.shortDescription}</p>
            </td>
            <td>{moment(article.publishedAt).format("DD/MM/YYYY HH:mm")}</td>
            <td>{article.views || 0}</td>
            <td className={styles.actions}>
                <button
                    onClick={() => onEdit(article)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                    title="Sửa bài viết"
                >
                    <FaEdit /> {/* Sử dụng component icon */}
                </button>
                <button
                    onClick={() => onDelete(article._id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Xóa bài viết"
                >
                    <FaTrash /> {/* Sử dụng component icon */}
                </button>
            </td>
        </tr>
    );
};

export default AdminNewsItem;
