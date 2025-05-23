import React, { useState, useEffect } from "react";
import styles from "./ProductAddModal.module.scss";
import { Editor } from "@tinymce/tinymce-react";

const ProductAddModal = ({ onClose, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [colorInput, setColorInput] = useState("");
    const [colors, setColors] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [specSuggestions, setSpecSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        price: 0,
        discountPercent: 0,
        category: "",
        brand: "",
        stock: 0,
        colors: [],
        specs: {},
        description: "",
        images: [],
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/categories");
                const data = await res.json();
                if (Array.isArray(data)) setCategories(data);
            } catch (err) {
                console.error("Lỗi lấy danh mục:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSpecs = async () => {
            if (!form.category) return setSpecSuggestions([]);
            try {
                const res = await fetch(`http://localhost:5000/api/category/${form.category}/specs`);
                const data = await res.json();
                if (Array.isArray(data)) setSpecSuggestions(data);
            } catch (err) {
                console.error("Lỗi lấy specs:", err);
                setSpecSuggestions([]);
            }
        };
        fetchSpecs();
    }, [form.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Tên sản phẩm không được để trống.";
        if (!form.brand.trim()) newErrors.brand = "Thương hiệu không được để trống.";
        if (!form.category) newErrors.category = "Danh mục là bắt buộc.";
        if (!form.description || form.description.trim() === "") newErrors.description = "Mô tả không được để trống.";
        if (form.price <= 0) newErrors.price = "Giá phải lớn hơn 0.";
        if (form.stock < 0) newErrors.stock = "Tồn kho không được âm.";
        if (form.images.length === 0) newErrors.images = "Phải có ít nhất một ảnh sản phẩm.";
        if (form.images.length > 5) newErrors.images = "Không được chọn quá 5 ảnh.";
        if (colors.length === 0) newErrors.colors = "Phải có ít nhất một màu sắc.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter((file) => file.type.startsWith("image/"));
        const previews = validImages.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...previews]);
        setForm((prev) => ({ ...prev, images: [...prev.images, ...validImages] }));
        setErrors((prev) => ({ ...prev, images: null }));
    };

    const removeImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSpecChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            specs: { ...prev.specs, [key]: value },
        }));
    };

    const handleAddColor = () => {
        const trimmed = colorInput.trim();
        if (trimmed && !colors.includes(trimmed)) {
            const updated = [...colors, trimmed];
            setColors(updated);
            setForm((prev) => ({ ...prev, colors: updated }));
            setColorInput("");
            setErrors((prev) => ({ ...prev, colors: null }));
        }
    };

    const handleRemoveColor = (color) => {
        const updated = colors.filter((c) => c !== color);
        setColors(updated);
        setForm((prev) => ({ ...prev, colors: updated }));
    };

    const handleEditorChange = (content) => {
        setForm((prev) => ({ ...prev, description: content }));
        setErrors((prev) => ({ ...prev, description: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === "images") {
                    value.forEach((file) => formData.append("images", file));
                } else if (key === "colors" || key === "specs") {
                    formData.append(key, JSON.stringify(value));
                } else if (key === "price" || key === "stock" || key === "discountPercent") {
                    formData.append(key, Number(value)); // 🛠 Ép kiểu về số
                } else {
                    formData.append(key, value);
                }
            });

            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Thêm sản phẩm thành công!");
                onSuccess();
            } else {
                const err = await res.json();
                console.error("Lỗi từ server:", err);
                alert("Thêm sản phẩm thất bại: " + (err.message || "Lỗi không xác định."));
            }
        } catch (err) {
            console.error("Lỗi gửi dữ liệu:", err);
            alert("Lỗi khi gửi dữ liệu lên server.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
                <h2 className={styles.header}>Thêm sản phẩm</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        Tên sản phẩm:
                        <input name="name" placeholder="Tên sản phẩm" onChange={handleChange} />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </label>

                    <label>
                        Giá:
                        <input name="price" type="number" placeholder="Giá" onChange={handleChange} />
                        {errors.price && <p className={styles.error}>{errors.price}</p>}
                    </label>

                    <label>
                        Giảm giá %:
                        <input name="discountPercent" type="number" placeholder="Giảm giá %" onChange={handleChange} />
                    </label>

                    <label>
                        Danh mục:
                        <select name="category" onChange={handleChange}>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className={styles.error}>{errors.category}</p>}
                    </label>

                    {specSuggestions.map((key) => (
                        <label key={key}>
                            {key}:
                            <input
                                placeholder={key}
                                value={form.specs[key] || ""}
                                onChange={(e) => handleSpecChange(key, e.target.value)}
                            />
                        </label>
                    ))}

                    <label>
                        Thương hiệu:
                        <input name="brand" placeholder="Thương hiệu" onChange={handleChange} />
                        {errors.brand && <p className={styles.error}>{errors.brand}</p>}
                    </label>

                    <label>
                        Tồn kho:
                        <input name="stock" type="number" placeholder="Tồn kho" onChange={handleChange} />
                        {errors.stock && <p className={styles.error}>{errors.stock}</p>}
                    </label>

                    <div className={styles.colorWrapper}>
                        <label>Màu sắc:</label>
                        <input
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            placeholder="Màu sắc"
                        />
                        <button type="button" onClick={handleAddColor}>
                            Thêm màu
                        </button>
                        {errors.colors && <p className={styles.error}>{errors.colors}</p>}
                        <div className={styles.colorList}>
                            {colors.map((color) => (
                                <span key={color} onClick={() => handleRemoveColor(color)}>
                                    {color} ✕
                                </span>
                            ))}
                        </div>
                    </div>

                    <label className={styles.uploadWrapper}>
                        <div className={styles.uploadBox}>
                            <span className={styles.uploadIcon}>📤</span>
                            <p>Chọn ảnh hoặc kéo thả vào đây</p>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className={styles.uploadInput}
                            />
                        </div>
                        {errors.images && <p className={styles.error}>{errors.images}</p>}
                    </label>

                    <div className={styles.previewBox}>
                        {previewImages.map((src, i) => (
                            <div key={i} className={styles.previewItem} onClick={() => removeImage(i)}>
                                <img src={src} alt="preview" />
                                <span className={styles.removeImage}>✕</span>
                            </div>
                        ))}
                    </div>

                    <label>
                        <span style={{ marginBottom: "10px", display: "block" }}>Mô tả chi tiết:</span>
                        <Editor
                            apiKey="l3wqxt7yt14cqt897uql5k72l6zy01p3h73ffgapgwecqmdm"
                            value={form.description}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 500,
                                menubar: "file edit view insert format tools table help",
                                plugins: [
                                    "advlist autolink lists link image charmap print preview anchor",
                                    "searchreplace visualblocks code fullscreen",
                                    "insertdatetime media table paste code help wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic backcolor | " +
                                    "alignleft aligncenter alignright alignjustify | " +
                                    "bullist numlist outdent indent | removeformat | help",
                            }}
                        />

                        {errors.description && <p className={styles.error}>{errors.description}</p>}
                    </label>

                    <button type="submit" className={styles.submitBtn}>
                        Lưu sản phẩm
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductAddModal;
