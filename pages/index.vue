<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Hero Section with Gradient Background -->
        <div
            class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 mb-16"
        >
            <div class="absolute inset-0 opacity-10">
                <svg
                    class="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path d="M0 0 L100 0 L100 100 Z" fill="white"></path>
                </svg>
            </div>
            <div
                class="relative z-10 py-16 px-6 sm:px-12 text-center text-white"
            >
                <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
                    Selamat Datang di Toko Online
                </h1>
                 <span v-if="user">
        👤 {{ user.displayName || user.email }}
      </span>
                <p
                    class="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8"
                >
                    Temukan produk terbaik pilihan kami dengan kualitas premium
                    dan harga terjangkau!
                </p>

                <NuxtLink
                    to="/product"
                    class="inline-block bg-white text-blue-700 font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                >
                    Lihat Katalog Produk
                </NuxtLink>
            </div>
        </div>

        <!-- Featured Products Carousel Placeholder -->
        <div class="mb-16 rounded-2xl h-[700px] overflow-hidden shadow-lg bg-gray-100">
            <img
                src="/assets/image/baner.jpeg"
                alt="Hero Banner"
                class="w-full h-[700px]   object-fill  object-center"
            />
        </div>

        <!-- Features Section with Icons -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div
                class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500 flex flex-col items-center text-center"
            >
                <div class="bg-blue-100 p-3 rounded-full mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2 text-gray-800">
                    Gratis Ongkir
                </h3>
                <p class="text-gray-600">
                    Nikmati pengiriman gratis untuk wilayah tertentu dengan
                    minimal pembelian.
                </p>
            </div>

            <div
                class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500 flex flex-col items-center text-center"
            >
                <div class="bg-blue-100 p-3 rounded-full mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2 text-gray-800">
                    Pembayaran Aman
                </h3>
                <p class="text-gray-600">
                    Didukung oleh sistem pembayaran terpercaya dengan enkripsi
                    data terkini.
                </p>
            </div>

            <div
                class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500 flex flex-col items-center text-center"
            >
                <div class="bg-blue-100 p-3 rounded-full mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2 text-gray-800">
                    Dukungan 24/7
                </h3>
                <p class="text-gray-600">
                    Layanan pelanggan siap membantu kapan saja untuk menjawab
                    segala pertanyaan Anda.
                </p>
            </div>
        </div>

        <!-- Call to Action -->
        <div
            class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl"
        >
            <h2 class="text-3xl font-bold mb-4">
                Dapatkan Diskon 10% untuk Pembelian Pertama
            </h2>
            <p class="text-lg mb-6 max-w-2xl mx-auto">
                Gunakan kode
                <span class="font-bold bg-white bg-opacity-20 px-2 py-1 rounded"
                    >FIRSTBUY</span
                >
                saat checkout dan nikmati potongan harga untuk produk pilihan!
            </p>
            <NuxtLink
                to="/product"
                class="inline-block bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-50 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
                Mulai Berbelanja Sekarang
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>

useHead({
    title: "Toko Online | Home",
    meta: [
        {
            name: "description",
            content:
                "Selamat datang di toko online kami. Temukan produk terbaik dengan harga terjangkau dan pelayanan maksimal.",
        },
    ],
});
</script>
