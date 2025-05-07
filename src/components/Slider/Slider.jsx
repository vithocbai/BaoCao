import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; // Thêm Navigation
import "swiper/css";
import "swiper/css/navigation"; // Import CSS cho navigation
import styles from "./Slider.module.scss";

function Slider() {
    return (
        <Swiper
            modules={[Autoplay, Navigation]} // Thêm Navigation vào modules
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            navigation={true} // Bật navigation
            className={styles.slider}
        >
            <SwiperSlide>
                <img src="/images/banner/banner01.jpg" alt="Banner 1" />
                <p className={styles.sliderText}>Vivo V7 | V7+</p>
            </SwiperSlide>
            <SwiperSlide>
                <img src="/images/banner/banner02.jpg" alt="Banner 2" />
                <p className={styles.sliderText}>Online Friday giảm đến 30%</p>
            </SwiperSlide>
            <SwiperSlide>
                <img src="/images/banner/banner03.jpg" alt="Banner 3" />
                <p className={styles.sliderText}>iPhone X mở bán chính thức</p>
            </SwiperSlide>
            <SwiperSlide>
                <img src="/images/banner/banner04.jpg" alt="Banner 4" />

                <p className={styles.sliderText}>Samsung trợ giá 8.5 triệu</p>
            </SwiperSlide>
            <SwiperSlide>
                <img src="/images/banner/banner05.jpg" alt="Banner 5" />
                <p className={styles.sliderText}> Tràn màn hình, tràn quà</p>
            </SwiperSlide>
            <SwiperSlide>
                <img src="/images/banner/banner06.png" alt="Banner 6" />
                <p className={styles.sliderText}>Lên đời OPPO F5 tiết </p>
            </SwiperSlide>
            <SwiperSlide>
                <img src="/images/banner/banner07.jpg" alt="Banner 7" />
                <p className={styles.sliderText}>Note FE trợ giá 5.5 triệu</p>
            </SwiperSlide>
        </Swiper>
    );
}

export default Slider;
