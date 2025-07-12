import React from "react";
import styles from "./Register.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaLock, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import Product from "@components/Product/Product";
import { toast } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();

    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Tên đăng nhập bắt buộc"),
        email: Yup.string().email("Email không hợp lệ").required("Email không được bỏ trống"),
        password: Yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Mật khẩu không được bỏ trống"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
            .required("Xác nhận mật không được bỏ trống"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const { username, email, password } = values;
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                username,
                email,
                password,
            });
            toast.success("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi đăng ký";
            setErrors({ email: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section>
            <Header />
            <div className={styles.container}>
                <h2 className={styles.title}>Đăng ký tài khoản</h2>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <FaUser className={styles.icon} />
                            <Field name="username" type="text" placeholder="Tên đăng nhập" />
                        </div>
                        <ErrorMessage name="username" component="div" className={styles.error} />

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

                        <div className={styles.inputGroup}>
                            <FaCheckCircle className={styles.icon} />
                            <Field name="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" />
                        </div>
                        <ErrorMessage name="confirmPassword" component="div" className={styles.error} />

                        <button type="submit" className={styles.btn}>
                            Đăng ký
                        </button>

                        <div className={styles.footer}>
                            Đã có tài khoản? <span onClick={() => navigate("/login")}>Đăng nhập</span>
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

export default Register;
