import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("/api/categories");
                setCategories(data);
            } catch (err) {
                console.error("Lỗi khi load danh mục:", err);
            }
        };

        fetchCategories();
    }, []);

    return <CategoryContext.Provider value={{ categories }}>{children}</CategoryContext.Provider>;
};

export const useCategories = () => useContext(CategoryContext);

