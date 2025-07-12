// src/components/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import styles from './LoadingSpinner.module.scss'; // Tạo file CSS riêng cho spinner

const LoadingSpinner = () => {
    return (
        <div className={styles.spinnerOverlay}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default LoadingSpinner;