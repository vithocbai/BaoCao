import styles from "./Footer.module.scss";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <div className={styles.container}>
                    <div className={styles.footerCol}>
                        <h4>HOTLINE HỖ TRỢ</h4>
                        <p>Hỗ trợ mua hàng: (+84) 0313-728-397</p>
                        <p>Hỗ trợ kỹ thuật: (+84) 0313-728-397</p>
                        <p>Hỗ trợ bảo hành: (+84) 0313-728-397</p>
                    </div>

                    <div className={styles.footerCol}>
                        <h4>MONA MEDIA</h4>
                        <p>Địa chỉ: 1073/23 CMT8, P.7, Q.Tân Bình, TP.HCM</p>
                        <p>Điện thoại: (+84) 0313-728-397</p>
                        <p>Email: hoang15tq@gmail.com</p>
                    </div>

                    <div className={styles.footerCol}>
                        <div className={styles.footerPayment}>
                            <p>Hỗ trợ thanh toán</p>
                            <img src="./images/footer/icon_payment.png" alt="Phương thức thanh toán" />
                        </div>

                        <div className={styles.advise}>
                            <p>Tư vấn miễn phí (24/7) (+84) 0313-728-397</p>
                            <p>Góp ý, phản ánh (8h00 - 22h00) (+84) 0313-728-397</p>
                        </div>
                        <img src="./images/footer/icon_cong_nhan.png" alt="Công nhận " />
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className={styles.container}>
                    <p>
                        © All rights reserved. Thiết kế website bởi <img src="./images/footer/copyright.png" alt="" />
                        <strong>Mona Media</strong>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
