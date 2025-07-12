import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentNews } from "@/api/newsApi";
import styles from "./NewsSidebar.module.scss";

const NewsSidebar = () => {
    const [recentNews, setRecentNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const data = await getRecentNews();
                setRecentNews(data);
            } catch (err) {
                setError("Không thể tải tin tức mới nhất.");
                console.error("Error fetching recent news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    return (
        <div className={styles.newsSidebar}>
            <h3 className={styles.sidebarTitle}>BÀI VIẾT MỚI</h3>
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className={styles.errorMessage}>{error}</p>
            ) : recentNews.length > 0 ? (
                <ul className={styles.newsList}>
                    {recentNews.map((article) => (
                        <li key={article._id} className={styles.newsItem}>
                            <div className={styles.recentPostThumbnail}>
                                <img src={article.imageUrl || "/placeholder-news.jpg"} />
                            </div>
                            <Link to={`${article.slug}`} className={styles.newsLink}>
                                {article.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có bài viết nào.</p>
            )}
        </div>
    );
};

export default NewsSidebar;
