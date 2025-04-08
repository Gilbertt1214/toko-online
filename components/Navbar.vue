<template>
    <div>
        <!-- Top bar for announcements, language, currency options -->
        <div class="bg-indigo-600 text-white px-4 py-2 text-sm">
            <div class="max-w-6xl mx-auto flex justify-between items-center">
                <p class="font-medium">
                    🎉 Gratis ongkir untuk pembelian di atas Rp300.000
                </p>
                <div class="flex items-center space-x-4">
                    <a href="#" class="hover:text-indigo-200 transition"
                        >Hubungi Kami</a
                    >
                    <div class="relative group">
                        <button
                            class="flex items-center hover:text-indigo-200 transition"
                        >
                            ID
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                        <div
                            class="absolute z-10 right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 hidden group-hover:block"
                        >
                            <a
                                href="#"
                                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >Indonesia</a
                            >
                            <a
                                href="#"
                                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >English</a
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Navbar -->
        <header class="bg-white shadow-md sticky top-0 z-30">
            <div class="max-w-6xl mx-auto px-4">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo and Brand -->
                    <div class="flex items-center">
                        <NuxtLink
                            to="/"
                            class="flex items-center text-[#6366f1]"
                        >
                            <h1
                                class="text-2xl font-bold mb-2 flex items-center"
                            >
                                <BiSolidShoppingBags
                                    class="w-[40px] h-[40px]"
                                />
                                NUVELLA
                            </h1>
                        </NuxtLink>
                    </div>

                    <!-- Search Bar - Hidden on mobile -->
                    <div class="hidden md:flex flex-1 mx-8">
                        <div class="relative w-full max-w-xl">
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <!-- Button Login and button register -->
                    <div class="hidden md:flex items-center space-x-4">
                        <NuxtLink
                            to="/login"
                            class="text-gray-700 border px-4 py-2 rounded-lg hover:text-indigo-600 transition"
                            >Masuk</NuxtLink
                        >
                        <NuxtLink
                            to="/register"
                            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >Daftar</NuxtLink
                        >
                    </div>
                </div>

                <!-- Category Menu -->
            </div>
        </header>
    </div>
</template>

<script setup>
// Tambahkan logika jika diperlukan

import { BiSolidShoppingBags } from "vue-icons-plus/bi";
</script>
