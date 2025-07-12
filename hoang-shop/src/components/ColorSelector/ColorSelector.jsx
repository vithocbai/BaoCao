import React, { useState } from "react";
import styles from "./ColorSelector.module.scss";
import { IoMdArrowDropdown } from "react-icons/io";

const ColorSelector = ({ colors, selectedColor, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (color) => {
        onSelect(color);
        setIsOpen(false);
    };

    return (
        <div className={styles.colorSelector}>
            <label>Màu:</label>
            <div className={styles.customSelect} onClick={() => setIsOpen(!isOpen)}>
                <div
                    className={`${styles.selectedValue} ${
                        selectedColor === "" || selectedColor === null || selectedColor === undefined
                            ? styles.placeholder
                            : ""
                    }`}
                >
                    {selectedColor === "" || selectedColor === null || selectedColor === undefined
                        ? "Chọn một tùy chọn"
                        : selectedColor}
                    <IoMdArrowDropdown className={styles.icon} />
                </div>

                {isOpen && (
                    <ul className={styles.options}>
                        {colors.map((color, index) => (
                            <li
                                key={index}
                                className={selectedColor === color ? styles.active : ""}
                                onClick={() => handleSelect(color)}
                            >
                                {color}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ColorSelector;
