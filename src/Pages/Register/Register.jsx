import React from "react";
import styles from "./Register.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { MdPerson, MdEmail, MdLock } from "react-icons/md";

export default function Register() {
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Vui lòng nhập tên người dùng"),
            email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
            password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
                .required("Bắt buộc"),
        }),
        onSubmit: (values) => {
            console.log("📝 Thông tin đăng ký:", values);
            // TODO: Gọi API đăng ký
        },
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Đăng Ký</h2>

            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <div className={styles.inputGroup}>
                    <MdPerson className={styles.icon} />
                    <input
                        type="text"
                        name="username"
                        placeholder="Tên người dùng"
                        className={styles.input}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                </div>
                {formik.touched.username && formik.errors.username && (
                    <p className={styles.error}>{formik.errors.username}</p>
                )}

                <div className={styles.inputGroup}>
                    <MdEmail className={styles.icon} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.input}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                </div>
                {formik.touched.email && formik.errors.email && (
                    <p className={styles.error}>{formik.errors.email}</p>
                )}

                <div className={styles.inputGroup}>
                    <MdLock className={styles.icon} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        className={styles.input}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                </div>
                {formik.touched.password && formik.errors.password && (
                    <p className={styles.error}>{formik.errors.password}</p>
                )}

                <div className={styles.inputGroup}>
                    <MdLock className={styles.icon} />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        className={styles.input}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                    />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className={styles.error}>{formik.errors.confirmPassword}</p>
                )}

                <button type="submit" className={styles.button}>Tạo tài khoản</button>
            </form>

            <p className={styles.loginPrompt}>
                Đã có tài khoản? <Link to="/login" className={styles.link}>Đăng nhập</Link>
            </p>
        </div>
    );
}
