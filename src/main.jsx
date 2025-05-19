import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@assets/styles/main.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "616575544295-iaapvaa5ltveu2c5hffhovhm5auv8lv0.apps.googleusercontent.com";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <App />
        </GoogleOAuthProvider>
    </StrictMode>
);
