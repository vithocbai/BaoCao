import React from "react";
import styles from "./Login.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import Product from "@components/Product/Product";
import { useUser } from "@/context/UserContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useUser();

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Email không hợp lệ").required("Email không được bỏ trống"),
        password: Yup.string().required("Mật khẩu không được bỏ trống"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, values);
            const { token, username, email, role } = res.data;

            // Lưu token để dùng sau
            localStorage.setItem("token", token);

            // Cập nhật context user → cập nhật header ngay lập tức
            login({ username, email, role });

            alert("Đăng nhập thành công!");
            navigate("/");
        } catch (err) {
            const msg = err.response?.data?.message || "Đăng nhập thất bại";
            setErrors({ password: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google-login`, decoded);
            const { token, username, email, role } = res.data;

            localStorage.setItem("token", token);
            login({ username, email, role }); // cập nhật context

            navigate("/");
        } catch (err) {
            console.error("Google login failed:", err);
            alert("Đăng nhập bằng Google thất bại");
        }
    };

    return (
        <section>
            <Header />
            <div className={styles.container}>
                <h2 className={styles.title}>Đăng nhập</h2>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <FaEnvelope className={styles.icon} />
                            <Field name="email" type="email" placeholder="Email" />
                        </div>
                        <ErrorMessage name="email" component="div" className={styles.error} />

                        <div className={styles.inputGroup}>
                            <FaLock className={styles.icon} />
                            <Field name="password" type="password" placeholder="Mật khẩu" />
                        </div>
                        <ErrorMessage name="password" component="div" className={styles.error} />

                        <button type="submit" className={styles.btn}>
                            Đăng nhập
                        </button>

                        <div className={styles.divider}>hoặc</div>

                        <div style={{ width: "100%" }}>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    console.log("Google Login Failed");
                                }}
                            />
                        </div>
                        <div className={styles.footer}>
                            <span onClick={() => navigate("/register")}>Chưa có tài khoản? Đăng ký ngay</span>
                        </div>
                    </Form>
                </Formik>
            </div>
            <Product
                title="PHỤ KIỆN HOT"
                view="Xem tất cả phụ kiện"
                viewAllLink="/dien-thoai"
                products={[
                    {
                        id: 1,
                        name: "Điện Thoại BlackBerry KEYone – Hàng Chính Hãng",
                        price: "14,990,000đ",
                        image: ["/images/mobileProduct/img01.jpg", "/images/mobileProduct/img01.1.jpg"],
                        sale: true,
                    },
                    {
                        id: 2,
                        name: "Điện Thoại iPhone X 64GB - Hàng Chính Hãng",
                        price: "19,990,000đ",
                        image: ["/images/mobileProduct/img02.jpg", "/images/mobileProduct/img02.2.jpg"],
                        sale: true,
                    },
                    {
                        id: 3,
                        name: "Điện Thoại iPhone 6s 32GB – Hàng Chính Hãng",
                        price: "12,100,000đ",
                        image: ["/images/mobileProduct/img03.jpg", "/images/mobileProduct/img03.3.jpg"],
                        sale: true,
                    },
                    {
                        id: 4,
                        name: "Điện Thoại iPhone 7 32GB – Hàng Chính Hãng",
                        price: "14,300,000đ",
                        image: ["/images/mobileProduct/img04.jpg", "/images/mobileProduct/img04.4.jpg"],
                        sale: true,
                    },
                    {
                        id: 5,
                        name: "Điện Thoại Samsung Galaxy S8 – Hàng Chính Hãng",
                        price: "15,990,000đ",
                        image: ["/images/mobileProduct/img05.jpg", "/images/mobileProduct/img05.5.jpg"],
                        sale: true,
                    },
                    {
                        id: 6,
                        name: "Điện Thoại Samsung Galaxy J7 Pro – Hàng Chính Hãng",
                        price: "5,860,000đ",
                        image: ["/images/mobileProduct/img06.jpg", "/images/mobileProduct/img06.6.jpg"],
                        sale: true,
                    },
                    {
                        id: 7,
                        name: "Điện Thoại Samsung Galaxy Note FE – Hàng Chính Hãng",
                        price: "13,990,000đ",
                        image: ["/images/mobileProduct/img07.jpg", "/images/mobileProduct/img07.7.jpg"],
                        sale: true,
                    },
                    {
                        id: 8,
                        name: "Điện Thoại Samsung Galaxy Note 8 – Hàng Chính Hãng",
                        price: "19,990,000đ",
                        image: ["/images/mobileProduct/img08.jpg", "/images/mobileProduct/img08.8.jpg"],
                        sale: true,
                    },
                ]}
            />
            <Footer />
        </section>
    );
};

export default Login;
