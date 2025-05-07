import { useEffect, useState } from "react";
import HeaderTop from "../HeaderTop/HeaderTop";
import Navbar from "../Navbar/Navbar";

import styles from "./Header.module.scss";

function Header() {
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`${styles.header} ${isFixed ? styles.fixed : ""}`}>
            <HeaderTop />
            <Navbar />
        </div>
    );
}

export default Header;
