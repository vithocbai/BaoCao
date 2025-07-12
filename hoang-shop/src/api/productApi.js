// src/api/productApi.js

const BASE_URL = "http://localhost:5000/api";

async function fetchData(endpoint, options = {}) {
    try {
        let url = `${BASE_URL}${endpoint}`;
        const queryString = new URLSearchParams();

        if (options.params) {
            for (const key in options.params) {
                const value = options.params[key];
                if (value !== null && typeof value !== "undefined" && value !== "") {
                    if (key === "category") {
                        if (Array.isArray(value)) {
                            value.forEach((catSlug) => queryString.append("category", catSlug));
                        } else if (typeof value === "string" && value.includes(",")) {
                            value.split(",").forEach((catSlug) => queryString.append("category", catSlug.trim()));
                        } else {
                            queryString.append(key, value);
                        }
                    } else {
                        queryString.append(key, value);
                    }
                }
            }
        }

        if (queryString.toString()) {
            url += `?${queryString.toString()}`;
        }

        const fetchOptions = { ...options };
        delete fetchOptions.params;

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            let errorData = {};

            try {
                errorData = await response.json();
            } catch (parseError) {
                console.warn(`Could not parse error response as JSON from ${url}. Status: ${response.status}`);

                throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
            }
            throw new Error(errorData.message || `Lỗi API: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi fetch dữ liệu từ ${endpoint}:`, error);
        throw error;
    }
}

export const getCategories = async () => {
    return fetchData("/categories");
};

export const getCategoriesTree = async (slug = "") => {
    const endpoint = slug ? `/categories/tree?slug=${slug}` : "/categories/tree";
    return fetchData(endpoint);
};

export const getProducts = async (params = {}) => {
    return fetchData("/products", { params });
};

export const getSaleProducts = async (params = {}) => {
    return fetchData("/products/sale", { params });
};
