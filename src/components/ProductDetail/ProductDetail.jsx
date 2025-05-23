import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@components/Header/Header";
import styles from "./ProductDetail.module.scss";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

import ColorSelector from "@components/ColorSelector/ColorSelector";
import Footer from "@components/Footer/Footer";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState("center center");
    const [isZooming, setIsZooming] = useState(false);
    const [fade, setFade] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");

    const [colorError, setColorError] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${productId}`);
                if (!res.ok) throw new Error("Không lấy được sản phẩm");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error("Lỗi:", err.message);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const changeImage = (index) => {
        setFade(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setFade(false);
        }, 200);
    };

    const nextImage = () => {
        const next = (currentIndex + 1) % (product?.images?.length || 1);
        changeImage(next);
    };

    const prevImage = () => {
        const prev = (currentIndex - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1);
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

    const handleEditorChange = (content) => {
        setForm({ ...form, description: content });
    };

    if (!product) return <p style={{ padding: 24 }}>Đang tải sản phẩm...</p>;

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
                                    src={
                                        product.images?.[currentIndex]
                                            ? `http://localhost:5000${product.images[currentIndex]}`
                                            : "/default.jpg"
                                    }
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
                            {(product.images || []).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={`http://localhost:5000${img}`}
                                    alt={`Thumbnail ${idx}`}
                                    className={`${styles.thumbnail} ${currentIndex === idx ? styles.active : ""}`}
                                    onClick={() => changeImage(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={styles.breadcrumb}>
                        <Link to="/">Trang chủ</Link>
                        <span> / </span>
                        <Link to={`/danh-muc/${product.category}`}>{product.category}</Link>
                        <span> / </span>
                        <span>{product.brand}</span>
                    </div>
                    <h1>{product.name}</h1>
                    <div className={styles.isDivider}></div>
                    <p className={styles.price}>{Number(product.price).toLocaleString()}₫</p>
                    <ul className={styles.features}>
                        <li>Thương hiệu: {product.brand}</li>
                        <li>Tồn kho: {product.stock}</li>
                        {product.specs &&
                            Object.entries(product.specs).map(([key, value], index) => (
                                <li key={index}>
                                    {key}: {value}
                                </li>
                            ))}
                    </ul>

                    {product.colors && product.colors.length > 0 && (
                        <ColorSelector
                            colors={["-- Chọn màu --", ...product.colors]}
                            selectedColor={selectedColor}
                            onSelect={(color) => {
                                setSelectedColor(color);
                                setColorError("");
                            }}
                        />
                    )}

                    <div className={styles.actions}>
                        <div className={styles.quantity}>
                            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                            <input type="text" value={quantity} readOnly />
                            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                        </div>
                        <button
                            className={styles.addToCart}
                            disabled={!selectedColor || selectedColor === "-- Chọn màu --"}
                            onClick={() => {
                                if (!selectedColor || selectedColor === "-- Chọn màu --") {
                                    setColorError("Vui lòng chọn màu hợp lệ.");
                                    return;
                                }

                                setColorError("");
                                console.log("Thêm vào giỏ:", { productId, selectedColor });
                                // TODO: xử lý thêm vào giỏ tại đây
                            }}
                        >
                            THÊM VÀO GIỎ
                        </button>
                    </div>

                    {colorError && <p className={styles.error}>{colorError}</p>}

                    {colorError && <p className={styles.error}>{colorError}</p>}
                </div>
            </div>
            <div className={styles.previewDescription}>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            <Footer />
        </section>
    );
};

export default ProductDetail;
