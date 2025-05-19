import React from 'react';
import styles from './NewsSection.module.scss';
import NewsCard from './NewsCard';

const newsList = [
  {
    id: 1,
    date: '07',
    month: 'Th12',
    title: 'Trọn bộ hình nền Huawei Mate 10 đẹp “miễn chê” cho mọi smartphone',
    desc: 'Bộ hình nền siêu đẹp từ Huawei Mate 10 đến với nhiều chủ đề ưa thích.',
    image: '/images/news1.jpg',
  },
  {
    id: 2,
    date: '07',
    month: 'Th12',
    title: 'Rò rỉ thông tin Nokia 6 (2018): Màn hình tràn viền, tỉ lệ 18:9, Snapdragon 6XX, RAM 4GB',
    desc: 'Thông tin từ Trung Quốc cho biết Nokia sẽ trở lại mạnh mẽ.',
    image: '/images/news2.jpg',
  },
  {
    id: 3,
    date: '07',
    month: 'Th12',
    title: 'Meizu Note 8 bất ngờ xuất hiện trong diện mạo đẹp hoàn hảo',
    desc: 'Thiết kế mới của Meizu Note 8 mang đến cảm giác hiện đại.',
    image: '/images/news3.jpg',
  },
  {
    id: 4,
    date: '07',
    month: 'Th12',
    title: 'Tại sao nên mua “phiên bản thu nhỏ” Asus Zenfone 4 Max?',
    desc: 'Dù nhỏ nhưng vẫn mạnh mẽ và tối ưu hiệu năng cho người dùng phổ thông.',
    image: '/images/news4.jpg',
  },
];

const NewsSection = () => {
  return (
    <section className={styles.newsSection}>
      <h2 className={styles.title}>Tin tức</h2>
      <div className={styles.grid}>
        {newsList.map(news => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
