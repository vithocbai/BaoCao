import React from "react";
import styles from "./ProductDescription.module.scss";

const ProductDescription = () => {
    return (
        <div className={styles.descriptionSection}>
            <div className={styles.leftCol}>
                <h2>Mô tả</h2>
            </div>
            
            <div className={styles.rightCol}>
                <h2>THÔNG TIN CHI TIẾT</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Thương hiệu</td>
                            <td>BlackBerry</td>
                        </tr>
                        <tr>
                            <td>Model</td>
                            <td>Keyone</td>
                        </tr>
                        <tr>
                            <td>Phụ kiện đi kèm</td>
                            <td>1 Pin dự phòng</td>
                        </tr>
                        <tr>
                            <td>Màu</td>
                            <td>Đen Viền Bạc</td>
                        </tr>
                        <tr>
                            <td>Loại màn hình</td>
                            <td>IPS LCD</td>
                        </tr>
                        <tr>
                            <td>Kích thước màn hình</td>
                            <td>4.5 inch</td>
                        </tr>
                        <tr>
                            <td>Độ phân giải</td>
                            <td>1620 x 1080 pixels</td>
                        </tr>
                        <tr>
                            <td>Camera trước</td>
                            <td>8MP</td>
                        </tr>
                        <tr>
                            <td>Camera sau</td>
                            <td>12 MP</td>
                        </tr>
                        <tr>
                            <td>Đèn Flash</td>
                            <td>Có</td>
                        </tr>
                        <tr>
                            <td>Quay phim</td>
                            <td>1080p@30fps</td>
                        </tr>
                        <tr>
                            <td>RAM</td>
                            <td>3GB</td>
                        </tr>
                        <tr>
                            <td>ROM</td>
                            <td>32GB</td>
                        </tr>
                        <tr>
                            <td>Thẻ nhớ ngoài</td>
                            <td>microSD</td>
                        </tr>
                        <tr>
                            <td>Hỗ trợ thẻ tối đa</td>
                            <td>256GB</td>
                        </tr>
                        <tr>
                            <td>Kích thước</td>
                            <td>149.1 x 72.4 x 9.4 mm</td>
                        </tr>
                        <tr>
                            <td>Tên chip</td>
                            <td>Snapdragon 625</td>
                        </tr>
                        <tr>
                            <td>Tốc độ chip</td>
                            <td>2.0 GHz</td>
                        </tr>
                        <tr>
                            <td>GPU</td>
                            <td>Adreno 506</td>
                        </tr>
                        <tr>
                            <td>Hệ điều hành</td>
                            <td>Android 7.1 Nougat</td>
                        </tr>
                        <tr>
                            <td>Dung lượng pin</td>
                            <td>3505mAh</td>
                        </tr>
                        <tr>
                            <td>Loại pin</td>
                            <td>Li-Ion</td>
                        </tr>
                        <tr>
                            <td>Pin tháo rời</td>
                            <td>Không</td>
                        </tr>
                        <tr>
                            <td>Loại SIM</td>
                            <td>Nano-SIM</td>
                        </tr>
                        <tr>
                            <td>Số khe SIM</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>FM radio</td>
                            <td>Không</td>
                        </tr>
                        <tr>
                            <td>SKU</td>
                            <td>5807246169547</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDescription;
