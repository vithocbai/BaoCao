import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import styles from "./AdminProductAdd.module.scss";

const AdminProductAdd = () => {
    const navigate = useNavigate();
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        colors: [],
        images: [],
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        const { name, options } = e.target;
        const values = Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value);

        setFormData((prev) => ({
            ...prev,
            [name]: values,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
        setFormData((prev) => ({
            ...prev,
            images: files,
        }));
    };

    const handleEditorChange = (content) => {
        setFormData((prev) => ({ ...prev, description: content }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Tên sản phẩm không được để trống.";
        if (!formData.price || isNaN(formData.price) || formData.price <= 0)
            newErrors.price = "Giá sản phẩm không hợp lệ.";
        if (!formData.category) newErrors.category = "Vui lòng chọn danh mục.";
        if (!formData.stock || isNaN(formData.stock) || formData.stock < 0)
            newErrors.stock = "Tồn kho không hợp lệ.";
        if (formData.images.length === 0) newErrors.images = "Vui lòng chọn ít nhất một ảnh.";
        if (!formData.description.trim()) newErrors.description = "Mô tả sản phẩm không được để trống.";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("brand", formData.brand);
        data.append("stock", formData.stock);
        data.append("description", formData.description);
        formData.colors.forEach((color) => data.append("colors[]", color));
        formData.images.forEach((file) => data.append("images", file));

        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("Thêm sản phẩm thất bại!");

            alert("✅ Thêm sản phẩm thành công!");
            navigate("/admin/products");
        } catch (err) {
            alert("❌ Lỗi khi thêm sản phẩm. Vui lòng thử lại.");
            console.error(err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h2>Thêm sản phẩm mới</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Tên sản phẩm"
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}

                <input
                    type="number"
                    name="price"
                    placeholder="Giá"
                    value={formData.price}
                    onChange={handleChange}
                />
                {errors.price && <p className={styles.error}>{errors.price}</p>}

                <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="">-- Chọn danh mục --</option>
                    <option value="smartphone">Điện thoại</option>
                    <option value="tablet">Máy tính bảng</option>
                    <option value="accessory">Phụ kiện</option>
                    <option value="laptop">Laptop</option>
                    <option value="smartwatch">Đồng hồ thông minh</option>
                </select>
                {errors.category && <p className={styles.error}>{errors.category}</p>}

                <input
                    type="text"
                    name="brand"
                    placeholder="Thương hiệu"
                    value={formData.brand}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Tồn kho"
                    value={formData.stock}
                    onChange={handleChange}
                />
                {errors.stock && <p className={styles.error}>{errors.stock}</p>}

                <label>Chọn màu sắc:</label>
                <select name="colors" multiple value={formData.colors} onChange={handleSelectChange}>
                    <option value="Đen">Đen</option>
                    <option value="Trắng">Trắng</option>
                    <option value="Xanh">Xanh</option>
                    <option value="Đỏ">Đỏ</option>
                    <option value="Vàng">Vàng</option>
                </select>

                <label>Ảnh sản phẩm:</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                {errors.images && <p className={styles.error}>{errors.images}</p>}

                {imagePreviews.length > 0 && (
                    <div className={styles.imagePreview}>
                        {imagePreviews.map((url, idx) => (
                            <img key={idx} src={url} alt={`preview-${idx}`} />
                        ))}
                    </div>
                )}

                <label>Mô tả sản phẩm:</label>
                <Editor
                    apiKey="l3wqxt7yt14cqt897uql5k72l6zy01p3h73ffgapgwecqmdm"
                    value={formData.description}
                    onEditorChange={handleEditorChange}
                    init={{
                        height: 400,
                        menubar: false,
                        plugins: "link image code table lists",
                        toolbar:
                            "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | image link | code table",
                    }}
                />
                {errors.description && <p className={styles.error}>{errors.description}</p>}

                <div className={styles.btnGroup}>
                    <button type="submit">Thêm sản phẩm</button>
                    <button type="button" onClick={() => navigate("/admin/products")} className={styles.backBtn}>
                        Quay lại
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductAdd;
