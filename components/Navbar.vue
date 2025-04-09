<script setup>
import { BiSolidShoppingBags } from "vue-icons-plus/bi";
import { BsCart4, BsChatDots } from "vue-icons-plus/bs"; // Import cart and chat icons
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const user = useAuth();
const router = useRouter();

// You might want to add cart functionality here
const cartCount = ref(0); // For cart item count display

const handleLogout = () => {
    user.value = null;
    localStorage.removeItem("user");
    router.push("/");
};
</script>

<template>
    <header
        class="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-30 shadow-lg"
    >
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center h-20">
                <!-- Logo with enhanced styling -->
                <NuxtLink to="/" class="flex items-center">
                    <div
                        class="flex items-center bg-white rounded-full p-2 shadow-md transform hover:scale-105 transition-transform duration-300"
                    >
                        <BiSolidShoppingBags
                            class="w-[35px] h-[35px] text-indigo-600"
                        />
                    </div>
                    <h1
                        class="text-2xl font-extrabold ml-2 text-white tracking-wider"
                    >
                        NUVELLA
                    </h1>
                </NuxtLink>

                <section class="flex justify-end items-center gap-10 w-full">
                    <!-- Navigation Links with hover effects -->
                    <div class="flex items-center space-x-6">
                        <NuxtLink
                            to="/"
                            class="flex items-center text-white opacity-90 hover:opacity-100 relative group"
                        >
                            <h4 class="text-lg font-medium flex items-center">
                                Home
                            </h4>
                            <span
                                class="absolute -bottom-2 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                            ></span>
                        </NuxtLink>
                        <NuxtLink
                            to="/product"
                            class="flex items-center text-white opacity-90 hover:opacity-100 relative group"
                        >
                            <h4 class="text-lg font-medium flex items-center">
                                Produk
                            </h4>
                            <span
                                class="absolute -bottom-2 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                            ></span>
                        </NuxtLink>
                    </div>

                    <!-- Right side of Navbar -->
                    <div class="flex items-center space-x-5">
                        <!-- Chat Icon -->
                        <NuxtLink to="/chat" class="relative">
                            <div
                                class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                            >
                                <BsChatDots class="w-6 h-6 text-white" />
                            </div>
                            <!-- Optional notification indicator -->
                            <span
                                class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold"
                                >2</span
                            >
                        </NuxtLink>

                        <!-- Cart Icon -->
                        <NuxtLink to="/cart" class="relative">
                            <div
                                class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                            >
                                <BsCart4 class="w-6 h-6 text-white" />
                            </div>
                            <!-- Cart count indicator -->
                            <span
                                v-if="cartCount > 0"
                                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                >{{ cartCount }}</span
                            >
                        </NuxtLink>

                        <template v-if="user">
                            <!-- User dropdown with enhanced styling -->
                            <div class="relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <div class="relative">
                                            <img
                                                :src="
                                                    user.photoURL ||
                                                    'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
                                                "
                                                alt="User Icon"
                                                class="w-11 h-11 rounded-full cursor-pointer border-2 border-white hover:border-yellow-300 transition-all duration-300"
                                            />
                                            <div
                                                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            ></div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent class="w-52 mt-2">
                                        <DropdownMenuLabel
                                            class="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50"
                                        >
                                            <div
                                                class="font-semibold text-indigo-700"
                                            >
                                                {{ user.name }}
                                            </div>
                                            <div
                                                class="text-xs text-gray-500 mt-1"
                                            >
                                                {{
                                                    user.email ||
                                                    "user@example.com"
                                                }}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                class="hover:bg-indigo-50 cursor-pointer"
                                            >
                                                <span class="text-indigo-700"
                                                    >Dashboard</span
                                                >
                                            </DropdownMenuItem>

                                            <NuxtLink to="/profile">
                                                <DropdownMenuItem
                                                    class="hover:bg-indigo-50 cursor-pointer"
                                                >
                                                    <span
                                                        class="text-indigo-700"
                                                        >Profile</span
                                                    >
                                                </DropdownMenuItem>
                                            </NuxtLink>
                                            <DropdownMenuItem
                                                @click="handleLogout"
                                                class="hover:bg-red-50 cursor-pointer"
                                            >
                                                <span class="text-red-600"
                                                    >Logout</span
                                                >
                                                <DropdownMenuShortcut
                                                    >⌘L</DropdownMenuShortcut
                                                >
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </template>

                        <template v-else>
                            <!-- Login/Register buttons with enhanced styling -->
                            <NuxtLink
                                to="/login"
                                class="text-white border border-white/30 px-4 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
                            >
                                Login
                            </NuxtLink>
                            <NuxtLink
                                to="/register"
                                class="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-yellow-300 hover:text-indigo-700 transition-all duration-300 shadow-md"
                            >
                                Register
                            </NuxtLink>
                        </template>
                    </div>
                </section>
            </div>
        </div>
    </header>
</template>
