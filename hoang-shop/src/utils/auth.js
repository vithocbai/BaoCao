// Lấy token từ localStorage
export const getToken = () => {
    try {
        return localStorage.getItem("token");
    } catch (error) {
        console.error("Lỗi khi lấy token từ localStorage:", error);
        return null;
    }
};

// Lưu token vào localStorage
export const setToken = (token) => {
    try {
        if (token) {
            localStorage.setItem("token", token);
        }
    } catch (error) {
        console.error("Lỗi khi lưu token vào localStorage:", error);
    }
};

// Xóa token khỏi localStorage
export const removeToken = () => {
    try {
        localStorage.removeItem("token");
    } catch (error) {
        console.error("Lỗi khi xóa token khỏi localStorage:", error);
    }
};

// Lấy user từ localStorage
export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        if (!user) return null;
        return JSON.parse(user);
    } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
        return null;
    }
};

// Lưu user vào localStorage
export const setUser = (user) => {
    try {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    } catch (error) {
        console.error("Lỗi khi lưu user vào localStorage:", error);
    }
};

// Xóa user khỏi localStorage
export const removeUser = () => {
    try {
        localStorage.removeItem("user");
    } catch (error) {
        console.error("Lỗi khi xóa user khỏi localStorage:", error);
    }
};

// Đăng xuất hoàn toàn
export const logout = () => {
    removeToken();
    removeUser();
};
