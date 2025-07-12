const BASE_URL = "http://localhost:5000/api";

export const fetchProductByName = async (productName) => {
    try {
        const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(productName)}`);
        if (!response.ok) {
            if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Bad request for product search.");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products; // This returns an array of products
    } catch (error) {
        console.error("Lỗi khi fetchProductByName:", error);
        throw error; // Re-throw to be handled by chatbot logic
    }
};

export const fetchProductById = async (productId) => {
    try {
        const response = await fetch(`${BASE_URL}/products/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const product = await response.json();
        return product; // This returns a single product object
    } catch (error) {
        console.error("Lỗi khi fetchProductById:", error);
        throw error;
    }
};

export const fetchAllCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Lỗi khi fetchAllCategories:", error);
        throw error;
    }
};

export const fetchProductsByCategorySlug = async (categorySlug) => {
    try {
        const response = await fetch(`${BASE_URL}/products?category=${encodeURIComponent(categorySlug)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products; // This returns an array of products
    } catch (error) {
        console.error("Lỗi khi fetchProductsByCategorySlug:", error);
        throw error;
    }
};

export const findCategorySlugByName = async (categoryName) => {
    try {
        const categories = await fetchAllCategories();
        const foundCategory = categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
        return foundCategory ? foundCategory.slug : null;
    } catch (error) {
        console.error("Lỗi khi findCategorySlugByName:", error);
        return null;
    }
};
