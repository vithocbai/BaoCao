import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductEditModal.module.scss";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";

const ProductEditModal = ({ product, onClose, onSuccess }) => {
    const modalRef = useRef();
    const [categories, setCategories] = useState([]);
    const [colorInput, setColorInput] = useState("");
    const [colors, setColors] = useState(product.colors || []);
    const [specSuggestions, setSpecSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ ...product });

    const [oldImages, setOldImages] = useState(product.images || []);
    const [newImages, setNewImages] = useState([]);
    // State for the new spec key input
    const [newSpecKey, setNewSpecKey] = useState("");

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

    // Function to add a new custom spec key
    const handleAddSpecKey = () => {
        const trimmedKey = newSpecKey.trim();
        if (trimmedKey && !form.specs?.[trimmedKey]) {
            setForm((prev) => ({
                ...prev,
                specs: {
                    ...(prev.specs || {}), // Ensure specs object exists
                    [trimmedKey]: "", // Initialize with an empty value
                },
            }));
            setNewSpecKey(""); // Clear the input field
        } else if (trimmedKey && form.specs?.[trimmedKey]) {
            toast.warn(`Thông số "${trimmedKey}" đã tồn tại.`);
        }
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

            formData.append("name", form.name);
            formData.append("price", form.price);
            formData.append("discountPercent", form.discountPercent || 0);
            formData.append("brand", form.brand);
            formData.append("category", form.category);
            formData.append("stock", form.stock);
            formData.append("description", form.description);

            // Append colors
            formData.append("colors", JSON.stringify(colors));

            // Append specs
            formData.append("specs", JSON.stringify(form.specs || {}));

            // Append oldImages (giữ lại những ảnh chưa xóa)
            formData.append("oldImages", JSON.stringify(oldImages));

            // Append new images
            newImages.forEach((img) => {
                formData.append("images", img);
            });

            const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                toast.success("🎉 Cập nhật sản phẩm thành công!");
                // Scroll lên đầu modal
                onSuccess();
                modalRef.current?.scrollIntoView({ behavior: "smooth" });
            } else {
                const errData = await res.json();
                console.error("❌ Server trả về lỗi:", errData);
                toast.error("🎉 Cập nhật sản phẩm thất bại!");
            }
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật:", err);
            toast.error("🎉 Lỗi khi cập nhật sản phẩm.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.closeBtnWrapper}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
            </div>
            <div className={styles.modalContent} ref={modalRef}>
                <h2 className={styles.header}>Sửa sản phẩm</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Tên sản phẩm:</label>
                        <input name="name" value={form.name} onChange={handleChange} className={styles.formInput} />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Giá:</label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                        {errors.price && <p className={styles.error}>{errors.price}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Giảm giá %:</label>
                        <input
                            name="discountPercent"
                            type="number"
                            value={form.discountPercent}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Danh mục:</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className={styles.formSelect}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className={styles.error}>{errors.category}</p>}
                    </div>

                    {/* Display existing specs based on category and any newly added custom specs */}
                    {Object.keys(form.specs || {}).map((key) => (
                        <div key={key} className={styles.formGroup}>
                            <label className={styles.formLabel}>{key}:</label>
                            <input
                                value={form.specs[key] || ""}
                                onChange={(e) => handleSpecChange(key, e.target.value)}
                                className={styles.formInput}
                            />
                        </div>
                    ))}

                    {/* Add new spec input field and button */}
                    <div className={styles.formGroup}>
                        <label htmlFor="newSpecKey" className={styles.formLabel}>
                            Thêm thông số mới:
                        </label>
                        <div className={styles.inputWithButton}>
                            <input
                                id="newSpecKey"
                                type="text"
                                placeholder="Tên thông số mới"
                                value={newSpecKey}
                                onChange={(e) => setNewSpecKey(e.target.value)}
                                className={styles.formInput}
                            />
                            <button className={styles.actionButton} type="button" onClick={handleAddSpecKey}>
                                Thêm thông số
                            </button>
                        </div>
                    </div>
                    {/* End of new spec input field and button */}

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Thương hiệu:</label>
                        <input name="brand" value={form.brand} onChange={handleChange} className={styles.formInput} />
                        {errors.brand && <p className={styles.error}>{errors.brand}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Tồn kho:</label>
                        <input
                            name="stock"
                            type="number"
                            value={form.stock}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                        {errors.stock && <p className={styles.error}>{errors.stock}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Màu sắc:</label>
                        <div className={styles.inputWithButton}>
                            <input
                                value={colorInput}
                                onChange={(e) => setColorInput(e.target.value)}
                                placeholder="Màu sắc"
                                className={styles.formInput}
                            />
                            <button type="button" onClick={handleAddColor} className={styles.actionButton}>
                                Thêm màu
                            </button>
                        </div>
                        {errors.colors && <p className={styles.error}>{errors.colors}</p>}
                        <div className={styles.colorTagList}>
                            {colors.map((color) => (
                                <span key={color} onClick={() => handleRemoveColor(color)} className={styles.colorTag}>
                                    {color} ✕
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Ảnh sản phẩm:</label>
                        <div className={styles.imageUploadBox}>
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
                        {(oldImages.length > 0 || newImages.length > 0) && (
                            <div className={styles.imagePreviewContainer}>
                                {oldImages.map((img, idx) => (
                                    <div
                                        key={`old-${idx}`}
                                        className={styles.imagePreviewItem}
                                        onClick={() => {
                                            const updated = [...oldImages];
                                            updated.splice(idx, 1);
                                            setOldImages(updated);
                                        }}
                                    >
                                        <img
                                            src={`http://localhost:5000${img}`}
                                            alt={`old-${idx}`}
                                            className={styles.imagePreview}
                                        />
                                        <span className={styles.removeImageButton}>✕</span>
                                    </div>
                                ))}

                                {newImages.map((img, idx) => (
                                    <div key={`new-${idx}`} className={styles.imagePreviewItem}>
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt={`new-${idx}`}
                                            className={styles.imagePreview}
                                        />
                                        <span
                                            className={styles.removeImageButton}
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
                    </div>

                    {/* Thêm class fullWidth vào div này */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.formLabel}>Mô tả chi tiết:</label>
                        <Editor
                            apiKey="l3wqxt7yt14cqt897uql5k72l6zy01p3h73ffgapgwecqmdm"
                            value={form.description}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 700,
                                menubar: "file edit view insert format tools table help",
                                plugins: [
                                    "advlist autolink lists link image charmap print preview anchor",
                                    "searchreplace visualblocks code fullscreen",
                                    "insertdatetime media table paste code help wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic backcolor | " +
                                    "alignleft aligncenter alignalignjustify | " +
                                    "bullist numlist outdent indent | removeformat | media | help",
                            }}
                            className={styles.tinymceEditor}
                        />
                        {errors.description && <p className={styles.error}>{errors.description}</p>}
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>
                            Cập nhật
                        </button>
                        <button onClick={onClose} type="button" className={styles.cancelButton}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;
