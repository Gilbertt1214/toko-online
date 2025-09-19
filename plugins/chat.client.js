// plugins/chat.client.js
export default defineNuxtPlugin(() => {
    // Plugin hanya akan dijalankan di client-side
    if (process.server) return;

    const config = useRuntimeConfig();

    // Inisialisasi chat configuration
    const chatConfig = {
        enabled: config.public.chatEnabled,
        provider: config.public.chatProvider,
        ollamaUrl: config.public.ollamaUrl,
        ollamaModel: config.public.ollamaModel,
        maxTokens: config.public.aiMaxTokens,
        temperature: config.public.aiTemperature,
        whatsappNumber: config.public.whatsappNumber,
    };

    // Global chat utilities
    const chatUtils = {
        // Format WhatsApp URL
        getWhatsAppUrl(message = "") {
            const number = chatConfig.whatsappNumber.replace(/\D/g, "");
            const encodedMessage = encodeURIComponent(message);
            return `https://wa.me/${number}${
                message ? `?text=${encodedMessage}` : ""
            }`;
        },

        // Check if Ollama is available
        async checkOllamaStatus() {
            try {
                const response = await fetch(
                    `${chatConfig.ollamaUrl}/api/tags`,
                    {
                        method: "GET",
                        timeout: 5000,
                    }
                );
                return response.ok;
            } catch (error) {
                console.warn("Ollama not available:", error.message);
                return false;
            }
        },

        // Log chat events (for analytics)
        logChatEvent(event, data = {}) {
            if (process.client && window.gtag) {
                window.gtag("event", event, {
                    event_category: "chat",
                    custom_parameter_1: chatConfig.provider,
                    ...data,
                });
            }

            // Console log untuk development
            if (process.dev) {
                console.log(`Chat Event: ${event}`, {
                    provider: chatConfig.provider,
                    ...data,
                });
            }
        },
    };

    // Provide chat configuration dan utilities ke seluruh app
    return {
        provide: {
            chatConfig,
            chatUtils,
        },
    };
});
