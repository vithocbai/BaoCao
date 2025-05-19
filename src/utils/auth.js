export const getUser = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) return null;

    try {
        return JSON.parse(user);
    } catch (err) {
        console.error("Lỗi parse user từ localStorage:", err);
        return null;
    }
};
