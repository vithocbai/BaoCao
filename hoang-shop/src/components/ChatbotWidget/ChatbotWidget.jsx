import React, { useState, useEffect, useRef } from "react";
import { processUserMessage } from "@services/chatbotService";
import styles from "./ChatbotWidget.module.scss";

const ChatbotWidget = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào! Tôi là chatbot hỗ trợ sản phẩm. Tôi có thể giúp gì cho bạn hôm nay?" },
    ]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage = input;
        setMessages((prevMessages) => [...prevMessages, { sender: "user", text: userMessage }]);
        setInput("");
        setIsThinking(true);

        try {
            const botResponse = await processUserMessage(userMessage);
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botResponse }]);
        } catch (error) {
            console.error("Lỗi khi xử lý tin nhắn chatbot:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Xin lỗi, tôi gặp sự cố nội bộ. Vui lòng thử lại sau." },
            ]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isThinking) {
            handleSendMessage();
        }
    };

    return (
        <div className={styles.chatbotContainer}>
            <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                Chatbot
            </button>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        Chat với Bot
                        <button onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <div className={styles.messagesContainer}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                                {msg.text.split("\n").map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        ))}
                        {isThinking && <div className={`${styles.message} ${styles.bot}`}>Bot đang nghĩ...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn của bạn..."
                            disabled={isThinking}
                        />
                        <button onClick={handleSendMessage} disabled={isThinking}>
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
