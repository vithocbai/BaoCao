import React, { useState, useEffect } from "react";
import styles from "./ProductEditModal.module.scss";
import { Editor } from "@tinymce/tinymce-react";

const ProductEditModal = ({ product, onClose, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [colorInput, setColorInput] = useState("");
    const [colors, setColors] = useState(product.colors || []);
    const [previewImages, setPreviewImages] = useState([]);
    const [specSuggestions, setSpecSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ ...product });

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
        if (colors.length === 0) newErrors.colors = "Phải có ít nhất một màu sắc.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSpecChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            specs: { ...prev.specs, [key]: value },
        }));
    };

    const handleEditorChange = (content) => {
        setForm((prev) => ({ ...prev, description: content }));
        setErrors((prev) => ({ ...prev, description: null }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === "images") return; // Không gửi lại ảnh cũ ở đây
                if (key === "colors" || key === "specs") {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                alert("Cập nhật sản phẩm thành công!");
                onSuccess();
            } else {
                alert("Cập nhật thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            alert("Lỗi khi cập nhật sản phẩm.");
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter((file) => file.type.startsWith("image/"));
        const previews = validImages.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...previews]);
        setForm((prev) => ({ ...prev, images: [...prev.images, ...validImages] }));
        setErrors((prev) => ({ ...prev, images: null }));
    };
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
                <h2 className={styles.header}>Sửa sản phẩm</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Tương tự ProductAddModal - Copy label + error check + default value */}
                    <label>
                        Tên sản phẩm:
                        <input name="name" value={form.name} onChange={handleChange} />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </label>
                    <label>
                        Giá:
                        <input name="price" type="number" value={form.price} onChange={handleChange} />
                        {errors.price && <p className={styles.error}>{errors.price}</p>}
                    </label>
                    <label>
                        Giảm giá %:
                        <input
                            name="discountPercent"
                            type="number"
                            value={form.discountPercent}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Danh mục:
                        <select name="category" value={form.category} onChange={handleChange}>
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
                                value={form.specs?.[key] || ""}
                                onChange={(e) => handleSpecChange(key, e.target.value)}
                            />
                        </label>
                    ))}
                    <label>
                        Thương hiệu:
                        <input name="brand" value={form.brand} onChange={handleChange} />
                        {errors.brand && <p className={styles.error}>{errors.brand}</p>}
                    </label>
                    <label>
                        Tồn kho:
                        <input name="stock" type="number" value={form.stock} onChange={handleChange} />
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

                    {form.images?.length > 0 && (
                        <div className={styles.previewBox}>
                            {form.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={styles.previewItem}
                                    onClick={() => {
                                        const updatedImages = [...form.images];
                                        updatedImages.splice(idx, 1);
                                        setForm((prev) => ({ ...prev, images: updatedImages }));
                                    }}
                                >
                                    <img src={`http://localhost:5000${img}`} alt={`old-${idx}`} />
                                    <span className={styles.removeImage}>✕</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <label>
                        Mô tả chi tiết:
                        <Editor
                            apiKey="l3wqxt7yt14cqt897uql5k72l6zy01p3h73ffgapgwecqmdm"
                            value={form.description}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 300,
                                menubar: false,
                                plugins: "link image code table lists",
                                toolbar:
                                    "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | image link | code table",
                            }}
                        />
                        {errors.description && <p className={styles.error}>{errors.description}</p>}
                    </label>
                    <button type="submit" className={styles.submitBtn}>
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;
