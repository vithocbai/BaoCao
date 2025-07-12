import React, { useEffect, useState, useCallback } from "react";
import { getAllNews } from "@/api/newsApi";
import NewsCard from "@/components/NewsCard/NewsCard";
import NewsSidebar from "@/components/NewsSidebar/NewsSidebar";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import styles from "./NewsPage.module.scss";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";

function NewsPage() {
    const [newsArticles, setNewsArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("new");

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: currentPage,
                limit: 9,
                search: searchQuery,
                sort: sortOrder,
            };
            console.log("Fetching news with params:", params);
            const data = await getAllNews(params);
            setNewsArticles(data.articles);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError("Không thể tải tin tức. Vui lòng thử lại.");
            console.error("Error fetching news:", err);
            setNewsArticles([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, sortOrder]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        setCurrentPage(1);
    };

    return (
        <section>
            <Header />
            <div className={styles.newsPage}>
                <h1 className={styles.pageTitle}>TIN TỨC</h1>
                <div className={styles.newsContainer}>
                    <div className={styles.mainContent}>
                        <div className={styles.controls}>
                            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề tin tức..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.searchInput}
                                />
                                <button type="submit" className={styles.searchButton}>
                                    <i className="fas fa-search"></i> Tìm kiếm
                                </button>
                            </form>
                            <div className={styles.sortSelect}>
                                <label htmlFor="sortOrder">Sắp xếp theo:</label>
                                <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
                                    <option value="new">Mới nhất</option>
                                    <option value="old">Cũ nhất</option>
                                    <option value="views">Lượt xem</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className={styles.newsGridSkeleton}>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className={styles.skeletonCard}></div>
                                ))}
                            </div>
                        ) : error ? (
                            <p className={styles.errorMessage}>{error}</p>
                        ) : newsArticles.length > 0 ? (
                            <div className={styles.newsGrid}>
                                {newsArticles.map((article) => (
                                    <NewsCard key={article._id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noNewsMessage}>Không có bài viết tin tức nào phù hợp.</p>
                        )}

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`${styles.pageButton} ${
                                            currentPage === pageNumber ? styles.active : ""
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.sidebar}>
                        <NewsSidebar />
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
}

export default NewsPage;
