import React, { useState, useEffect } from "react";
import styles from "./ProductAddModal.module.scss";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";

const ProductAddModal = ({ onClose, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [newSpecKey, setNewSpecKey] = useState("");
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
        const { name, value, type } = e.target;
        
        const parsedValue = type === "number" ? parseFloat(value) || 0 : value;

        setForm((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));

        // Xoá lỗi của trường nếu có
        setErrors((prev) => ({
            ...prev,
            [name]: null,
        }));

        // Logic đặc biệt: nếu là giảm giá > 0 → tự gán isPromotion = true
        if (name === "discountPercent") {
            setForm((prev) => ({
                ...prev,
                isPromotion: parsedValue > 0,
            }));
        }
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
        if (form.images.length > 8) newErrors.images = "Không được chọn quá 5 ảnh.";
        if (colors.length === 0) newErrors.colors = "Phải có ít nhất một màu sắc.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSpecKey = () => {
        if (!newSpecKey.trim()) return;
        if (!specSuggestions.includes(newSpecKey)) {
            setSpecSuggestions((prev) => [...prev, newSpecKey]);
        }
        setNewSpecKey("");
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
                    formData.append(key, Number(value));
                } else {
                    formData.append(key, value);
                }
            });

            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("🎉 Thêm sản phẩm thành công!");
                onSuccess();
            } else {
                const err = await res.json();
                console.error("Lỗi từ server:", err);
                toast.error("❌ Thêm sản phẩm thất bại: " + (err.message || "Lỗi không xác định."));
            }
        } catch (err) {
            console.error("Lỗi gửi dữ liệu:", err);
            toast.error("Lỗi khi gửi dữ liệu lên server.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Thêm sản phẩm</h2>
                    <button className={styles.modalCloseButton} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.productForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="productName" className={styles.formLabel}>
                            Tên sản phẩm:
                        </label>
                        <input
                            id="productName"
                            name="name"
                            placeholder="Tên sản phẩm"
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                        {errors.name && <p className={styles.formError}>{errors.name}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="productPrice" className={styles.formLabel}>
                            Giá:
                        </label>
                        <input
                            id="productPrice"
                            name="price"
                            type="number"
                            placeholder="Giá"
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                        {errors.price && <p className={styles.formError}>{errors.price}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="discountPercent" className={styles.formLabel}>
                            Giảm giá %:
                        </label>
                        <input
                            id="discountPercent"
                            name="discountPercent"
                            type="number"
                            placeholder="Giảm giá %"
                            min="0"
                            max="100"
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="productCategory" className={styles.formLabel}>
                            Danh mục:
                        </label>
                        <select
                            id="productCategory"
                            name="category"
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
                        {errors.category && <p className={styles.formError}>{errors.category}</p>}
                    </div>

                    {specSuggestions.map((key) => (
                        <div className={styles.formGroup} key={key}>
                            <label htmlFor={`spec-${key}`} className={styles.formLabel}>
                                {key}:
                            </label>
                            <input
                                id={`spec-${key}`}
                                placeholder={key}
                                value={form.specs[key] || ""}
                                onChange={(e) => handleSpecChange(key, e.target.value)}
                                className={styles.formInput}
                            />
                        </div>
                    ))}

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

                    <div className={styles.formGroup}>
                        <label htmlFor="productBrand" className={styles.formLabel}>
                            Thương hiệu:
                        </label>
                        <input
                            id="productBrand"
                            name="brand"
                            placeholder="Thương hiệu"
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                        {errors.brand && <p className={styles.formError}>{errors.brand}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="productStock" className={styles.formLabel}>
                            Tồn kho:
                        </label>
                        <input
                            id="productStock"
                            name="stock"
                            type="number"
                            placeholder="Tồn kho"
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                        {errors.stock && <p className={styles.formError}>{errors.stock}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="productColor" className={styles.formLabel}>
                            Màu sắc:
                        </label>
                        <div className={styles.inputWithButton}>
                            <input
                                id="productColor"
                                value={colorInput}
                                onChange={(e) => setColorInput(e.target.value)}
                                placeholder="Màu sắc"
                                className={styles.formInput}
                            />
                            <button className={styles.actionButton} type="button" onClick={handleAddColor}>
                                Thêm màu
                            </button>
                        </div>
                        {errors.colors && <p className={styles.formError}>{errors.colors}</p>}
                        <div className={styles.colorTagList}>
                            {colors.map((color) => (
                                <span key={color} onClick={() => handleRemoveColor(color)} className={styles.colorTag}>
                                    {color} ✕
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="productImages" className={styles.formLabel}>
                            Ảnh sản phẩm:
                        </label>
                        <div className={styles.imageUploadBox}>
                            <span className={styles.uploadIcon}>📤</span>
                            <p>Chọn ảnh hoặc kéo thả vào đây</p>
                            <input
                                id="productImages"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className={styles.uploadInput}
                            />
                        </div>
                        {errors.images && <p className={styles.formError}>{errors.images}</p>}
                        <div className={styles.imagePreviewContainer}>
                            {previewImages.map((src, i) => (
                                <div key={i} className={styles.imagePreviewItem} onClick={() => removeImage(i)}>
                                    <img src={src} alt="preview" className={styles.imagePreview} />
                                    <span className={styles.removeImageButton}>✕</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label htmlFor="productDescription" className={styles.formLabel}>
                            Mô tả chi tiết:
                        </label>
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
                                    "bullist numlist outdent indent | removeformat | help",
                            }}
                            className={styles.tinymceEditor}
                        />
                        {errors.description && <p className={styles.formError}>{errors.description}</p>}
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>
                            Thêm Sản phẩm
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

export default ProductAddModal;
