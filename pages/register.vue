<!-- pages/login.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div
            class="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden flex"
        >
            <!-- Bagian kanan (putih) -->
            <div class="w-3/5 p-8">
                <div class="max-w-md mx-auto">
                    <h2
                        class="text-3xl flex justify-center mx-auto font-bold mb-8"
                    >
                        Register
                    </h2>

                    <form @submit.prevent="handleRegister">
                        <!-- Username input -->
                        <div class="mb-4">
                            <div class="relative">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    class="w-full py-3 px-4 pr-10 bg-gray-100 rounded-md focus:outline-none"
                                />
                                <div
                                    class="absolute right-3 top-3 text-gray-500"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                        ></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Email Input -->
                        <div class="mb-4">
                            <div class="relative">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    class="w-full py-3 px-4 pr-10 bg-gray-100 rounded-md focus:outline-none"
                                />
                                <div
                                    class="absolute right-3 top-3 text-gray-500"
                                >
                                    <AiOutlineMail class="w-[20px] h-[20px]" />
                                </div>
                            </div>
                        </div>

                        <!-- Password input -->
                        <div class="mb-4">
                            <div class="relative">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    class="w-full py-3 px-4 pr-10 bg-gray-100 rounded-md focus:outline-none"
                                />
                                <div
                                    class="absolute right-3 top-3 text-gray-500"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <path
                                            d="M7 11V7a5 5 0 0 1 10 0v4"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Confirm Password -->
                        <div class="mb-2">
                            <div class="relative">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    class="w-full py-3 px-4 pr-10 bg-gray-100 rounded-md focus:outline-none"
                                />
                                <div
                                    class="absolute right-3 top-3 text-gray-500"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <path
                                            d="M7 11V7a5 5 0 0 1 10 0v4"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Forgot Password link -->
                        

                        <!-- Login button -->
                        <button
                            type="submit"
                            class="w-full bg-[#6366f1] text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Register
                        </button>

                        <!-- Social Register divider -->
                       

                      
                     
                    </form>
                </div>
            </div>

            <!-- Bagian kiri (biru) -->
            <div
                class="w-3/5 bg-[#6366f1] text-white flex flex-col items-center justify-center p-8 rounded-l-3xl rounded-l-[100px]"
            >
                <h1 class="text-3xl font-bold mb-2 flex items-center">
                    <BiSolidShoppingBags class="w-[60px] h-[60px]" /> NUVELLA
                </h1>
                <p class="text-sm mb-8">Don't have an account?</p>
                <NuxtLink to="/login">
                    <button
                        class="border border-white text-white py-2 px-8 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                        Login
                    </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { AiOutlineMail } from "vue-icons-plus/ai";
import { BiSolidShoppingBags } from "vue-icons-plus/bi";
</script>
