<!-- pages/login.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div
            class="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden flex"
        >
            <!-- Bagian kiri (biru) -->
            <div
                class="w-3/5 bg-[#6366f1] text-white flex flex-col items-center justify-center p-8 rounded-l-3xl rounded-r-[100px]"
            >
                <h1 class="text-3xl font-bold mb-2 flex items-center">
                    <BiSolidShoppingBags class="w-[60px] h-[60px]" /> NUVELLA
                </h1>
                <p class="text-sm mb-8">Don't have an account?</p>
                <NuxtLink to="/register">
                    <button
                        class="border border-white text-white py-2 px-8 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Register
                    </button>
                </NuxtLink>
            </div>

            <!-- Bagian kanan (putih) -->
            <div class="w-3/5 p-8">
                <div class="max-w-md mx-auto">
                    <h2
                        class="text-3xl flex justify-center mx-auto font-bold mb-8"
                    >
                        Login
                    </h2>

                    <form @submit.prevent="handleLogin">
                        <!-- Username input -->
                        <div class="mb-4">
                            <div class="relative">
                                <input
                                    v-model="username"
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

                        <!-- Password input -->
                        <div class="mb-2">
                            <div class="relative">
                                <input
                                    v-model="password"
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

                        <!-- Forgot Password link -->
                        <div class="text-right mb-6">
                            <a
                                href="#"
                                class="text-gray-500 text-sm hover:text-blue-500"
                                >Forgot Password?</a
                            >
                        </div>

                        <!-- Login button -->
                        <button
                            type="submit"
                            class="w-full bg-[#6366f1] text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Login
                        </button>

                        <!-- Social login divider -->
                        <div class="flex items-center my-6">
                            <div
                                class="flex-grow border-t border-gray-200"
                            ></div>
                            <span class="mx-4 text-gray-500 text-sm"
                                >or login with social platforms</span
                            >
                            <div
                                class="flex-grow border-t border-gray-200"
                            ></div>
                        </div>

                        <!-- Social icons -->
                        <div class="flex justify-center space-x-4">
                            <a
                                href="#"
                                class="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50"
                            >
                                <AiFillGithub />
                            </a>
                            <a
                                href="#"
                                class="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50"
                            >
                                <BsTwitterX />
                            </a>
                            <a
                                @click.prevent="signInWithGoogle"
                                href="#"
                                class="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50"
                            >
                                <FcGoogle />
                            </a>
                            <a
                                href="#"
                                class="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50"
                            >
                                <AiFillLinkedin />
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { BiSolidShoppingBags } from "vue-icons-plus/bi";
import { FcGoogle } from "vue-icons-plus/fc";
import { AiFillGithub } from "vue-icons-plus/ai";
import { BsTwitterX } from "vue-icons-plus/bs";
import { AiFillLinkedin } from "vue-icons-plus/ai";
import { useRouter } from "vue-router";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "~/composables/useAuth";
const { $auth, $provider } = useNuxtApp();

// Variabel untuk form
const username = ref("");
const password = ref("");
const router = useRouter();

console.log("Result:", result.value);

// Fungsi untuk handle login biasa
const handleLogin = () => {
    // Implementasi login dengan username/password
    console.log(
        "Login dengan username:",
        username.value,
        "dan password:",
        password.value
    );
    // Tambahkan logika autentikasi di sini
};

// Fungsi untuk sign in dengan Google
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup($auth, $provider);

        const userState = useAuth();
        userState.value = {
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
        };

        // Redirect ke homepage setelah login berhasil
        router.replace("/");
    } catch (error) {
        console.error("Error saat login dengan Google:", error);
        // Tambahkan handling error yang sesuai
    }
};
</script>
