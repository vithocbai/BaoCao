import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/news';

// Helper function to attach token to headers
const getAuthHeaders = (token) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getAllNews = async (params = {}) => {
    try {
        const response = await axios.get(API_BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching all news:', error);
        throw error;
    }
};

export const getNewsBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching news by slug ${slug}:`, error);
        throw error;
    }
};

export const getRecentNews = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recent`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent news:', error);
        throw error;
    }
};

// --- Admin functions ---

export const createNewsArticle = async (articleData, token) => {
    try {
        const response = await axios.post(API_BASE_URL, articleData, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error creating news article:', error);
        throw error;
    }
};

export const updateNewsArticle = async (articleId, articleData, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${articleId}`, articleData, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error(`Error updating news article ${articleId}:`, error);
        throw error;
    }
};

export const deleteNewsArticle = async (articleId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${articleId}`, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error(`Error deleting news article ${articleId}:`, error);
        throw error;
    }
};

// Basic "login" for getting a token (for demonstration)
export const loginAdmin = async (password) => {
    // In a real app, this would be a secure API call to validate credentials
    // and return a JWT. For this example, we're hardcoding the token.
    if (password === 'admin123') { // This should match your backend's ADMIN_TOKEN for a real login
        // For simplicity, we just return the hardcoded token from backend
        // In a real app, the server would return a JWT upon successful login.
        return 'supersecretadmintoken123';
    } else {
        throw new Error('Invalid credentials');
    }
};