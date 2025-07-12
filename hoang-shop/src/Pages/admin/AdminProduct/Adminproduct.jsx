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
import { toast } from "react-toastify";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // chứa sản phẩm đang sửa

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(7);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleChangePage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset về trang 1 khi thay đổi số lượng
    };

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
                // alert("Không xóa được sản phẩm.");
                toast.error(`Không xóa được sản phẩm.`);
                return;
            }

            setProducts(products.filter((p) => p._id !== selectedProductId));
            setShowDeleteModal(false);
            setSelectedProductId(null);
            toast.success("Sản phẩm đã được xóa thành công!");
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

            <table className={styles.tableAdmin}>
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
                    {currentProducts.map((product) => (
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
            <div className={styles.pagination}>
                <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>
                    &lt;
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleChangePage(index + 1)}
                        className={currentPage === index + 1 ? styles.activePage : ""}
                    >
                        {index + 1}
                    </button>
                ))}

                <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages}>
                    &gt;
                </button>

                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>15 / page</option>
                </select>
            </div>
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
