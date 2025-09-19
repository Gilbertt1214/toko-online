// plugins/gtag.client.js
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const gaId = config.public.gaId;

    // Hanya load Google Analytics jika GA ID tersedia
    if (!gaId || gaId === "" || process.server) {
        return;
    }

    // Load Google Analytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }

    gtag("js", new Date());
    gtag("config", gaId, {
        // Konfigurasi privacy-friendly
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
    });

    // Track page views untuk SPA navigation
    const router = useRouter();
    router.afterEach((to) => {
        gtag("config", gaId, {
            page_path: to.fullPath,
            page_title: to.meta.title || document.title,
        });
    });

    // Provide gtag function globally
    return {
        provide: {
            gtag,
        },
    };
});
