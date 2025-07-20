import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    compatibilityDate: "2025-04-09",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],

    vite: {
        plugins: [tailwindcss()],
    },
    modules: ["shadcn-nuxt", "@pinia/nuxt", ],
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: "./components/ui",
    },
});
