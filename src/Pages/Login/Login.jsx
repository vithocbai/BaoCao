import React from "react";
import styles from "./Login.module.scss";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { loginUser } from "@/services/authService";

export default function Login() {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
            password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Mật khẩu không được để trống"),
        }),
        onSubmit: (values) => {
            console.log("✅ Dữ liệu đăng nhập:", values);
            // TODO: Gọi API login
        },
    });

    const onSubmit = async (values) => {
        try {
            const res = await loginUser(values);
            const token = res.data.token;

            // Lưu vào localStorage
            localStorage.setItem("token", token);

            // Chuyển sang trang dashboard
            navigate("/"); // hoặc "/user", tuỳ bạn cấu hình route
        } catch (err) {
            alert(err.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Đăng Nhập</h2>

            <form className={styles.form} onSubmit={formik.handleSubmit}>
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
                {formik.touched.email && formik.errors.email && <p className={styles.error}>{formik.errors.email}</p>}

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

                <div className={styles.options}>
                    <Link to="/forgot-password" className={styles.link}>
                        Quên mật khẩu?
                    </Link>
                </div>

                <button type="submit" className={styles.button}>
                    Đăng nhập
                </button>
            </form>

            <div className={styles.divider}></div>

            <button className={styles.googleButton}>
                <FcGoogle size={20} />
                <span>Đăng nhập bằng Google</span>
            </button>

            <p className={styles.registerPrompt}>
                Chưa có tài khoản?{" "}
                <Link to="/register" className={styles.link}>
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
