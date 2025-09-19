// nuxt.config.ts - SIMPLE & WORKING VERSION
export default defineNuxtConfig({
    // CSS Configuration
    css: ["~/assets/css/main.css"],

    devtools: { enabled: true },

    // Modules - urutan penting!
    modules: [
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "@nuxt/image",
        "shadcn-nuxt",
    ],

    // Plugins
    plugins: ["~/plugins/chat.client.js", "~/plugins/gtag.client.js"],

    // Tailwind - simple config
    tailwindcss: {
        viewer: false,
    },

    // Shadcn
    shadcn: {
        prefix: "",
        componentDir: "./components/ui",
    },

    // App meta
    app: {
        head: {
            title: "Toko Online Nuxt",
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    name: "description",
                    content: "Toko online terbaik dengan AI chat support",
                },
            ],
        },
    },

    // Components auto-import
    components: [
        { path: "~/components", pathPrefix: false },
        { path: "~/components/ui", pathPrefix: false },
    ],

    // Runtime config
    runtimeConfig: {
        // Server-side only
        apiSecret: process.env.API_SECRET || "default-secret",
        huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY || "",
        cohereApiKey: process.env.COHERE_API_KEY || "",
        groqApiKey: process.env.GROQ_API_KEY || "",

        // Client-side
        public: {
            chatEnabled: process.env.CHAT_ENABLED !== "false",
            chatProvider: process.env.CHAT_PROVIDER || "ollama",
            siteName: "Toko Online Nuxt",
            siteUrl: process.env.SITE_URL || "http://localhost:3000",
            whatsappNumber: process.env.WHATSAPP_NUMBER || "081234567890",
            ollamaUrl: process.env.OLLAMA_URL || "http://localhost:11434",
            ollamaModel: process.env.OLLAMA_MODEL || "llama3.2:1b",
            aiMaxTokens: parseInt(process.env.AI_MAX_TOKENS || "350"),
            aiTemperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
        },
    },

    // Build config
    build: {
        transpile: ["embla-carousel-vue", "embla-carousel-autoplay"],
    },

    // Nitro config
    nitro: {
        routeRules: {
            "/api/chat/**": { cors: true },
        },
    },
});
