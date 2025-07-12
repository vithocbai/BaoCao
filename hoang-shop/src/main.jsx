import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@assets/styles/main.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { CategoryProvider } from "@/context/CategoryContext.jsx";

const clientId = "616575544295-iaapvaa5ltveu2c5hffhovhm5auv8lv0.apps.googleusercontent.com";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <CartProvider>
                <CategoryProvider>
                    <GoogleOAuthProvider clientId={clientId}>
                        <App />
                    </GoogleOAuthProvider>
                </CategoryProvider>
            </CartProvider>
        </UserProvider>
    </StrictMode>
);
