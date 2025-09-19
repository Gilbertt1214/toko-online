<script setup>
import { BiSolidShoppingBags } from "vue-icons-plus/bi";
import { BsCart4, BsChatDots, BsSearch } from "vue-icons-plus/bs"; 
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
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
const cartStore = useCartStore();

// Search functionality
const searchQuery = ref('');
const searchResults = ref([]);
const showSearchResults = ref(false);
const searchLoading = ref(false);
const searchInputRef = ref(null);

// Debounced search
const searchProducts = async (query) => {
  if (!query || query.length < 2) {
    searchResults.value = [];
    showSearchResults.value = false;
    return;
  }

  searchLoading.value = true;
  showSearchResults.value = true;

  try {
    // Simulate API call with debounce
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();
    searchResults.value = data.products;
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
  } finally {
    searchLoading.value = false;
  }
};

// Debounce search input
const debouncedSearch = debounce(searchProducts, 300);

const handleSearchInput = (event) => {
  searchQuery.value = event.target.value;
  debouncedSearch(searchQuery.value);
};

const selectSearchResult = (product) => {
  searchQuery.value = '';
  searchResults.value = [];
  showSearchResults.value = false;
  router.push(`/product/${product.id}`);
};

const handleSearchSubmit = () => {
  if (searchQuery.value.trim()) {
    router.push(`/product?search=${encodeURIComponent(searchQuery.value.trim())}`);
    searchQuery.value = '';
    searchResults.value = [];
    showSearchResults.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  showSearchResults.value = false;
};

// Close search results when clicking outside
const handleClickOutside = (event) => {
  if (searchInputRef.value && !searchInputRef.value.contains(event.target)) {
    showSearchResults.value = false;
  }
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format price for search results
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price * 15000);
};

const handleLogout = () => {
    user.value = null;
    localStorage.removeItem("user");
    router.push("/");
};

// Load cart and set up click outside listener
onMounted(() => {
  cartStore.loadFromLocalStorage();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <header class="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-30 shadow-lg">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center h-20">
                <!-- Logo with enhanced styling -->
                <NuxtLink to="/" class="flex items-center">
                    <div class="flex items-center bg-white rounded-full p-2 shadow-md transform hover:scale-105 transition-transform duration-300">
                        <BiSolidShoppingBags class="w-[35px] h-[35px] text-indigo-600" />
                    </div>
                    <h1 class="text-2xl font-extrabold ml-2 text-white tracking-wider">
                        NUVELLA
                    </h1>
                </NuxtLink>

                <!-- Search Bar -->
                <div class="flex-1 max-w-2xl mx-8 relative" ref="searchInputRef">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           
                        </div>
                        <input
                            v-model="searchQuery"
                            @input="handleSearchInput"
                            @keyup.enter="handleSearchSubmit"
                            @focus="showSearchResults = searchResults.length > 0"
                            type="text"
                            placeholder="Cari produk di Nuvella..."
                            class="block w-full pl-12 pr-12 py-3 border border-white/20 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center">
                            <!-- Clear button -->
                            <button
                                v-if="searchQuery"
                                @click="clearSearch"
                                class="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            <!-- Search button -->
                            <button
                                @click="handleSearchSubmit"
                                class="mr-1 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
                            >
                                <BsSearch class="h-4 w-4 text-white" />
                            </button>
                        </div>
                    </div>

                    <!-- Search Results Dropdown -->
                    <div
                        v-if="showSearchResults"
                        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
                    >
                        <!-- Loading State -->
                        <div v-if="searchLoading" class="p-4 text-center">
                            <div class="inline-flex items-center">
                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                <span class="ml-2 text-gray-600">Mencari produk...</span>
                            </div>
                        </div>

                        <!-- Search Results -->
                        <div v-else-if="searchResults.length > 0" class="py-2">
                            <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                                Hasil Pencarian
                            </div>
                            <div
                                v-for="product in searchResults"
                                :key="product.id"
                                @click="selectSearchResult(product)"
                                class="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                            >
                                <!-- Product Image -->
                                <img
                                    :src="product.thumbnail"
                                    :alt="product.title"
                                    class="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                    @error="$event.target.src = 'https://via.placeholder.com/48x48?text=No+Image'"
                                />
                                
                                <!-- Product Info -->
                                <div class="ml-3 flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">
                                        {{ product.title }}
                                    </p>
                                    <p class="text-xs text-gray-500 truncate">
                                        {{ product.category }}
                                    </p>
                                    <p class="text-sm font-semibold text-indigo-600">
                                        {{ formatPrice(product.price) }}
                                    </p>
                                </div>

                                <!-- Rating -->
                                <div class="flex items-center ml-2">
                                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span class="text-xs text-gray-500 ml-1">{{ product.rating }}</span>
                                </div>
                            </div>
                            
                            <!-- View All Results -->
                            <div class="px-4 py-3 border-t bg-gray-50">
                                <button
                                    @click="handleSearchSubmit"
                                    class="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Lihat semua hasil untuk "{{ searchQuery }}"
                                </button>
                            </div>
                        </div>

                        <!-- No Results -->
                        <div v-else-if="searchQuery.length >= 2" class="p-4 text-center">
                            <div class="text-gray-500">
                                <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <p class="text-sm">Tidak ada produk ditemukan</p>
                                <p class="text-xs text-gray-400 mt-1">Coba kata kunci yang berbeda</p>
                            </div>
                        </div>

                        <!-- Search Suggestions -->
                        <div v-else class="p-4">
                            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Saran Pencarian
                            </div>
                            <div class="space-y-1">
                                <button
                                    v-for="suggestion in ['iPhone', 'Samsung', 'Laptop', 'Headphone', 'Beauty']"
                                    :key="suggestion"
                                    @click="searchQuery = suggestion; debouncedSearch(suggestion)"
                                    class="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                >
                                    {{ suggestion }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="flex justify-end items-center gap-6">
                    <!-- Navigation Links with hover effects -->
                    

                    <!-- Right side of Navbar -->
                    <div class="flex items-center space-x-5">
                   
                      

                        <!-- Cart Icon -->
                        <NuxtLink to="/cart" class="relative">
                            <div class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300">
                                <BsCart4 class="w-6 h-6 text-white" />
                            </div>
                            <!-- Cart count indicator -->
                            <span
                                v-if="cartStore.totalItems > 0"
                                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            >
                                {{ cartStore.totalItems }}
                            </span>
                        </NuxtLink>

                        <template v-if="user">
                            <!-- User dropdown with enhanced styling -->
                            <div class="relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <div class="relative">
                                            <img
                                                :src="user.photoURL || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'"
                                                alt="User Icon"
                                                class="w-11 h-11 rounded-full cursor-pointer border-2 border-white hover:border-yellow-300 transition-all duration-300"
                                            />
                                            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent class="w-52 mt-2">
                                        <DropdownMenuLabel class="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                                            <div class="font-semibold text-indigo-700">
                                                {{ user.name }}
                                            </div>
                                            <div class="text-xs text-gray-500 mt-1">
                                                {{ user.email || "user@example.com" }}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem class="hover:bg-indigo-50 cursor-pointer">
                                                <span class="text-indigo-700">Dashboard</span>
                                            </DropdownMenuItem>
                                            <NuxtLink to="/profile">
                                                <DropdownMenuItem class="hover:bg-indigo-50 cursor-pointer">
                                                    <span class="text-indigo-700">Profile</span>
                                                </DropdownMenuItem>
                                            </NuxtLink>
                                            <DropdownMenuItem
                                                @click="handleLogout"
                                                class="hover:bg-red-50 cursor-pointer"
                                            >
                                                <span class="text-red-600">Logout</span>
                                                <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
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
                        </template>
                    </div>
                </section>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* Custom scrollbar for search results */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* DropdownMenuContent: buat background solid dan hilangkan transparansi */
:deep(.dropdown-menu__content),
:deep(.dropdown-menu-content),
:deep(.DropdownMenuContent),
:deep(.w-52.mt-2),
:deep([data-radix-popper-content-wrapper] > div),
:deep(.bg-white\/80),
:deep(.bg-white\/90),
:deep(.bg-white\/70) {
  background: #fff !important;
  background-color: #fff !important;
  opacity: 1 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 1.5px 4px rgba(0,0,0,0.08) !important;
  border: 1px solid #e5e7eb !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  filter: none !important;
}

/* Hilangkan transparansi pada label dan item jika ada */
:deep(.dropdown-menu__label),
:deep(.dropdown-menu__item),
:deep(.DropdownMenuLabel),
:deep(.DropdownMenuItem) {
  background: transparent !important;
  opacity: 1 !important;
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Animation for search results */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-results-enter-active {
  animation: fadeInDown 0.3s ease-out;
}
</style>