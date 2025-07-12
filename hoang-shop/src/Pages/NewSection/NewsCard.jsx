import React from 'react';
import styles from './NewsSection.module.scss';

const NewsCard = ({ news }) => {
  return (
    <div className={styles.card}>
      <div className={styles.dateBox}>
        <span>{news.date}</span>
        <small>{news.month}</small>
      </div>
      <img src={news.image} alt={news.title} className={styles.image} />
      <div className={styles.content}>
        <h3>{news.title}</h3>
        <p>{news.desc}</p>
      </div>
    </div>
  );
};

export default NewsCard;
