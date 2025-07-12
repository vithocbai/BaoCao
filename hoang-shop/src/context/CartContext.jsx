import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchCartItems, updateCartItems } from "@/api/cartApi";
import { getToken } from "@/utils/auth";
import { toast } from "react-toastify";

const CartContext = createContext();

// Helper to get cart from localStorage
const getLocalCart = () => {
    try {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getLocalCart());
    const [loading, setLoading] = useState(true);

    const updateCart = async (newItems) => {
        try {
            const total = newItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
            const token = getToken();
            if (token) {
                const updated = await updateCartItems({
                    items: newItems,
                    total,
                });
                setCartItems(updated.items || []);
            } else {
                setCartItems(newItems);
            }
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật giỏ hàng:", error);
            toast.error("Không thể cập nhật giỏ hàng.");
        }
    };

    const fetchCart = useCallback(async () => {
        setLoading(true);
        const token = getToken();

        const localCart = getLocalCart();
        setCartItems(localCart);

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await fetchCartItems();
            let mergedCart = [...(data.items || [])];

            if (localCart.length > 0) {
                localStorage.removeItem("cartItems");

                for (const localItem of localCart) {
                    const existing = mergedCart.find(
                        (item) => item.productId === localItem.productId && item.color === localItem.color
                    );
                    if (existing) {
                        existing.quantity += localItem.quantity;
                    } else {
                        mergedCart.push(localItem);
                    }
                }
            }

            setCartItems(mergedCart);
            await updateCart(mergedCart);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setCartItems([]);
                localStorage.removeItem("cartItems");
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            } else {
                console.error("Không thể lấy giỏ hàng:", err);
                toast.error("Lỗi khi tải giỏ hàng.");
                setCartItems(localCart);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity, selectedColor) => {
        const image =
            Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : typeof product.images === "string"
                ? product.images
                : "";

        const existingIndex = cartItems.findIndex(
            (item) => item.productId === product._id && item.color === selectedColor
        );

        let updatedItems = [...cartItems];
        let message = "";

        if (existingIndex !== -1) {
            updatedItems[existingIndex].quantity += quantity;
            message = `Đã cập nhật số lượng ${product.name} trong giỏ hàng.`;
            toast.info(message);
        } else {
            updatedItems.push({
                productId: product._id,
                productName: product.name,
                quantity,
                price: product.price,
                color: selectedColor,
                images: [image],
            });
            message = `Đã thêm ${product.name} vào giỏ hàng.`;
            toast.success(message);
        }

        setCartItems(updatedItems);

        if (getToken()) {
            updateCart(updatedItems);
        }
    };

    const removeItemFromCart = (productId, color) => {
        const updatedItems = cartItems.filter((item) => !(item.productId === productId && item.color === color));
        setCartItems(updatedItems);
        if (getToken()) {
            updateCart(updatedItems);
        }
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
    };

    const updateItemQuantity = (productId, color, newQuantity) => {
        if (newQuantity <= 0) {
            removeItemFromCart(productId, color);
            return;
        }

        const updatedItems = cartItems.map((item) =>
            item.productId === productId && item.color === color ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedItems);

        if (getToken()) {
            updateCart(updatedItems);
        }
        toast.info("Đã cập nhật số lượng sản phẩm.");
    };

    return (
        <CartContext.Provider
            value={{ cartItems, setCartItems, addToCart, removeItemFromCart, updateItemQuantity, loading }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart phải được sử dụng bên trong CartProvider");
    }
    return context;
};
