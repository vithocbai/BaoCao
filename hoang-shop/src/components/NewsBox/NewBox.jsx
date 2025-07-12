import React, { useEffect, useState } from "react";
import styles from "./NewBox.module.scss";
import { getRecentNews } from "@/api/newsApi";
import { Link } from "react-router-dom";

function NewsBox() {
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
        <div className={styles.newsBox}>
            <div className={styles.ad}>
                <img src="/images/banner/quancao01.jpg" alt="Quảng cáo nhỏ" />
                <img src="/images/banner/quancao02.jpg" alt="Quảng cáo nhỏ" />
            </div>

            <div className={styles.news}>
                <div className={styles.titleHead}>
                    <h3>TIN CÔNG NGHỆ NỔI BẬT</h3>
                    <Link to="/tin-hay">Xem tất cả</Link>
                </div>

                {loading && <p>Đang tải tin tức...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className={styles.boxNews}>
                    {recentNews.slice(0, 2).map(
                        (item) => (
                            console.log(item),
                            (
                                <div className={styles.boxItem} key={item._id}>
                                    <img src={item.imageUrl} className={styles.boxItemImg} />
                                    <Link to={`tin-hay/${item.slug}`} className={styles.boxItemContent}>
                                        <p>{item.title}</p>
                                    </Link>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewsBox;
