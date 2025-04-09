<script setup>
import { BiSolidShoppingBags } from "vue-icons-plus/bi";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const user = useAuth();
const router = useRouter();

const handleLogout = () => {
    user.value = null;
    router.push("/");
};
</script>

<template>
    <header class="bg-white shadow-md sticky top-0 z-30">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center text-[#6366f1]">
                    <h1 class="text-2xl font-bold flex items-center">
                        <BiSolidShoppingBags class="w-[40px] h-[40px]" />
                        NUVELLA
                    </h1>
                </NuxtLink>

                <!-- Bagian kanan Navbar -->
                <div class="flex items-center space-x-4">
                    <template v-if="user">
                        <!-- Tampilkan foto atau icon user -->
                        <div class="relative group">
                            <img
                                :src="
                                    user.photoURL ||
                                    'https://ui-avatars.com/api/?name=User'
                                "
                                alt="User Icon"
                                class="w-10 h-10 rounded-full cursor-pointer border"
                            />
                            <!-- Dropdown jika ingin -->
                            <div
                                class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md py-2 hidden group-hover:block z-50"
                            >
                                <p class="px-4 py-2 text-sm text-gray-600">
                                    {{ user.name || "User" }}
                                </p>
                                <button
                                    @click="handleLogout"
                                    class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <NuxtLink
                            to="/login"
                            class="text-gray-700 hover:text-indigo-500"
                        >
                            Login
                        </NuxtLink>
                        <NuxtLink
                            to="/register"
                            class="text-gray-700 hover:text-indigo-500"
                        >
                            Register
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </div>
    </header>
</template>
