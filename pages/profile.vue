<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-4">
            <div class="max-w-6xl mx-auto">
                <h1 class="text-3xl font-bold text-white">My Account</h1>
                <div class="flex items-center mt-2 text-white/80">
                    <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
                    <span class="mx-2">›</span>
                    <span>Account</span>
                </div>
            </div>
        </div>

        <!-- Profile Content -->
        <div class="max-w-6xl mx-auto px-4 py-10">
            <div v-if="user" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Left Sidebar -->
                <div class="md:col-span-1">
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div
                            class="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-center"
                        >
                            <div class="inline-block relative mb-4">
                                <img
                                    v-if="user.photoURL"
                                    :src="user.photoURL"
                                    alt="Profile Photo"
                                    class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />

                                <div
                                    class="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"
                                ></div>
                            </div>
                            <h2 class="text-xl font-bold text-white">
                                {{ user.name || "User" }}
                            </h2>
                            <p class="text-white/80 text-sm mt-1">
                                {{ user.email }}
                            </p>
                        </div>

                        <div class="p-2">
                            <button
                                class="w-full p-3 hover:bg-indigo-50 rounded-lg flex items-center space-x-3 transition-colors mb-1 bg-indigo-100 text-indigo-800"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span class="font-medium">My Profile</span>
                            </button>

                            <button
                                class="w-full p-3 hover:bg-indigo-50 rounded-lg flex items-center space-x-3 transition-colors mb-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                <span>Order History</span>
                            </button>

                            <button
                                class="w-full p-3 hover:bg-indigo-50 rounded-lg flex items-center space-x-3 transition-colors mb-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span>Wishlist</span>
                            </button>

                            <button
                                class="w-full p-3 hover:bg-indigo-50 rounded-lg flex items-center space-x-3 transition-colors mb-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Payment Methods</span>
                            </button>

                            <button
                                class="w-full p-3 hover:bg-indigo-50 rounded-lg flex items-center space-x-3 transition-colors mb-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                <span>Delete Account</span>
                            </button>

                            <button
                                @click="handleLogout"
                                class="w-full p-3 hover:bg-red-50 rounded-lg flex items-center space-x-3 transition-colors text-red-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    <!-- Member Stats Card -->
                    <div
                        class="bg-white rounded-xl shadow-md overflow-hidden mt-6"
                    >
                        <div class="p-6">
                            <h3
                                class="text-lg font-semibold text-gray-800 mb-4"
                            >
                                Account Statistics
                            </h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div
                                    class="text-center p-3 bg-purple-50 rounded-lg"
                                >
                                    <div
                                        class="text-2xl font-bold text-purple-600"
                                    >
                                        5
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Orders
                                    </div>
                                </div>
                                <div
                                    class="text-center p-3 bg-indigo-50 rounded-lg"
                                >
                                    <div
                                        class="text-2xl font-bold text-indigo-600"
                                    >
                                        2
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Reviews
                                    </div>
                                </div>
                                <div
                                    class="text-center p-3 bg-pink-50 rounded-lg"
                                >
                                    <div
                                        class="text-2xl font-bold text-pink-600"
                                    >
                                        8
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Wishlisted
                                    </div>
                                </div>
                                <div
                                    class="text-center p-3 bg-blue-50 rounded-lg"
                                >
                                    <div
                                        class="text-2xl font-bold text-blue-600"
                                    >
                                        750
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Points
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Content - Edit Profile Form -->
                <div class="md:col-span-2">
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="p-6 border-b">
                            <h2 class="text-xl font-bold text-gray-800">
                                Profile Information
                            </h2>
                            <p class="text-gray-500 text-sm mt-1">
                                Update your account information
                            </p>
                        </div>

                        <form @submit.prevent="saveProfile" class="p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- First Name -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >First Name</label
                                    >
                                    <input
                                        type="text"
                                        v-model="profile.firstName"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="John"
                                    />
                                </div>

                                <!-- Last Name -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Last Name</label
                                    >
                                    <input
                                        type="text"
                                        v-model="profile.lastName"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="Doe"
                                    />
                                </div>

                                <!-- Email -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Email Address</label
                                    >
                                    <input
                                        type="email"
                                        v-model="profile.email"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
                                        disabled
                                    />
                                </div>

                                <!-- Phone -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Phone Number</label
                                    >
                                    <input
                                        type="tel"
                                        v-model="profile.phone"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="+62 812-3456-7890"
                                    />
                                </div>

                                <!-- Birthday -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Birthday</label
                                    >
                                    <input
                                        type="date"
                                        v-model="profile.birthday"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <!-- Gender -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Gender</label
                                    >
                                    <select
                                        v-model="profile.gender"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">
                                            Prefer not to say
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Address -->
                            <div class="mt-6">
                                <h3
                                    class="text-lg font-semibold text-gray-800 mb-4"
                                >
                                    Address Information
                                </h3>

                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <!-- Street Address -->
                                    <div class="md:col-span-2">
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                            >Street Address</label
                                        >
                                        <input
                                            type="text"
                                            v-model="profile.address.street"
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Jl. Sudirman No. 123"
                                        />
                                    </div>

                                    <!-- City -->
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                            >City</label
                                        >
                                        <input
                                            type="text"
                                            v-model="profile.address.city"
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Jakarta"
                                        />
                                    </div>

                                    <!-- Province -->
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                            >Province</label
                                        >
                                        <input
                                            type="text"
                                            v-model="profile.address.province"
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="DKI Jakarta"
                                        />
                                    </div>

                                    <!-- Postal Code -->
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                            >Postal Code</label
                                        >
                                        <input
                                            type="text"
                                            v-model="profile.address.postalCode"
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="12345"
                                        />
                                    </div>

                                    <!-- Country -->
                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                            >Country</label
                                        >
                                        <select
                                            v-model="profile.address.country"
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="Indonesia">
                                                Indonesia
                                            </option>
                                            <option value="Malaysia">
                                                Malaysia
                                            </option>
                                            <option value="Singapore">
                                                Singapore
                                            </option>
                                            <option value="Thailand">
                                                Thailand
                                            </option>
                                            <option value="Vietnam">
                                                Vietnam
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Newsletter & Preferences -->
                            <div class="mt-6">
                                <h3
                                    class="text-lg font-semibold text-gray-800 mb-4"
                                >
                                    Preferences
                                </h3>

                                <div class="space-y-3">
                                    <div class="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="newsletter"
                                            v-model="
                                                profile.preferences.newsletter
                                            "
                                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                                        />
                                        <label
                                            for="newsletter"
                                            class="ml-2 text-sm text-gray-700"
                                            >Subscribe to newsletter</label
                                        >
                                    </div>

                                    <div class="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="sms"
                                            v-model="profile.preferences.sms"
                                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                                        />
                                        <label
                                            for="sms"
                                            class="ml-2 text-sm text-gray-700"
                                            >Receive SMS notifications</label
                                        >
                                    </div>

                                    <div class="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="promotions"
                                            v-model="
                                                profile.preferences.promotions
                                            "
                                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                                        />
                                        <label
                                            for="promotions"
                                            class="ml-2 text-sm text-gray-700"
                                            >Receive special promotions and
                                            discounts</label
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- Save Button -->
                            <div class="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Recent Orders -->
                    <div
                        class="bg-white rounded-xl shadow-md overflow-hidden mt-6"
                    >
                        <div class="p-6 border-b">
                            <h2 class="text-xl font-bold text-gray-800">
                                Recent Orders
                            </h2>
                            <p class="text-gray-500 text-sm mt-1">
                                Your latest purchases
                            </p>
                        </div>

                        <div class="p-6">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Order ID
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Date
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="bg-white divide-y divide-gray-200"
                                >
                                    <tr
                                        v-for="(order, index) in recentOrders"
                                        :key="index"
                                    >
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600"
                                        >
                                            #{{ order.id }}
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            {{ order.date }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span
                                                :class="`px-2 py-1 text-xs rounded-full ${getStatusClass(
                                                    order.status
                                                )}`"
                                            >
                                                {{ order.status }}
                                            </span>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                        >
                                            Rp
                                            {{ order.total.toLocaleString() }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="mt-4 text-center">
                                <a
                                    href="#"
                                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >View All Orders →</a
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
                <div
                    class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-10 w-10 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    Not Logged In
                </h2>
                <p class="text-gray-600 mb-6">
                    You need to login to access your profile information.
                </p>
                <div class="flex justify-center space-x-4">
                    <NuxtLink
                        to="/login"
                        class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Login Now
                    </NuxtLink>
                    <NuxtLink
                        to="/register"
                        class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Register
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref, reactive } from "vue";
import { useAuth } from "~/composables/useAuth";

// User data from localStorage
const user = useAuth();

const router = useRouter();

// Profile form data
const profile = reactive({
    firstName: user.value?.name?.split(" ")[0] || "",
    lastName: user.value?.name?.split(" ")[1] || "",
    email: user.value?.email || "",
    phone: "",
    birthday: "",
    gender: "",
    address: {
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Indonesia",
    },
    preferences: {
        newsletter: true,
        sms: false,
        promotions: true,
    },
});

// Mock recent orders data
const recentOrders = [
    { id: "1092786", date: "04 Apr 2025", status: "Delivered", total: 850000 },
    {
        id: "1092654",
        date: "28 Mar 2025",
        status: "Processing",
        total: 1250000,
    },
    { id: "1092543", date: "15 Mar 2025", status: "Shipped", total: 450000 },
    { id: "1092432", date: "02 Mar 2025", status: "Delivered", total: 750000 },
];

// Helper function for order status styling
const getStatusClass = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-800";
        case "Processing":
            return "bg-blue-100 text-blue-800";
        case "Shipped":
            return "bg-yellow-100 text-yellow-800";
        case "Cancelled":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

// Middleware to check if user is logged in
onMounted(() => {
    if (!user.value) {
        router.push("/login");
    }
});

// Form submission handler
const saveProfile = () => {
    // Here you would typically send this data to your backend
    alert("Profile information saved successfully!");

    // Update user name in localStorage if changed
    if (user.value) {
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        if (fullName && fullName !== user.value.name) {
            user.value.name = fullName;
            localStorage.setItem("user", JSON.stringify(user.value));
        }
    }
};

const handleLogout = () => {
    user.value = null;
    localStorage.removeItem("user");
    router.push("/");
};
</script>
