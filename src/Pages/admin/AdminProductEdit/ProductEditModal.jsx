import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductEditModal.module.scss";
import { Editor } from "@tinymce/tinymce-react";

const ProductEditModal = ({ product, onClose, onSuccess }) => {
    const modalRef = useRef(); // TẠO re
    const [categories, setCategories] = useState([]);
    const [colorInput, setColorInput] = useState("");
    const [colors, setColors] = useState(product.colors || []);
    const [previewImages, setPreviewImages] = useState([]);
    const [specSuggestions, setSpecSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ ...product });

    const [oldImages, setOldImages] = useState(product.images || []);
    const [newImages, setNewImages] = useState([]);

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
        if (!form.name?.trim()) newErrors.name = "Tên sản phẩm không được để trống.";
        if (!form.brand?.trim()) newErrors.brand = "Thương hiệu không được để trống.";
        if (!form.category) newErrors.category = "Danh mục là bắt buộc.";
        if (!form.description?.trim()) newErrors.description = "Mô tả không được để trống.";
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const formData = new FormData();
            // ... giữ nguyên đoạn xử lý FormData

            const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                alert("Cập nhật sản phẩm thành công!");
                // Scroll lên đầu modal
                modalRef.current?.scrollIntoView({ behavior: "smooth" });
                onSuccess();
            } else {
                const errData = await res.json();
                console.error("❌ Server trả về lỗi:", errData);
                alert("Cập nhật thất bại!");
            }
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật:", err);
            alert("Lỗi khi cập nhật sản phẩm.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} ref={modalRef}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
                <h2 className={styles.header}>Sửa sản phẩm</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                                name="images"
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
                            {oldImages.map((img, idx) => (
                                <div
                                    key={`old-${idx}`}
                                    className={styles.previewItem}
                                    onClick={() => {
                                        const updated = [...oldImages];
                                        updated.splice(idx, 1);
                                        setOldImages(updated);
                                    }}
                                >
                                    <img src={`http://localhost:5000${img}`} alt={`old-${idx}`} />
                                    <span className={styles.removeImage}>✕</span>
                                </div>
                            ))}

                            {newImages.map((img, idx) => (
                                <div key={`new-${idx}`} className={styles.previewItem}>
                                    <img src={URL.createObjectURL(img)} alt={`new-${idx}`} />
                                    <span
                                        className={styles.removeImage}
                                        onClick={() => {
                                            const updated = [...newImages];
                                            updated.splice(idx, 1);
                                            setNewImages(updated);
                                        }}
                                    >
                                        ✕
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

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
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;
