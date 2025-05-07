import NewsBox from "../NewsBox/NewBox";
import Slider from "../Slider/Slider";
import styles from "./Banner.module.scss";

function Banner() {
    return (
        <div className={styles.bannerContainer}>
            <div className={styles.sliderSection}>
                <Slider />
            </div>
            <div className={styles.rightAdsSection}>
                <NewsBox />
            </div>
        </div>
    );
}



export default Banner;
