import React, { useEffect, useState } from "react";
import styles from "./AdminCategory.module.scss";
import axios from "axios";

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [specInput, setSpecInput] = useState(""); // <-- NEW
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("/api/categories");
            setCategories(data);
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const generateSlug = (str) =>
        str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                slug: generateSlug(name),
                icon,
                specSuggestions: specInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== ""),
            };

            if (editingId) {
                await axios.put(`/api/category/${editingId}`, payload);
            } else {
                await axios.post("/api/category", payload);
            }

            setName("");
            setIcon("");
            setSpecInput("");
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            alert("Lỗi khi lưu danh mục");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat) => {
        setName(cat.name);
        setIcon(cat.icon || "");
        setSpecInput((cat.specSuggestions || []).join(", "));
        setEditingId(cat._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await axios.delete(`/api/category/${id}`);
                fetchCategories();
            } catch (err) {
                alert("Lỗi khi xóa danh mục");
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Quản lý danh mục</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tên danh mục"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="URL hình biểu tượng"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Gợi ý thông số (cách nhau dấu phẩy: RAM, CPU, Màn hình...)"
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setName("");
                            setIcon("");
                            setSpecInput("");
                            setEditingId(null);
                        }}
                    >
                        Hủy
                    </button>
                )}
            </form>

            <div className={styles.table}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Biểu tượng</th>
                            <th>Tên danh mục</th>
                            <th>Gợi ý thông số</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat._id}>
                                <td>{index + 1}</td>
                                <td>
                                    {cat.icon ? (
                                        <img
                                            src={cat.icon}
                                            alt={cat.name}
                                            className={styles.iconPreview}
                                        />
                                    ) : (
                                        <span>Không có</span>
                                    )}
                                </td>
                                <td>{cat.name}</td>
                                <td>
                                    {Array.isArray(cat.specSuggestions) && cat.specSuggestions.length > 0
                                        ? cat.specSuggestions.join(", ")
                                        : "Không có"}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(cat)}>Sửa</button>
                                    <button className={styles.delete} onClick={() => handleDelete(cat._id)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategory;
