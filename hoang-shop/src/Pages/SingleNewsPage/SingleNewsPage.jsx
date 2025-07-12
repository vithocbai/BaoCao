import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsBySlug, getAllNews } from "@/api/newsApi"; // Đảm bảo đường dẫn đúng đến API của bạn
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner"; // Đảm bảo đường dẫn đúng
import styles from "./SingleNewsPage.module.scss"; // Tạo file SCSS tương ứng
import NewsSidebar from "@components/NewsSidebar/NewsSidebar";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";

const SingleNewsPage = () => {
    const { slug } = useParams(); // Lấy slug từ URL
    const [article, setArticle] = useState(null);
    const [recentArticles, setRecentArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch chi tiết bài viết dựa trên slug
    const fetchArticle = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNewsBySlug(slug);
            setArticle(data);
        } catch (err) {
            setError("Không thể tải bài viết này. Vui lòng thử lại.");
            console.error("Error fetching single news article:", err);
            setArticle(null);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className={styles.errorMessage}>{error}</p>;
    }

    if (!article) {
        return <p className={styles.noArticleFound}>Không tìm thấy bài viết.</p>;
    }

    // Format ngày đăng
    let publishedDate = "Không xác định";
    if (article?.updatedAt && !isNaN(new Date(article.updatedAt))) {
        publishedDate = new Date(article.updatedAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }

    return (
        <section>
            <Header />
            <div
                className={styles.banner}
                style={{
                    backgroundImage: `url(${article.imageUrl})`,
                }}
            >
                <h1 className={styles.bannerTitle}>{article.title}</h1>
            </div>

            <div className={styles.singleNewsPage}>
                <div className={styles.breadcrumb}>
                    <Link to="/">TRANG CHỦ</Link> / <Link to="/tin-hay">TIN TỨC</Link> / <span>{article.title}</span>
                </div>

                <div className={styles.contentWrapper}>
                    <div className={styles.mainContent}>
                        <h1 className={styles.articleTitle}>{article.title}</h1>
                        <div className={styles.articleMeta}>
                            <span>Ngày đăng: {publishedDate}</span>
                            <span> | Lượt xem: {article.views || 0}</span>
                        </div>

                        {article.imageUrl && (
                            <div className={styles.articleImage}>
                                <img src={article.imageUrl} alt={article.title} />
                            </div>
                        )}

                        {/* Hiển thị nội dung đầy đủ từ TinyMCE */}
                        <div
                            className={styles.articleFullContent}
                            dangerouslySetInnerHTML={{ __html: article.fullContent }}
                        ></div>
                    </div>

                    <div className={styles.sidebar}>
                        <NewsSidebar />
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default SingleNewsPage;
