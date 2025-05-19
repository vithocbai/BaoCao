import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AdminProductEdit.module.scss";

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setImagePreviews(data.images || []);
            })
            .catch((err) => {
                console.error("Lỗi khi tải sản phẩm:", err);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { options } = e.target;
        const values = Array.from(options).filter((opt) => opt.selected).map((opt) => opt.value);
        setProduct((prev) => ({ ...prev, colors: values }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("brand", product.brand);
        formData.append("stock", product.stock);
        formData.append("category", product.category);
        formData.append("description", product.description);
        product.colors.forEach((color) => formData.append("colors[]", color));
        newImages.forEach((file) => formData.append("images", file));

        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) throw new Error("Cập nhật sản phẩm thất bại!");

            alert("Cập nhật sản phẩm thành công!");
            navigate("/admin/products");
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            alert("Lỗi khi cập nhật sản phẩm.");
        }
    };

    if (!product) return <p>Đang tải...</p>;

    return (
        <div className={styles.wrapper}>
            <h2>Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input name="name" value={product.name} onChange={handleChange} placeholder="Tên sản phẩm" />
                <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Giá" />
                <input name="brand" value={product.brand} onChange={handleChange} placeholder="Thương hiệu" />
                <input name="stock" type="number" value={product.stock} onChange={handleChange} placeholder="Tồn kho" />

                <select name="category" value={product.category} onChange={handleChange}>
                    <option value="">-- Chọn danh mục --</option>
                    <option value="smartphone">Điện thoại</option>
                    <option value="tablet">Máy tính bảng</option>
                    <option value="accessory">Phụ kiện</option>
                    <option value="laptop">Laptop</option>
                    <option value="smartwatch">Đồng hồ thông minh</option>
                </select>

                <label>Màu sắc:</label>
                <select name="colors" multiple value={product.colors} onChange={handleSelectChange}>
                    <option value="Đen">Đen</option>
                    <option value="Trắng">Trắng</option>
                    <option value="Xanh">Xanh</option>
                    <option value="Đỏ">Đỏ</option>
                    <option value="Vàng">Vàng</option>
                </select>

                <label>Chọn ảnh mới (nếu muốn thay):</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />

                <div className={styles.imagePreview}>
                    {imagePreviews.map((url, idx) => (
                        <img
                            key={idx}
                            src={url.startsWith("blob:") ? url : `http://localhost:5000${url}`}
                            alt={`preview-${idx}`}
                        />
                    ))}
                </div>

                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Mô tả sản phẩm"
                />

                <div className={styles.btnGroup}>
                    <button type="submit">Cập nhật</button>
                    <button type="button" onClick={() => navigate("/admin/products")} className={styles.backBtn}>
                        Quay lại
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductEdit;
