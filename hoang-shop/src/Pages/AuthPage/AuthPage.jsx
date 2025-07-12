import React, { useState } from "react";
import styles from "./AuthPage.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const loginFormik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
            password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
        }),
        onSubmit: (values) => {
            console.log("🟢 Đăng nhập:", values);
            // TODO: Gọi API đăng nhập
        },
    });

    const registerFormik = useFormik({
        initialValues: { username: "", email: "", password: "", confirmPassword: "" },
        validationSchema: Yup.object({
            username: Yup.string().required("Vui lòng nhập tên"),
            email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
            password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
                .required("Bắt buộc"),
        }),
        onSubmit: (values) => {
            console.log("🟡 Đăng ký:", values);
            // TODO: Gọi API đăng ký
        },
    });

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button onClick={() => setIsLogin(true)} className={isLogin ? styles.active : ""}>Đăng Nhập</button>
                <button onClick={() => setIsLogin(false)} className={!isLogin ? styles.active : ""}>Đăng Ký</button>
            </div>

            {isLogin ? (
                <form className={styles.form} onSubmit={loginFormik.handleSubmit}>
                    <div className={styles.inputGroup}>
                        <MdEmail className={styles.icon} />
                        <input
                            name="email"
                            placeholder="Email"
                            value={loginFormik.values.email}
                            onChange={loginFormik.handleChange}
                            onBlur={loginFormik.handleBlur}
                        />
                    </div>
                    {loginFormik.touched.email && loginFormik.errors.email && (
                        <p className={styles.error}>{loginFormik.errors.email}</p>
                    )}

                    <div className={styles.inputGroup}>
                        <MdLock className={styles.icon} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={loginFormik.values.password}
                            onChange={loginFormik.handleChange}
                            onBlur={loginFormik.handleBlur}
                        />
                    </div>
                    {loginFormik.touched.password && loginFormik.errors.password && (
                        <p className={styles.error}>{loginFormik.errors.password}</p>
                    )}

                    <button type="submit" className={styles.button}>Đăng Nhập</button>
                    <button className={styles.googleBtn}>Đăng nhập bằng Google</button>
                </form>
            ) : (
                <form className={styles.form} onSubmit={registerFormik.handleSubmit}>
                    <div className={styles.inputGroup}>
                        <MdPerson className={styles.icon} />
                        <input
                            name="username"
                            placeholder="Tên người dùng"
                            value={registerFormik.values.username}
                            onChange={registerFormik.handleChange}
                            onBlur={registerFormik.handleBlur}
                        />
                    </div>
                    {registerFormik.touched.username && registerFormik.errors.username && (
                        <p className={styles.error}>{registerFormik.errors.username}</p>
                    )}

                    <div className={styles.inputGroup}>
                        <MdEmail className={styles.icon} />
                        <input
                            name="email"
                            placeholder="Email"
                            value={registerFormik.values.email}
                            onChange={registerFormik.handleChange}
                            onBlur={registerFormik.handleBlur}
                        />
                    </div>
                    {registerFormik.touched.email && registerFormik.errors.email && (
                        <p className={styles.error}>{registerFormik.errors.email}</p>
                    )}

                    <div className={styles.inputGroup}>
                        <MdLock className={styles.icon} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={registerFormik.values.password}
                            onChange={registerFormik.handleChange}
                            onBlur={registerFormik.handleBlur}
                        />
                    </div>
                    {registerFormik.touched.password && registerFormik.errors.password && (
                        <p className={styles.error}>{registerFormik.errors.password}</p>
                    )}

                    <div className={styles.inputGroup}>
                        <MdLock className={styles.icon} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={registerFormik.values.confirmPassword}
                            onChange={registerFormik.handleChange}
                            onBlur={registerFormik.handleBlur}
                        />
                    </div>
                    {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
                        <p className={styles.error}>{registerFormik.errors.confirmPassword}</p>
                    )}

                    <button type="submit" className={styles.button}>Đăng Ký</button>
                </form>
            )}
        </div>
    );
}
