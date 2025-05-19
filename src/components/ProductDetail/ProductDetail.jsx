// import React, { useState } from "react";
// import Header from "@components/Header/Header";
// import Footer from "@components/Footer/Footer";
// import styles from "./ProductDetail.module.scss";
// import ProductCategories from "@components/ProductCategories/ProductCategories";
// import { Link } from "react-router-dom";
// import { MdNavigateNext } from "react-icons/md";
// import { GrFormPrevious } from "react-icons/gr";
// import ProductDescription from "@components/ProductDescription/ProductDescription";
// import ProductFullDescription from "../ProductFullDescription/ProductFullDescription";
// import ColorSelector from "@components/ColorSelector/ColorSelector";

// // ✅ Sử dụng ảnh như đã định nghĩa trong <Product />
// const images = ["/images/mobileProduct/img05.jpg", "/images/mobileProduct/img05.5.jpg"];

// // ✅ Thông tin sản phẩm lấy từ dữ liệu đã cho
// const productInfo = {
//     name: "Điện Thoại BlackBerry KEYone – Hàng Chính Hãng",
//     price: "14,990,000đ",
//     features: [
//         "Chính hãng, Nguyên seal, Mới 100%",
//         "Miễn phí giao hàng toàn quốc",
//         "Thiết kế: Nguyên khối",
//         "Màn hình 4.5 inch, độ phân giải 1620x1080 pixels",
//         "Camera Trước/Sau: 8MP/12MP",
//         "CPU: Snapdragon 625 Octa-Core 2.0 GHz",
//         "Bộ nhớ: 32GB",
//         "RAM: 3GB",
//     ],
// };

// const ProductDetail = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [zoomOrigin, setZoomOrigin] = useState("center center");
//     const [isZooming, setIsZooming] = useState(false);
//     const [fade, setFade] = useState(false);

//     const changeImage = (index) => {
//         setFade(true);
//         setTimeout(() => {
//             setCurrentIndex(index);
//             setFade(false);
//         }, 200);
//     };

//     const nextImage = () => {
//         const next = (currentIndex + 1) % images.length;
//         changeImage(next);
//     };

//     const prevImage = () => {
//         const prev = (currentIndex - 1 + images.length) % images.length;
//         changeImage(prev);
//     };

//     const handleMouseMove = (e) => {
//         const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
//         const x = ((e.clientX - left) / width) * 100;
//         const y = ((e.clientY - top) / height) * 100;
//         setZoomOrigin(`${x}% ${y}%`);
//         setIsZooming(true);
//     };

//     const handleMouseLeave = () => {
//         setIsZooming(false);
//     };

//     const mockColors = ["Đen", "Trắng", "Xanh", "Đỏ"];
//     const [selectedColor, setSelectedColor] = useState("");

//     return (
//         <section>
//             <Header />
//             <div className={styles.productDetail}>
//                 <div className={styles.left}>
//                     <div className={styles.gallery}>
//                         <div className={styles.mainImageWrapper}>
//                             <div className={styles.imageContainer}>
//                                 <img
//                                     key={currentIndex}
//                                     src={images[currentIndex]}
//                                     alt="Product"
//                                     className={`${styles.mainImage} ${fade ? styles.fade : ""}`}
//                                     style={isZooming ? { transform: "scale(2)", transformOrigin: zoomOrigin } : {}}
//                                     onMouseMove={handleMouseMove}
//                                     onMouseLeave={handleMouseLeave}
//                                 />
//                                 <button className={styles.prev} onClick={prevImage}>
//                                     <GrFormPrevious />
//                                 </button>
//                                 <button className={styles.next} onClick={nextImage}>
//                                     <MdNavigateNext />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className={styles.thumbnails}>
//                             {images.map((img, idx) => (
//                                 <img
//                                     key={idx}
//                                     src={img}
//                                     alt={`Thumbnail ${idx}`}
//                                     className={`${styles.thumbnail} ${currentIndex === idx ? styles.active : ""}`}
//                                     onClick={() => changeImage(idx)}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className={styles.right}>
//                     <div className={styles.breadcrumb}>
//                         <Link to="/">Trang chủ</Link>
//                         <span> / </span>
//                         <Link to="/dien-thoai">Điện thoại</Link>
//                         <span> / </span>
//                         <span>{productInfo.name.split(" – ")[0]}</span>
//                     </div>

//                     <h1>{productInfo.name}</h1>
//                     <div className={styles.isDivider}></div>
//                     <p className={styles.price}>{productInfo.price}</p>
//                     <ul className={styles.features}>
//                         {productInfo.features.map((feature, idx) => (
//                             <li key={idx}>{feature}</li>
//                         ))}
//                     </ul>

//                     <ColorSelector colors={mockColors} selectedColor={selectedColor} onSelect={setSelectedColor} />

//                     <div className={styles.actions}>
//                         <div className={styles.quantity}>
//                             <button>-</button>
//                             <input type="text" value="1" readOnly />
//                             <button>+</button>
//                         </div>
//                         <button className={styles.addToCart}>THÊM VÀO GIỎ</button>
//                     </div>
//                 </div>
//             </div>
//             <ProductDescription />
//             <ProductFullDescription />
//             <ProductCategories />
//             <Footer />
//         </section>
//     );
// };

// export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import styles from "./ProductDetail.module.scss";
import ProductCategories from "@components/ProductCategories/ProductCategories";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import ProductDescription from "@components/ProductDescription/ProductDescription";
import ProductFullDescription from "../ProductFullDescription/ProductFullDescription";
import ColorSelector from "@components/ColorSelector/ColorSelector";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState("center center");
    const [isZooming, setIsZooming] = useState(false);
    const [fade, setFade] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");

    const { productId } = useParams();
    console.log("Product ID:", productId); // Kiểm tra xem nó có bị undefined không

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
                                    src={product.images?.[currentIndex] || "/default.jpg"}
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
                    {/* <div className={styles.breadcrumb}>
                        <Link to="/">Trang chủ</Link>
                        <span> / </span>
                        <Link to={`/danh-muc/${product.category}`}>{product.category}</Link>
                        <span> / </span>
                        <span>{product.name}</span>
                    </div> */}

                    <h1>{product.name}</h1>LAPTOP ĐƯỢC QUAN TÂM
                    <div className={styles.isDivider}></div>
                    <p className={styles.price}>{Number(product.price).toLocaleString()}₫</p>

                    <ul className={styles.features}>
                        <li>Thương hiệu: {product.brand}</li>
                        <li>Tồn kho: {product.stock}</li>
                    </ul>

                    {product.colors && product.colors.length > 0 && (
                        <ColorSelector
                            colors={product.colors}
                            selectedColor={selectedColor}
                            onSelect={setSelectedColor}
                        />
                    )}

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
