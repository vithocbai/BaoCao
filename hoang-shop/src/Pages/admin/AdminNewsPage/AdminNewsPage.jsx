// frontend/src/pages/AdminNewsPage/AdminNewsPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { getAllNews, createNewsArticle, updateNewsArticle, deleteNewsArticle } from "@/api/newsApi";
import AdminNewsItem from "@pages/admin/AdminNewsItem/AdminNewsItem";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import styles from "./AdminNewsPage.module.scss";
import { FaPlus } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import NewsFormModal from "@components/NewsFormModal/NewsFormModal.jsx";

function AdminNewsPage() {
    const [newsArticles, setNewsArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);

    const [formError, setFormError] = useState(null);
    const [formLoading, setFormFromLoading] = useState(false);

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage, setArticlesPerPage] = useState(3);
    const [totalPages, setTotalPages] = useState(1);
    const [totalArticles, setTotalArticles] = useState(0);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllNews({ page: currentPage, limit: articlesPerPage });
            setNewsArticles(data.articles);
            setTotalPages(data.totalPages);
            setTotalArticles(data.totalArticles);
        } catch (err) {
            setError("Không thể tải danh sách tin tức. Vui lòng thử lại.");
            console.error("Error fetching news for admin:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, articlesPerPage]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleOpenAddModal = () => {
        console.log("Mở modal thêm mới");
        setEditingArticle(null);
        setIsModalOpen(true);
        setFormError(null);
    };

    const handleOpenEditModal = (article) => {
        setEditingArticle(article);
        setIsModalOpen(true);
        setFormError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingArticle(null);
        setFormError(null);
    };

    const handleModalSubmit = async (formData) => {
        setFormFromLoading(true); // Dùng biến mới
        setFormError(null);

        const dummyToken = "your-dummy-admin-token";

        try {
            const articleData = {
                title: formData.title,
                shortDescription: formData.shortDescription,
                fullContent: formData.fullContent,
                imageUrl: formData.imageUrl,
            };

            if (formData._id) {
                await updateNewsArticle(formData._id, articleData, dummyToken);
                toast.success("Cập nhật tin tức thành công!");
            } else {
                await createNewsArticle(articleData, dummyToken);
                toast.success("Thêm tin tức thành công!");
            }
            handleCloseModal();
            setCurrentPage(1); // Quay về trang đầu tiên sau khi thêm/sửa thành công
            fetchNews();
        } catch (err) {
            console.error("Error submitting news form:", err);
            setFormError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            toast.error(err.response?.data?.message || "Có lỗi xảy ra khi xử lý tin tức.");
        } finally {
            setFormFromLoading(false); // Dùng biến mới
        }
    };

    const handleDeleteNews = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            const dummyToken = "your-dummy-admin-token";
            try {
                await deleteNewsArticle(id, dummyToken);
                toast.success("Xóa tin tức thành công!");
                if (newsArticles.length === 1 && currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                } else {
                    fetchNews();
                }
            } catch (err) {
                console.error("Error deleting news:", err);
                toast.error(err.response?.data?.message || "Có lỗi xảy ra khi xóa tin tức.");
            }
        }
    };

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

 
    const handleArticlesPerPageChange = (e) => {
        setArticlesPerPage(parseInt(e.target.value));
        setCurrentPage(1); 
    };

    // Tạo mảng các số trang để render nút
    const renderPaginationButtons = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Điều chỉnh lại startPage nếu endPage không đủ maxPagesToShow
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${styles.paginationButton} ${i === currentPage ? styles.active : ""}`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className={styles.adminNewsPage}>
            <h1 className={styles.pageTitle}>Quản lý Tin tức</h1>

            <button onClick={handleOpenAddModal} className={styles.addNewsButton}>
                <FaPlus /> Thêm Tin Tức Mới
            </button>

            {/* Sử dụng NewsFormModal đã được import */}
            <NewsFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                articleToEdit={editingArticle}
                error={formError}
            />

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p className={styles.errorMessage}>{error}</p>
            ) : newsArticles.length > 0 ? (
                <div className={styles.newsTableContainer}>
                    <table className={styles.newsTable}>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tiêu đề & Slug</th>
                                <th>Mô tả ngắn</th>
                                <th>Ngày đăng</th>
                                <th>Lượt xem</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsArticles.map((article) => (
                                <AdminNewsItem
                                    key={article._id}
                                    article={article}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDeleteNews}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination controls theo demo */}
                    {totalPages > 0 && (
                        <div className={styles.paginationFooter}>
                            <div className={styles.itemsPerPage}>
                                <select
                                    className={styles.selectValue}
                                    value={articlesPerPage}
                                    onChange={handleArticlesPerPageChange}
                                >
                                    <option value={2}>3 / page</option>
                                    <option value={6}>6 / page</option>
                                    <option value={10}>10 / page</option>
                                </select>
                            </div>
                            <div className={styles.paginationControls}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={styles.paginationButton}
                                >
                                    &lt;
                                </button>
                                {renderPaginationButtons()}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={styles.paginationButton}
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className={styles.noNewsMessage}>Chưa có bài viết tin tức nào.</p>
            )}
        </div>
    );
}

export default AdminNewsPage;
