import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PriceFilter.module.scss";

const PriceFilter = ({ onFilter }) => {
    const MIN_RANGE_VALUE = 0;
    const MAX_RANGE_VALUE = 50740000;

    const [currentMinValue, setCurrentMinValue] = useState(MIN_RANGE_VALUE);
    const [currentMaxValue, setCurrentMaxValue] = useState(MAX_RANGE_VALUE);

    const sliderContainerRef = useRef(null);

    const handleMinChange = useCallback(
        (e) => {
            const value = Number(e.target.value);

            setCurrentMinValue(Math.min(value, currentMaxValue, MAX_RANGE_VALUE));
        },
        [currentMaxValue, MAX_RANGE_VALUE]
    );

    const handleMaxChange = useCallback(
        (e) => {
            const value = Number(e.target.value);
            setCurrentMaxValue(Math.max(value, currentMinValue, MIN_RANGE_VALUE));
        },
        [currentMinValue, MIN_RANGE_VALUE]
    ); // Dependencies: currentMinValue và MIN_RANGE_VALUE

    // HÀM QUAN TRỌNG BỊ THIẾU: Xử lý khi nhấn nút LỌC
    const handleApplyFilter = useCallback(() => {
        if (onFilter) {
            onFilter(currentMinValue, currentMaxValue);
        }
    }, [onFilter, currentMinValue, currentMaxValue]);
    // Hàm định dạng tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    // Tính toán style cho thanh "filled"
    const getFilledTrackStyle = () => {
        if (!sliderContainerRef.current) return {};

        const containerWidth = sliderContainerRef.current.offsetWidth; // Chiều rộng của container
        const range = MAX_RANGE_VALUE - MIN_RANGE_VALUE; // Tổng dải giá

        // Tính toán vị trí % của min và max trong toàn bộ range
        const minPercent = ((currentMinValue - MIN_RANGE_VALUE) / range) * 100;
        const maxPercent = ((currentMaxValue - MIN_RANGE_VALUE) / range) * 100;

        // Chiều rộng của thanh filled
        const width = maxPercent - minPercent;
        // Vị trí bắt đầu (từ bên trái) của thanh filled
        const left = minPercent;

        return {
            width: `${width}%`,
            left: `${left}%`,
        };
    };

    return (
        <div className={styles.priceFilter}>
            <h3 className={styles.title}>LỌC THEO GIÁ</h3>

            <div className={styles.sliderContainer} ref={sliderContainerRef}>
                <div className={styles.rangeValues}>
                    <span className={styles.currentMin}>{formatCurrency(currentMinValue)}</span> -{" "}
                    <span className={styles.currentMax}>{formatCurrency(currentMaxValue)}</span>
                </div>
                {/* Thanh nền của track (màu mờ) */}
                <div className={styles.trackBackground}></div>

                {/* Thanh filled (màu nổi bật) */}
                <div className={styles.filledTrack} style={getFilledTrackStyle()}></div>

                <input
                    type="range"
                    min={MIN_RANGE_VALUE}
                    max={MAX_RANGE_VALUE}
                    value={currentMinValue}
                    onChange={handleMinChange}
                    className={`${styles.slider} ${styles.minSlider}`}
                />
                <input
                    type="range"
                    min={MIN_RANGE_VALUE}
                    max={MAX_RANGE_VALUE}
                    value={currentMaxValue}
                    onChange={handleMaxChange}
                    className={`${styles.slider} ${styles.maxSlider}`}
                />
            </div>
            {/* Đảm bảo handleApplyFilter được gọi khi nhấn nút LỌC */}
            <button className={styles.filterButton} onClick={handleApplyFilter}>
                LỌC
            </button>
        </div>
    );
};

export default PriceFilter;
