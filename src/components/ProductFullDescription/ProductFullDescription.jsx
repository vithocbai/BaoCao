import React from "react";
import styles from "./ProductFullDescription.module.scss";

const ProductFullDescription = () => {
    return (
        <section className={styles.fullDescriptionSection}>
            <div className={styles.fullDescription}>
                <h2 className={styles.sectionTitle}>MÔ TẢ SẢN PHẨM</h2>

                <div className={styles.block}>
                    <h3>Thiết kế hoàn thiện, cao cấp</h3>
                    <p>
                        Nhìn tổng thể, Điện Thoại BlackBerry KEYone có thiết kế cứng cáp với viền khung kim loại chia rõ
                        rệt hai phần: màn hình cảm ứng và bàn phím. Màn hình 4.5 inch độ phân giải 1620x1080 pixels,
                        cong nhẹ, sử dụng công nghệ IPS cho khả năng hiển thị sống động và góc nhìn rộng. Mặt kính cảm
                        ứng là Corning Gorilla Glass 4, giúp bảo vệ tối ưu hơn.
                    </p>
                    <img
                        src="https://tikicdn.com/media/catalog/product/b/l/blackberry-keyone_2.u3059.d20170921.t140305.818366.jpg"
                        alt=""
                    />
                </div>

                <div className={styles.block}>
                    <h3>Bố trí hài hòa</h3>
                    <p>
                        Camera trước 8MP được đặt ở cạnh trên cùng với khả năng quay video Full HD. Đỉnh máy có jack tai
                        nghe 3.5mm. Bàn phím QWERTY hỗ trợ cảm ứng điện dung cho phép cuộn màn hình như touchpad, cùng
                        cảm biến vân tay tích hợp trên phím Space. Phím nguồn ở cạnh trái, phím volume, phím tiện ích và
                        khe SIM ở cạnh phải.
                    </p>
                    <img
                        src="https://tikicdn.com/media/catalog/product/b/l/blackberry-keyone_3.u3059.d20170921.t140305.843819.jpg"
                        alt=""
                    />
                    <p>
                        Cổng sạc USB Type-C, loa và micro đặt đối xứng ở cạnh dưới. Mặt lưng thiết kế chấm bi giúp chống
                        bám vân tay và chống trượt.
                    </p>
                </div>

                <div className={styles.block}>
                    <h3>Hiệu năng mạnh mẽ</h3>
                    <p>
                        Máy chạy Android 7, RAM 3GB, chip Snapdragon 625 với CPU 8 nhân 2.0GHz và GPU Adreno 506. Bộ nhớ
                        trong 32GB có thể mở rộng đến 256GB qua thẻ microSD. Pin dung lượng 3505mAh cho thời lượng sử
                        dụng lâu dài.
                    </p>
                    <img
                        src="https://tikicdn.com/media/catalog/product/b/l/blackberry-keyone_4.u3059.d20170921.t144727.655133.jpg"
                        alt=""
                    />
                </div>

                <div className={styles.block}>
                    <h3>Camera chất lượng tốt</h3>
                    <p>
                        Camera chính 12MP sử dụng cảm biến Sony IMX378, chụp tốt cả trong điều kiện ánh sáng yếu. Camera
                        trước 8MP góc rộng, hỗ trợ đèn flash cho selfie đẹp hơn.
                    </p>
                </div>

                <div className={styles.block}>
                    <h3>BlackBerry® Hub – Tất cả trong một</h3>
                    <p>
                        BlackBerry Hub tập hợp mọi thông báo từ email, cuộc gọi, mạng xã hội vào một nơi, giúp quản lý
                        dễ dàng. Tích hợp DTEK giúp kiểm soát quyền truy cập ứng dụng, cùng trình quản lý mật khẩu tiện
                        lợi.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ProductFullDescription;
