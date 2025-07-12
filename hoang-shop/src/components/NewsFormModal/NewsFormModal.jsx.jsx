import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styles from "./NewsFormModal.module.scss";

const NewsFormModal = ({ isOpen, onClose, onSubmit, articleToEdit, loading, error }) => {
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [fullContent, setFullContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const editorRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (articleToEdit) {
                setTitle(articleToEdit.title || "");
                setShortDescription(articleToEdit.shortDescription || "");
                setFullContent(articleToEdit.fullContent || "");
                setImageUrl(articleToEdit.imageUrl || "");
            } else {
                setTitle("");
                setShortDescription("");
                setFullContent("");
                setImageUrl("");
            }
            setValidationErrors({});
            if (editorRef.current) {
                editorRef.current.setContent(articleToEdit ? articleToEdit.fullContent : "");
            }
        }
    }, [articleToEdit, isOpen]);

    const handleEditorChange = (content) => {
        setFullContent(content);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // Validation logic của bạn
        if (!title.trim()) {
            newErrors.title = "Tiêu đề không được để trống.";
        }
        if (!shortDescription.trim()) {
            newErrors.shortDescription = "Mô tả ngắn không được để trống.";
        }

        const cleanFullContent = fullContent.replace(/<[^>]*>?/gm, "").trim();
        if (!cleanFullContent) {
            // Kiểm tra nội dung sau khi đã loại bỏ HTML
            newErrors.fullContent = "Nội dung không được để trống.";
        }

        if (!imageUrl.trim()) {
            newErrors.imageUrl = "URL ảnh đại diện không được để trống.";
        } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imageUrl.trim())) {
            newErrors.imageUrl = "URL ảnh không hợp lệ. Phải là liên kết đến tệp ảnh (jpg, jpeg, png, gif, webp, svg).";
        }

        setValidationErrors(newErrors);

        // Nếu có lỗi, dừng quá trình submit
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Nếu không có lỗi, tiếp tục gọi onSubmit từ props
        onSubmit({
            _id: articleToEdit?._id,
            title,
            shortDescription,
            fullContent,
            imageUrl,
        });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>{articleToEdit ? "Sửa Bài Viết" : "Thêm Bài Viết Mới"}</h3>
                <form onSubmit={handleFormSubmit} className={styles.newsForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="modalTitle">Tiêu đề:</label>
                        <input
                            type="text"
                            id="modalTitle"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setValidationErrors((prev) => ({ ...prev, title: null }));
                            }}
                            className={validationErrors.title ? styles.inputError : ""}
                        />
                        {validationErrors.title && <p className={styles.errorMessage}>{validationErrors.title}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="modalShortDescription">Mô tả ngắn:</label>
                        <textarea
                            id="modalShortDescription"
                            value={shortDescription}
                            onChange={(e) => {
                                setShortDescription(e.target.value);
                                setValidationErrors((prev) => ({ ...prev, shortDescription: null }));
                            }}
                            className={validationErrors.shortDescription ? styles.inputError : ""}
                        ></textarea>
                        {validationErrors.shortDescription && (
                            <p className={styles.errorMessage}>{validationErrors.shortDescription}</p>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="modalFullContent">Nội dung đầy đủ:</label>
                        <Editor
                            apiKey="l3wqxt7yt14cqt897uql5k72l6zy01p3h73ffgapgwecqmdm"
                            onInit={(evt, editor) => (editorRef.current = editor)}
                            value={fullContent}
                            onEditorChange={(content) => {
                                setFullContent(content);
                                setValidationErrors((prev) => ({ ...prev, fullContent: null }));
                            }}
                            init={{
                                height: 600,
                                menubar: "file edit view insert format tools table help",
                                plugins: [
                                    "advlist autolink lists link image charmap print preview anchor",
                                    "searchreplace visualblocks code fullscreen",
                                    "insertdatetime media table paste code help wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic backcolor | " +
                                    "alignleft aligncenter alignright alignjustify | " +
                                    "bullist numlist outdent indent | removeformat | help | image media",
                            }}
                            className={`${styles.tinymceEditor} ${
                                validationErrors.fullContent ? styles.editorError : ""
                            }`}
                        />
                        {validationErrors.fullContent && (
                            <p className={styles.errorMessage}>{validationErrors.fullContent}</p>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="modalImageUrl">Ảnh đại diện (URL):</label>
                        <input
                            type="text"
                            id="modalImageUrl"
                            value={imageUrl}
                            onChange={(e) => {
                                setImageUrl(e.target.value);
                                setValidationErrors((prev) => ({ ...prev, imageUrl: null }));
                            }}
                            placeholder="Dán URL ảnh đại diện"
                            className={validationErrors.imageUrl ? styles.inputError : ""}
                        />
                        {imageUrl && (
                            <div className={styles.imagePreview}>
                                <img src={imageUrl} alt="Ảnh đại diện" />
                            </div>
                        )}
                        {validationErrors.imageUrl && (
                            <p className={styles.errorMessage}>{validationErrors.imageUrl}</p>
                        )}
                    </div>
                    {error && <p className={styles.formError}>{error}</p>} {/* Lỗi từ API */}
                    <div className={styles.formActions}>
                        <button type="submit" disabled={loading} className={styles.submitButton}>
                            {loading ? "Đang xử lý..." : articleToEdit ? "Cập nhật" : "Thêm mới"}
                        </button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsFormModal;
