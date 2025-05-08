import React, { useState } from "react";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import styles from "./ProductDetail.module.scss";
import ProductCategories from "@components/ProductCategories/ProductCategories";
import { Link } from "react-router-dom";
import product1 from "/images/mobileProduct/img01.jpg";
import product2 from "/images/mobileProduct/img02.jpg";
import product3 from "/images/mobileProduct/img03.jpg";
import product4 from "/images/mobileProduct/img04.jpg";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import ProductDescription from "@components/ProductDescription/ProductDescription";
import ProductFullDescription from "../ProductFullDescription/ProductFullDescription";
import ColorSelector from "@components/ColorSelector/ColorSelector";

const ProductDetail = () => {
    const images = [product1, product2, product3, product4];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState("center center");
    const [isZooming, setIsZooming] = useState(false);
    const [fade, setFade] = useState(false);

    const changeImage = (index) => {
        setFade(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setFade(false);
        }, 200); // thời gian khớp với CSS
    };

    const nextImage = () => {
        const next = (currentIndex + 1) % images.length;
        changeImage(next);
    };

    const prevImage = () => {
        const prev = (currentIndex - 1 + images.length) % images.length;
        changeImage(prev);
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomOrigin(`${x}% ${y}%`);
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const thumbnails = [
        "/images/mobileProduct/img01.jpg",
        "/images/mobileProduct/img02.jpg",
        "/images/mobileProduct/img03.jpg",
    ];

    const mockColors = ["Đen", "Trắng", "Xanh", "Đỏ"];
    const [selectedColor, setSelectedColor] = useState("");

    return (
        <section>
            <Header />
            <div className={styles.productDetail}>
                <div className={styles.left}>
                    <div className={styles.gallery}>
                        <div className={styles.mainImageWrapper}>
                            <div className={styles.imageContainer}>
                                <img
                                    key={currentIndex}
                                    src={images[currentIndex]}
                                    alt="Product"
                                    className={`${styles.mainImage} ${fade ? styles.fade : ""}`}
                                    style={isZooming ? { transform: "scale(2)", transformOrigin: zoomOrigin } : {}}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                />
                                <button className={styles.prev} onClick={prevImage}>
                                    <GrFormPrevious />
                                </button>
                                <button className={styles.next} onClick={nextImage}>
                                    <MdNavigateNext />
                                </button>
                            </div>
                        </div>

                        <div className={styles.thumbnails}>
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx}`}
                                    className={`${styles.thumbnail} ${currentIndex === idx ? styles.active : ""}`}
                                    onClick={() => changeImage(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.right}>
                    {/* Breadcrumb */}
                    <div className={styles.breadcrumb}>
                        <Link to="/">Trang chủ</Link>
                        <span> / </span>
                        <Link to="/dien-thoai">Điện thoại</Link>
                        <span> / </span>
                        <span>BlackBerry KEYone</span>
                    </div>

                    {/* Info Product */}
                    <h1>Điện Thoại BlackBerry KEYone – Hàng Chính Hãng</h1>
                    <div className={styles.isDivider}></div>
                    <p className={styles.price}>14,990,000 ₫</p>
                    <ul className={styles.features}>
                        <li>Chính hãng, Nguyên seal, Mới 100%</li>
                        <li>Miễn phí giao hàng toàn quốc</li>
                        <li>Thiết kế: Nguyên khối</li>
                        <li>Màn hình 4.5 inch, độ phân giải 1620x1080 pixels</li>
                        <li>Camera Trước/Sau: 8MP/12MP</li>
                        <li>CPU: Snapdragon 625 Octa-Core 2.0 GHz</li>
                        <li>Bộ nhớ: 32GB </li>
                        <li>RAM: 3GB</li>
                    </ul>

                    {/* Select Color */}
                    <ColorSelector colors={mockColors} selectedColor={selectedColor} onSelect={setSelectedColor} />
                    {/* Action */}
                    <div className={styles.actions}>
                        <div className={styles.quantity}>
                            <button>-</button>
                            <input type="text" value="1" readOnly />
                            <button>+</button>
                        </div>
                        <button className={styles.addToCart}>THÊM VÀO GIỎ</button>
                    </div>
                </div>
            </div>
            <ProductDescription />
            <ProductFullDescription />
            <ProductCategories />
            <Footer />
        </section>
    );
};

export default ProductDetail;


  