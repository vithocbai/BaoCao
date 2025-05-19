import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminProduct.module.scss";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminProductDelete from "@pages/admin/AdminProductDelete/AdminProductDelete";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/products");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedProductId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${selectedProductId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Lỗi xóa:", errorText);
                alert("Không xóa được sản phẩm.");
                return;
            }

            setProducts(products.filter((p) => p._id !== selectedProductId));
            setShowDeleteModal(false);
            setSelectedProductId(null);
        } catch (err) {
            console.error("Xóa lỗi:", err);
            alert("Lỗi mạng hoặc server.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2>Quản lý sản phẩm</h2>
                <Link to="/admin/products/add" className={styles.addBtn}>
                    <FaPlus /> Thêm sản phẩm
                </Link>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Danh mục</th>
                        <th>Thương hiệu</th>
                        <th>Kho</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                {/* <img
                                    src={product.images?.[0] || "/default.jpg"}
                                    alt={product.name}
                                    className={styles.image}
                                /> */}
                                <img
                                    src={`http://localhost:5000${product.images?.[0] || "/uploads/default.jpg"}`}
                                    alt={product.name}
                                    className={styles.image}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{Number(product.price).toLocaleString()}₫</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>{product.stock}</td>
                            <td>
                                <Link to={`/admin/products/edit/${product._id}`} className={styles.editBtn}>
                                    <FaEdit />
                                </Link>
                                <button onClick={() => openDeleteModal(product._id)} className={styles.deleteBtn}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDeleteModal && (
                <AdminProductDelete
                    productId={selectedProductId}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirmed}
                />
            )}
        </div>
    );
};

export default AdminProduct;
