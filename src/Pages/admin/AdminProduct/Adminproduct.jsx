import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminProduct.module.scss";
import { FaPlus } from "react-icons/fa";
import AdminProductDelete from "@pages/admin/AdminProductDelete/AdminProductDelete";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import ProductAddModal from "@pages/admin/AdminProductAdd/ProductAddModal";
// import ProductEditModal1 from "@pages/admin/AdminProductEdit/ProductEditModal1";
import ProductEditModal from "@pages/admin/AdminProductEdit/ProductEditModal";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // chứa sản phẩm đang sửa

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
        console.log("Xóa product ID:", selectedProductId);
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

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Quản lý sản phẩm</h2>
                <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                    <FaPlus /> Thêm sản phẩm
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Giá (VND)</th>
                        <th>Giảm giá (%)</th>
                        <th>Danh mục</th>
                        <th>Tồn kho</th>
                        <th>Thương hiệu</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <span className={styles.name}>{product.name}</span>
                            </td>
                            <td>{Number(product.price).toLocaleString()}₫</td>
                            <td>{product.discountPercent}%</td>
                            <td>{product.category}</td>
                            <td>{product.stock}</td>
                            <td>{product.brand}</td>
                            <td>
                                <button onClick={() => setEditingProduct(product)} className={styles.editBtn}>
                                    <AiTwotoneEdit />
                                    Sửa
                                </button>
                                <button onClick={() => openDeleteModal(product._id)} className={styles.deleteBtn}>
                                    <MdOutlineDelete />
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <ProductAddModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        fetchProducts();
                        setShowModal(false);
                    }}
                />
            )}

            {editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSuccess={fetchProducts} // hàm reload lại danh sách
                />
            )}

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
