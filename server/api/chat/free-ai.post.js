
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { message, conversationHistory = [] } = body;

        // Menggunakan Ollama sebagai provider utama
        const response = await callOllamaAPI(message, conversationHistory);

        return {
            success: true,
            message: response,
            provider: "ollama",
        };
    } catch (error) {
        console.error("Ollama API Error:", error);

        // Fallback ke static response jika Ollama gagal
        return {
            success: false,
            message: await getStaticResponse(body?.message || ""),
            error: error.message,
            provider: "fallback",
        };
    }
});

// OLLAMA AI Implementation
async function callOllamaAPI(message, conversationHistory) {
    try {
        const config = useRuntimeConfig();
        const ollamaUrl = config.public.ollamaUrl || "http://localhost:11434";
        const ollamaModel = config.public.ollamaModel || "llama3.2:1b";

        // System prompt untuk customer service
        const systemPrompt = `Anda adalah asisten customer service AI untuk toko online yang ramah dan membantu. 

Tugas Anda:
- Membantu pelanggan dengan pertanyaan produk, harga, stok, dan pengiriman
- Memberikan informasi yang akurat dan berguna tentang toko
- Merespons dalam bahasa Indonesia yang sopan dan profesional
- Jika tidak memiliki informasi pasti, arahkan ke customer service manusia
- Berikan jawaban yang singkat namun informatif

Informasi Toko:
- Nama: Toko Online Nuxt
- Pengiriman: Seluruh Indonesia, estimasi 2-5 hari kerja
- Metode Pembayaran: Transfer bank, COD, e-wallet (GoPay, OVO, Dana, ShopeePay)
- Kebijakan Retur: 7 hari dengan syarat barang dalam kondisi baik
- Customer Service: WhatsApp 0812-3456-7890 (24/7)
- Jam Operasional: Senin-Minggu 08:00-22:00 WIB

Gaya Komunikasi:
- Ramah dan profesional
- Gunakan sapaan yang hangat
- Akhiri dengan tawaran bantuan lebih lanjut
- Jangan berikan informasi yang tidak pasti`;

        // Format conversation history untuk context
        let conversationContext = "";
        if (conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-6); // Ambil 6 percakapan terakhir
            conversationContext = recentHistory
                .map(
                    (msg) =>
                        `${msg.isUser ? "Pelanggan" : "Assistant"}: ${msg.text}`
                )
                .join("\n");
            conversationContext = `\nPercakapan sebelumnya:\n${conversationContext}\n`;
        }

        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: ollamaModel,
                prompt: `${systemPrompt}${conversationContext}\nPelanggan: ${message}\nAssistant:`,
                stream: false,
                options: {
                    temperature: 0.7,
                    max_tokens: 350,
                    top_p: 0.9,
                    repeat_penalty: 1.1,
                    seed: 42,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(
                `Ollama API error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();

        // Validasi dan cleanup response
        let aiResponse = data.response || "";

        // Cleanup response dari karakter yang tidak diinginkan
        aiResponse = aiResponse
            .trim()
            .replace(/^Assistant:\s*/i, "") // Hapus prefix "Assistant:"
            .replace(/^\w+:\s*/i, "") // Hapus prefix role lainnya
            .trim();

        if (!aiResponse || aiResponse.length < 10) {
            throw new Error("Empty or too short response from Ollama");
        }

        return aiResponse;
    } catch (error) {
        console.error("Ollama Error:", error);

        // Coba dengan model backup jika gagal
        if (
            error.message.includes("model not found") ||
            error.message.includes("llama3.2:1b")
        ) {
            console.log("Trying backup model...");
            return await callOllamaWithBackupModel(
                message,
                conversationHistory
            );
        }

        throw error;
    }
}

// Backup model jika model utama tidak tersedia
async function callOllamaWithBackupModel(message, conversationHistory) {
    try {
        const config = useRuntimeConfig();
        const ollamaUrl = config.public.ollamaUrl || "http://localhost:11434";

        // List model yang akan dicoba secara berurutan
        const backupModels = [
            "llama3.2:3b",
            "llama3:8b",
            "llama2:7b",
            "codellama:7b",
        ];

        for (const model of backupModels) {
            try {
                const response = await fetch(`${ollamaUrl}/api/generate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: model,
                        prompt: `Anda adalah customer service toko online. Jawab dalam bahasa Indonesia yang ramah dan profesional.\n\nPelanggan: ${message}\nJawaban:`,
                        stream: false,
                        options: {
                            temperature: 0.7,
                            max_tokens: 250,
                        },
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const aiResponse = data.response?.trim();
                    if (aiResponse && aiResponse.length > 10) {
                        console.log(`Successfully used backup model: ${model}`);
                        return aiResponse;
                    }
                }
            } catch (modelError) {
                console.log(`Model ${model} failed, trying next...`);
                continue;
            }
        }

        throw new Error("All backup models failed");
    } catch (error) {
        console.error("Backup model error:", error);
        throw error;
    }
}

// Fallback static responses untuk error handling
async function getStaticResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Responses berdasarkan kata kunci
    const responses = {
        harga: "Untuk informasi harga produk, silakan kirim nama atau kode produk yang Anda maksud. Tim kami akan segera memberikan informasi harga terbaru. 💰",

        pengiriman:
            "Kami menyediakan pengiriman ke seluruh Indonesia dengan estimasi 2-5 hari kerja. Ongkos kirim dihitung berdasarkan berat dan tujuan pengiriman. 🚚",

        pembayaran:
            "Kami menerima pembayaran melalui:\n• Transfer bank\n• COD (Cash on Delivery)\n• E-wallet: GoPay, OVO, Dana, ShopeePay 💳",

        retur: "Kami menerima retur barang dalam 7 hari dengan syarat:\n• Barang masih dalam kondisi baik\n• Kemasan asli masih utuh\n• Disertai bukti pembelian 📦",

        stok: "Untuk pengecekan stok produk, silakan kirim nama atau kode produk. Tim kami akan segera mengecek ketersediaan untuk Anda. 📋",

        promo: "Kami sering mengadakan promo menarik! Follow media sosial kami atau hubungi WhatsApp 0812-3456-7890 untuk info promo terbaru. 🎉",

        kontak: "Hubungi customer service kami:\n📞 WhatsApp: 0812-3456-7890\n⏰ Jam operasional: 08:00-22:00 WIB\n📅 Senin-Minggu",

        jam: "Jam operasional toko:\n🕐 Senin-Minggu: 08:00-22:00 WIB\n📞 Customer service 24/7 via WhatsApp: 0812-3456-7890",
    };

    // Cek kata kunci dalam pesan
    for (const [key, response] of Object.entries(responses)) {
        if (
            lowerMessage.includes(key) ||
            (key === "pengiriman" &&
                (lowerMessage.includes("ongkir") ||
                    lowerMessage.includes("shipping"))) ||
            (key === "pembayaran" &&
                (lowerMessage.includes("bayar") ||
                    lowerMessage.includes("payment"))) ||
            (key === "retur" &&
                (lowerMessage.includes("return") ||
                    lowerMessage.includes("kembali"))) ||
            (key === "stok" &&
                (lowerMessage.includes("stock") ||
                    lowerMessage.includes("tersedia"))) ||
            (key === "promo" &&
                (lowerMessage.includes("diskon") ||
                    lowerMessage.includes("sale"))) ||
            (key === "kontak" &&
                (lowerMessage.includes("cs") ||
                    lowerMessage.includes("customer service"))) ||
            (key === "jam" && lowerMessage.includes("buka"))
        ) {
            return response;
        }
    }

    // Default responses yang lebih bervariasi
    const defaultResponses = [
        "Halo! Terima kasih telah menghubungi kami. Tim customer service siap membantu Anda melalui WhatsApp di 0812-3456-7890. Ada yang bisa saya bantu? 😊",

        "Pertanyaan Anda sangat penting bagi kami! Untuk bantuan lebih detail, silakan hubungi customer service kami di WhatsApp 0812-3456-7890 (24/7). 🙏",

        "Tim support kami siap membantu Anda kapan saja melalui WhatsApp 0812-3456-7890. Jam operasional toko: 08:00-22:00 WIB. Ada pertanyaan lain? 💬",

        "Saya akan bantu sebisa mungkin! Untuk informasi lebih lengkap tentang produk dan layanan, hubungi WhatsApp CS kami di 0812-3456-7890. 🛍️",
    ];

    return defaultResponses[
        Math.floor(Math.random() * defaultResponses.length)
    ];
}
