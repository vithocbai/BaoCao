import React from "react";
import { Link } from "react-router-dom"; // Giả sử bạn dùng react-router-dom
import styles from "./NewsCard.module.scss";
import moment from "moment"; // Để định dạng ngày tháng

const NewsCard = ({ article }) => {
    if (!article) return null;

    return (
        <Link to={`${article.slug}`} className={styles.newsCard}>
            <div className={styles.imageWrapper}>
                <img src={article.imageUrl} alt={article.title} className={styles.newsImage} />
                <div className={styles.dateOverlay}>
                    <span className={styles.day}>{moment(article.publishedAt).format("DD")}</span>
                    <span className={styles.monthYear}>
                        {moment(article.publishedAt).format("MMM YYYY").toUpperCase()}
                    </span>
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{article.title}</h3>
                <p className={styles.description}>{article.shortDescription}</p>
            </div>
        </Link>
    );
};

export default NewsCard;
