// services/productService.js
import axios from "axios";
const API = `${import.meta.env.VITE_API_URL}/products`;

export const getAllProducts = () => axios.get(API);
export const getProductById = (id) => axios.get(`${API}/${id}`);
export const createProduct = (data) => axios.post(API, data);
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API}/${id}`);
