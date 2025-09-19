// composables/useChat.js
export const useChat = () => {
    const config = useRuntimeConfig();
    const { $chatConfig, $chatUtils } = useNuxtApp();

    // Global chat state menggunakan useState untuk persistence
    const chatState = useState("chat.state", () => ({
        isEnabled: config.public.chatEnabled ?? true,
        isOpen: false,
        unreadCount: 0,
        messages: [],
        isTyping: false,
        currentProvider: config.public.chatProvider || "ollama",
    }));

    // Computed properties untuk reactivity
    const isEnabled = computed(() => chatState.value.isEnabled);
    const isOpen = computed(() => chatState.value.isOpen);
    const unreadCount = computed(() => chatState.value.unreadCount);
    const messages = computed(() => chatState.value.messages);
    const isTyping = computed(() => chatState.value.isTyping);
    const isAiEnabled = computed(() => config.public.chatProvider !== "static");
    const aiProvider = computed(() => config.public.chatProvider || "ollama");

    // Quick actions untuk kemudahan user
    const quickActions = ref([
        {
            id: 1,
            text: "Cek harga produk",
            action: "price_check",
            message: "Bagaimana cara mengecek harga produk?",
            icon: "💰",
        },
        {
            id: 2,
            text: "Info pengiriman",
            action: "shipping_info",
            message: "Berapa lama waktu pengiriman?",
            icon: "🚚",
        },
        {
            id: 3,
            text: "Cara pembayaran",
            action: "payment_info",
            message: "Apa saja metode pembayaran yang tersedia?",
            icon: "💳",
        },
        {
            id: 4,
            text: "Kebijakan retur",
            action: "return_policy",
            message: "Bagaimana kebijakan retur produk?",
            icon: "↩️",
        },
    ]);

    // Utility functions
    const generateMessageId = () => {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "";
        try {
            return new Date(timestamp).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "";
        }
    };

    // Message management
    const addMessage = (text, isUser = false, metadata = {}) => {
        if (!text || typeof text !== "string") {
            console.warn("Invalid message text provided to addMessage");
            return null;
        }

        const message = {
            id: generateMessageId(),
            text: text.trim(),
            isUser,
            timestamp: new Date().toISOString(),
            provider: metadata.provider || aiProvider.value,
            ...metadata,
        };

        chatState.value.messages.push(message);

        // Update unread count jika chat tertutup dan pesan dari AI
        if (!chatState.value.isOpen && !isUser) {
            chatState.value.unreadCount++;
        }

        // Auto-scroll ke bawah
        if (process.client) {
            nextTick(() => {
                const chatContainer = document.querySelector(".chat-messages");
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            });
        }

        return message;
    };

    const clearMessages = () => {
        chatState.value.messages = [];
        chatState.value.unreadCount = 0;
    };

    // Chat controls
    const openChat = () => {
        chatState.value.isOpen = true;
        chatState.value.unreadCount = 0;

        // Add welcome message jika belum ada pesan
        if (chatState.value.messages.length === 0) {
            addMessage(
                "Halo! Selamat datang di Toko Online Nuxt. Ada yang bisa saya bantu? 😊",
                false,
                { type: "welcome" }
            );
        }

        // Track event
        trackChatEvent("chat_opened");
    };

    const closeChat = () => {
        chatState.value.isOpen = false;
        trackChatEvent("chat_closed");
    };

    const toggleChat = () => {
        if (chatState.value.isOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    const setEnabled = (enabled) => {
        chatState.value.isEnabled = Boolean(enabled);
        if (!enabled) {
            closeChat();
        }
    };

    // AI Integration
    const sendToFreeAI = async (message, conversationHistory = []) => {
        if (!message || typeof message !== "string") {
            throw new Error("Invalid message provided to sendToFreeAI");
        }

        try {
            chatState.value.isTyping = true;

            // Prepare conversation history
            const history =
                conversationHistory.length > 0
                    ? conversationHistory
                    : chatState.value.messages.slice(-10).map((msg) => ({
                          text: msg.text,
                          isUser: msg.isUser,
                      }));

            const response = await $fetch("/api/chat/free-ai", {
                method: "POST",
                body: {
                    message: message.trim(),
                    conversationHistory: history,
                },
                timeout: 30000, // 30 detik timeout
            });

            if (response?.success && response?.message) {
                return {
                    message: response.message,
                    provider: response.provider || "ollama",
                    success: true,
                };
            } else {
                throw new Error(response?.error || "AI response failed");
            }
        } catch (error) {
            console.error("Free AI Error:", error);

            // Fallback responses berdasarkan jenis error
            let fallbackMessage =
                "Maaf, sistem AI sedang mengalami gangguan. Silakan hubungi WhatsApp kami di 0812-3456-7890.";

            if (error.message?.includes("timeout")) {
                fallbackMessage =
                    "Maaf, response AI terlalu lama. Silakan coba lagi atau hubungi WhatsApp kami di 0812-3456-7890.";
            } else if (
                error.message?.includes("network") ||
                error.message?.includes("fetch")
            ) {
                fallbackMessage =
                    "Maaf, ada masalah koneksi. Pastikan Ollama berjalan dan coba lagi.";
            } else if (error.message?.includes("404")) {
                fallbackMessage =
                    "Maaf, layanan AI belum tersedia. Silakan hubungi customer service kami.";
            }

            return {
                message: fallbackMessage,
                provider: "fallback",
                success: false,
                error: error.message,
            };
        } finally {
            chatState.value.isTyping = false;
        }
    };

    // Send message dengan AI response
    const sendMessage = async (text) => {
        if (!text || typeof text !== "string") {
            console.warn("Cannot send empty message");
            return null;
        }

        const userMessage = addMessage(text, true);

        try {
            const aiResponse = await sendToFreeAI(text);
            const aiMessage = addMessage(aiResponse.message, false, {
                provider: aiResponse.provider,
                success: aiResponse.success,
            });

            return {
                userMessage,
                aiMessage,
                success: aiResponse.success,
            };
        } catch (error) {
            console.error("Error in sendMessage:", error);
            const errorMessage = addMessage(
                "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi customer service kami.",
                false,
                { type: "error" }
            );
            return {
                userMessage,
                aiMessage: errorMessage,
                success: false,
                error: error.message,
            };
        }
    };

    // Handle quick actions
    const handleQuickAction = async (actionId) => {
        const action = quickActions.value.find((a) => a.id === actionId);
        if (action && action.message) {
            trackChatEvent("quick_action_used", { action: action.action });
            return await sendMessage(action.message);
        }
        return null;
    };

    // Event tracking
    const trackChatEvent = (eventName, data = {}) => {
        // Track dengan plugin gtag jika tersedia
        if (process.client && window.gtag) {
            window.gtag("event", eventName, {
                event_category: "chat",
                provider: aiProvider.value,
                ...data,
            });
        }

        // Track dengan chat utils jika tersedia
        if ($chatUtils && typeof $chatUtils.logChatEvent === "function") {
            $chatUtils.logChatEvent(eventName, data);
        }

        // Console log untuk development
        if (process.dev) {
            console.log(`Chat Event: ${eventName}`, {
                provider: aiProvider.value,
                ...data,
            });
        }
    };

    // Initialization
    const initializeChat = () => {
        if (process.client && chatState.value.isEnabled) {
            console.log("Chat initialized with provider:", aiProvider.value);
            trackChatEvent("chat_initialized", { provider: aiProvider.value });
        }
    };

    // Auto-initialize on client
    if (process.client) {
        nextTick(() => {
            initializeChat();
        });
    }

    // Return API
    return {
        // State (reactive)
        isEnabled,
        isOpen,
        unreadCount,
        messages,
        isTyping,
        isAiEnabled,
        aiProvider,
        quickActions: readonly(quickActions),

        // Methods
        addMessage,
        clearMessages,
        openChat,
        closeChat,
        toggleChat,
        setEnabled,
        sendMessage,
        sendToFreeAI,
        handleQuickAction,
        trackChatEvent,
        initializeChat,

        // Utilities
        generateMessageId,
        formatTimestamp,
    };
};

// Export default untuk backward compatibility
export default useChat;
