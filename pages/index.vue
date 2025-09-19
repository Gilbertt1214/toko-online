<script setup>
import { ref, onMounted, computed, watch } from "vue";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ChatPopup from '~/components/ChatPopup.vue' 

// Meta dan SEO
useSeoMeta({
    title: 'Toko Online Nuxt - Home',
    description: 'Toko online terbaik dengan berbagai produk berkualitas dan AI chat support'
})

// ===========================================
// CHAT INITIALIZATION
// ===========================================
const chat = ref(null)
const chatInitialized = ref(false)
const showChat = ref(false)

const toggleChat = () => {
  showChat.value = !showChat.value
}

// Initialize chat composable
const initializeChat = async () => {
    if (process.client && !chatInitialized.value) {
        try {
            const { useChat } = await import("~/composables/useChat")
            chat.value = useChat()
            chatInitialized.value = true
            console.log('Chat initialized successfully')
        } catch (error) {
            console.error("Failed to initialize chat:", error)
        }
    }
}

// Chat computed properties
const isChatEnabled = computed(() => chat.value?.isEnabled?.value || false)

// ===========================================
// SHOPPING CART
// ===========================================
const cart = ref([])
const showBuyModal = ref(false)
const selectedProduct = ref(null)






// Buy now function
const buyNow = (product) => {
    selectedProduct.value = product
    showBuyModal.value = true
}

// Handle purchase
const handlePurchase = () => {
    if (!selectedProduct.value) return
    
    addToCart(selectedProduct.value)
    alert(`Pembelian ${selectedProduct.value.title} berhasil! Mengarahkan ke checkout...`)
    
    showBuyModal.value = false
    selectedProduct.value = null
}

// Close buy modal
const closeBuyModal = () => {
    showBuyModal.value = false
    selectedProduct.value = null
}

// ===========================================
// CAROUSEL SETUP
// ===========================================
const autoplay = Autoplay({
    delay: 3000,
    stopOnInteraction: true,
})

// Import gambar carousel
import image1 from "~/assets/image/1.png"
import image2 from "~/assets/image/2.png"
import image3 from "~/assets/image/3.png"

const carouselImages = ref([
    { src: image1, alt: "Banner Promo 1" },
    { src: image2, alt: "Banner Promo 2" },
    { src: image3, alt: "Banner Promo 3" },
])

// ===========================================
// PRODUCT DATA & FILTERING
// ===========================================
const categories = ref([
    { id: "all", name: "All Categories" },
    { id: "laptops", name: "Laptops" },
    { id: "fragrances", name: "Fragrances" },
    { id: "groceries", name: "Groceries" },
    { id: "home-decoration", name: "Home Decoration" },
    { id: "furniture", name: "Furniture" },
    { id: "womens-dresses", name: "Women's Dresses" },
    { id: "mens-shirts", name: "Men's Shirts" },
    { id: "mens-shoes", name: "Men's Shoes" },
    { id: "mens-watches", name: "Men's Watches" },
])

// Product state
const products = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref("")
const selectedCategory = ref("all")

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(12)
const itemsPerPageOptions = [6, 12, 24, 48]

// ===========================================
// DATA FETCHING
// ===========================================
const fetchProducts = async () => {
    try {
        loading.value = true
        error.value = null
        
        const response = await fetch("https://dummyjson.com/products?limit=100")
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        products.value = data.products || []
        
    } catch (err) {
        console.error("Error fetching products:", err)
        error.value = "Failed to load products. Please try again later."
        products.value = []
    } finally {
        loading.value = false
    }
}

// ===========================================
// COMPUTED PROPERTIES
// ===========================================
const filteredProducts = computed(() => {
    if (!products.value.length) return []
    
    return products.value.filter((product) => {
        // Search filter
        const matchesSearch = searchQuery.value === "" || 
            product.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.value.toLowerCase())

        // Category filter
        const matchesCategory = selectedCategory.value === "all" ||
            product.category?.toLowerCase().replace(/\s+/g, "-") === selectedCategory.value

        return matchesSearch && matchesCategory
    })
})

// Pagination computed
const totalItems = computed(() => filteredProducts.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProducts.value.slice(start, end)
})

const startItem = computed(() => {
    return totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
    const end = currentPage.value * itemsPerPage.value
    return end > totalItems.value ? totalItems.value : end
})

// Pagination navigation
const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        pages.push(1)
        if (current > 4) pages.push("...")

        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)

        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== total) pages.push(i)
        }

        if (current < total - 3) pages.push("...")
        if (total > 1) pages.push(total)
    }

    return pages
})

// Selected category name
const selectedCategoryName = computed(() => {
    const category = categories.value.find(c => c.id === selectedCategory.value)
    return category ? category.name : "Select Category"
})

// Cart count
const cartCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
})

// ===========================================
// METHODS
// ===========================================

// Category selection
const selectCategory = (categoryId) => {
    selectedCategory.value = categoryId
}

// Pagination methods
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page
        scrollToTop()
    }
}

const goToPreviousPage = () => {
    if (currentPage.value > 1) goToPage(currentPage.value - 1)
}

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) goToPage(currentPage.value + 1)
}

const changeItemsPerPage = (newItemsPerPage) => {
    itemsPerPage.value = newItemsPerPage
    currentPage.value = 1
}

const scrollToTop = () => {
    if (process.client) {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
}

// Utility functions
const formatPrice = (price) => {
    if (!price || isNaN(price)) return "Rp 0"
    
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price * 15000)
}

const getProductImage = (product) => {
    if (!product?.images?.length) {
        return "https://via.placeholder.com/300x300?text=No+Image"
    }
    
    const imageUrl = product.thumbnail || product.images[0]
    return imageUrl?.trim() || "https://via.placeholder.com/300x300?text=No+Image"
}

const handleImageError = (event) => {
    event.target.src = "https://via.placeholder.com/300x300?text=Error+Loading+Image"
}

const handleCarouselImageError = (event) => {
    event.target.src = "https://via.placeholder.com/1200x400?text=Banner+Image"
}

const navigateToProduct = (productId) => {
    navigateTo(`/product/${productId}`)
}

const retryFetch = () => {
    fetchProducts()
}

const clearFilters = () => {
    selectedCategory.value = 'all'
    searchQuery.value = ''
}

// ===========================================
// WATCHERS
// ===========================================
watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1
})

// ===========================================
// LIFECYCLE
// ===========================================
onMounted(async () => {
    // Fetch products data
    await fetchProducts()
    
    // Initialize chat
    await initializeChat()
})
</script>

<template>
    <div style="min-height: 100vh; background-color: #f9fafb;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem;">
            <!-- ===========================================
                 HERO CAROUSEL SECTION
                 =========================================== -->
            <section style="margin-bottom: 2rem;">
                <Carousel
                    :opts="{ loop: true, align: 'start' }"
                    :plugins="[autoplay]"
                    class="w-full"
                >
                    <CarouselContent>
                        <CarouselItem
                            v-for="(slide, index) in carouselImages"
                            :key="index"
                            class="w-full"
                        >
                            <div style="position: relative; height: 20rem; width: 100%; overflow: hidden; border-radius: 0.75rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6);">
                                <img
                                    :src="slide.src"
                                    :alt="slide.alt"
                                    style="width: 100%; height: 100%; object-fit: cover;"
                                    @error="handleCarouselImageError"
                                />
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious class="left-4" />
                    <CarouselNext class="right-4" />
                </Carousel>
            </section>

            <!-- ===========================================
                 CATEGORY FILTER SECTION
                 =========================================== -->
            <section style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937;">Categories</h2>
                    
               

                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: white; border: 1px solid #d1d5db; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); cursor: pointer;">
                        <span style="font-weight: 500;">{{ selectedCategoryName }}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style="height: 1rem; width: 1rem;"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent class="w-56 max-h-96 overflow-y-auto">
                        <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                        <DropdownMenuItem
                            v-for="category in categories"
                            :key="category.id"
                            @click="selectCategory(category.id)"
                            style="cursor: pointer;"
                        >
                            <span style="text-transform: capitalize;">{{ category.name }}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </section>

            <!-- ===========================================
                 ERROR STATE
                 =========================================== -->
            <div v-if="error && !loading" style="background-color: white; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 2rem; border: 1px solid #fecaca;">
                <div style="text-align: center; max-width: 28rem; margin: 0 auto;">
                    <svg style="width: 4rem; height: 4rem; color: #f87171; margin: 0 auto 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">Oops! Something went wrong</h3>
                    <p style="color: #6b7280; margin-bottom: 1.5rem;">{{ error }}</p>
                    <button @click="retryFetch" style="background-color: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; border: none; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            </div>

            <!-- ===========================================
                 LOADING STATE
                 =========================================== -->
            <div v-else-if="loading" style="display: flex; justify-content: center; align-items: center; padding: 5rem 0;">
                <div style="text-align: center;">
                    <div style="width: 3rem; height: 3rem; border: 4px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p style="color: #6b7280; font-weight: 500;">Loading products...</p>
                </div>
            </div>

            <!-- ===========================================
                 PRODUCTS SECTION
                 =========================================== -->
            <div v-else>
                <!-- Results Summary -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 1rem 1.25rem; background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                    <div>
                        <span style="color: #6b7280; font-weight: 500;">
                            Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} products
                        </span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <label for="itemsPerPage" style="color: #6b7280; font-size: 0.875rem; font-weight: 500;">Show:</label>
                        <select
                            id="itemsPerPage"
                            v-model="itemsPerPage"
                            @change="changeItemsPerPage(itemsPerPage)"
                            style="padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; background-color: white;"
                        >
                            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                                {{ option }}
                            </option>
                        </select>
                        <span style="color: #6b7280; font-size: 0.875rem; font-weight: 500;">per page</span>
                    </div>
                </div>

                <!-- No Results -->
                <div v-if="filteredProducts.length === 0" style="background-color: white; border-radius: 0.75rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                    <div style="text-align: center; padding: 4rem 1.5rem;">
                        <svg style="width: 4rem; height: 4rem; color: #9ca3af; margin: 0 auto 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 style="font-size: 1.125rem; font-weight: 500; color: #111827; margin-bottom: 0.5rem;">No products found</h3>
                        <p style="color: #6b7280; margin-bottom: 1.5rem;">
                            Try adjusting your search or filter criteria
                        </p>
                        <button @click="clearFilters" style="border: 1px solid #d1d5db; color: #6b7280; background-color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;">
                            Clear Filters
                        </button>
                    </div>
                </div>

                <!-- Products Grid -->
                <div v-else>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                        <article
                            v-for="product in paginatedProducts"
                            :key="product.id"
                            style="background-color: white; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; transition: all 0.3s ease; display: flex; flex-direction: column; height: 100%;"
                        >
                            <NuxtLink :to="`/product/${product.id}`" style="display: block; height: 100%; text-decoration: none; color: inherit;">
                                <!-- Product Image -->
                                <div style="position: relative; height: 12rem; background-color: #f9fafb; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow: hidden;">
                                    <img
                                        :src="getProductImage(product)"
                                        :alt="product.title"
                                        style="max-width: 100%; max-height: 100%; object-fit: contain;"
                                        @error="handleImageError"
                                        loading="lazy"
                                    />
                                    
                                    <!-- Category Badge -->
                                    <div style="position: absolute; top: 0.5rem; right: 0.5rem; background-color: #3b82f6; color: white; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.025em;">
                                        {{ product.category || "Uncategorized" }}
                                    </div>

                                    <!-- Discount Badge -->
                                    <div
                                        v-if="product.discountPercentage"
                                        style="position: absolute; top: 0.5rem; left: 0.5rem; background-color: #ef4444; color: white; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 700; border-radius: 0.5rem;"
                                    >
                                        -{{ Math.round(product.discountPercentage) }}%
                                    </div>
                                </div>

                                <!-- Product Info -->
                                <div style="padding: 1rem; display: flex; flex-direction: column; flex-grow: 1;">
                                    <h3 style="font-weight: 600; color: #111827; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 3rem;">
                                        {{ product.title }}
                                    </h3>
                                    
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.25rem; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1;">
                                        {{ product.description?.substring(0, 100) + "..." || "No description available" }}
                                    </p>

                                    <!-- Rating -->
                                    <div v-if="product.rating" style="margin-bottom: 0.75rem;">
                                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                                            <svg
                                                v-for="i in 5"
                                                :key="i"
                                                style="width: 1rem; height: 1rem;"
                                                :style="{ color: i <= Math.round(product.rating) ? '#fbbf24' : '#d1d5db' }"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span style="font-size: 0.875rem; color: #6b7280; margin-left: 0.25rem;">({{ product.rating }})</span>
                                        </div>
                                    </div>

                                    <!-- Product Footer -->
                                    <div style="display: flex; justify-content: space-between; align-items: end; margin-top: auto; gap: 0.75rem;">
                                        <div style="display: flex; flex-direction: column; flex-grow: 1;">
                                            <p style="font-size: 1.125rem; font-weight: 700; color: #3b82f6;">
                                                {{ formatPrice(product.price) }}
                                            </p>
                                            <p v-if="product.discountPercentage" style="font-size: 0.875rem; color: #9ca3af; text-decoration: line-through;">
                                                {{ formatPrice(product.price / (1 - product.discountPercentage / 100)) }}
                                            </p>
                                        </div>
                                        
                                        <!-- Action Buttons -->
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">

                                            <button
                                                @click.prevent="buyNow(product)"
                                                style="background-color: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 0.2s; flex-grow: 1; text-align: center;"
                                                @mouseover="$event.target.style.backgroundColor = '#2563eb'"
                                                @mouseout="$event.target.style.backgroundColor = '#3b82f6'"
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </NuxtLink>
                        </article>
                    </div>

                    <!-- Pagination -->
                    <nav v-if="totalPages > 1" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; padding-top: 2rem;">
                        <div style="display: flex; align-items: center; gap: 0.25rem; background-color: white; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                            <!-- Previous Button -->
                            <button
                                @click="goToPreviousPage"
                                :disabled="currentPage === 1"
                                style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; font-weight: 500; color: #6b7280; background-color: white; border: 1px solid #d1d5db; border-radius: 0.375rem; cursor: pointer; transition: all 0.3s ease;"
                                :style="{ opacity: currentPage === 1 ? '0.5' : '1', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }"
                            >
                                <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Previous</span>
                            </button>

                            <!-- Page Numbers -->
                            <div style="display: flex; gap: 0.25rem; margin: 0 0.5rem;">
                                <button
                                    v-for="page in visiblePages"
                                    :key="page"
                                    @click="page !== '...' ? goToPage(page) : null"
                                    :disabled="page === '...'"
                                    :style="{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        backgroundColor: page === currentPage ? '#3b82f6' : 'white',
                                        color: page === currentPage ? 'white' : (page === '...' ? '#9ca3af' : '#6b7280'),
                                        cursor: page === '...' ? 'default' : 'pointer',
                                        transition: 'all 0.3s ease'
                                    }"
                                >
                                    {{ page }}
                                </button>
                            </div>

                            <!-- Next Button -->
                            <button
                                @click="goToNextPage"
                                :disabled="currentPage === totalPages"
                                style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; font-weight: 500; color: #6b7280; background-color: white; border: 1px solid #d1d5db; border-radius: 0.375rem; cursor: pointer; transition: all 0.3s ease;"
                                :style="{ opacity: currentPage === totalPages ? '0.5' : '1', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }"
                            >
                                <span>Next</span>
                                <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Page Info -->
                        <div style="text-align: center;">
                            <span style="font-size: 0.875rem; color: #6b7280;">
                                Page {{ currentPage }} of {{ totalPages }}
                            </span>
                        </div>
                    </nav>
                </div>
            </div>
        </div>

        <!-- ===========================================
             BUY NOW MODAL
             =========================================== -->
        <div v-if="showBuyModal" style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem;" @click="closeBuyModal">
            <div style="background-color: white; border-radius: 0.75rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-width: 28rem; width: 100%; max-height: 90vh; overflow-y: auto;" @click.stop>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin: 0;">Confirm Purchase</h3>
                    <button @click="closeBuyModal" style="color: #9ca3af; background: none; border: none; cursor: pointer; padding: 0.25rem; border-radius: 9999px; transition: color 0.2s;" @mouseover="$event.target.style.color = '#6b7280'" @mouseout="$event.target.style.color = '#9ca3af'">
                        <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div v-if="selectedProduct" style="padding: 1.5rem;">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                        <img 
                            :src="getProductImage(selectedProduct)" 
                            :alt="selectedProduct.title"
                            style="width: 5rem; height: 5rem; object-fit: contain; background-color: #f9fafb; border-radius: 0.5rem; padding: 0.5rem;"
                        />
                        <div style="flex: 1;">
                            <h4 style="font-weight: 600; color: #111827; margin-bottom: 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ selectedProduct.title }}</h4>
                            <p style="font-size: 1.125rem; font-weight: 700; color: #3b82f6; margin-bottom: 0.5rem;">{{ formatPrice(selectedProduct.price) }}</p>
                            <div v-if="selectedProduct.rating" style="display: flex; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 0.25rem;">
                                    <svg
                                        v-for="i in 5"
                                        :key="i"
                                        style="width: 1rem; height: 1rem;"
                                        :style="{ color: i <= Math.round(selectedProduct.rating) ? '#fbbf24' : '#d1d5db' }"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span style="font-size: 0.875rem; color: #6b7280; margin-left: 0.25rem;">({{ selectedProduct.rating }})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                        <button @click="closeBuyModal" style="flex: 1; border: 1px solid #d1d5db; color: #6b7280; background-color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s;" @mouseover="$event.target.style.backgroundColor = '#f9fafb'" @mouseout="$event.target.style.backgroundColor = 'white'">
                            Cancel
                        </button>
                        <button @click="handlePurchase" style="flex: 1; background-color: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s;" @mouseover="$event.target.style.backgroundColor = '#2563eb'" @mouseout="$event.target.style.backgroundColor = '#3b82f6'">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===========================================
             CHAT POPUP
             ===========================================-->

         
    </div>
</template>

<style>
/* Spin animation for loading */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
/* Dropdown menu: kategori & profile tidak transparan */
.dropdown-menu__content,
.dropdown-menu-content,
[data-radix-popper-content-wrapper] > div,
.w-56.max-h-96.overflow-y-auto {
  background-color: #fff !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 1.5px 4px rgba(0,0,0,0.08) !important;
  backdrop-filter: none !important;
  border: 1px solid #e5e7eb !important;
  /* Jika ada efek blur, hilangkan: */
  -webkit-backdrop-filter: none !important;
  /* Untuk memastikan tidak transparan */
  opacity: 1 !important;
}


/* Hover effects for product cards */
.product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Responsive grid */
@media (max-width: 640px) {
    .products-grid {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
    }
    
    .pagination-btn-text {
        display: none !important;
    }
}

@media (max-width: 480px) {
    .modal-content {
        padding: 1rem !important;
    }
    
    .product-preview {
        flex-direction: column !important;
        text-align: center !important;
    }
    
    .preview-image {
        width: 100% !important;
        height: 8rem !important;
        margin: 0 auto !important;
    }
}
</style>