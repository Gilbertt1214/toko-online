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

// Setup autoplay plugin
const autoplay = Autoplay({
    delay: 3000,
    stopOnInteraction: true,
});

// Import gambar dari assets
import image1 from "~/assets/image/1.png";
import image2 from "~/assets/image/2.png";
import image3 from "~/assets/image/3.png";

// Carousel images data
const carouselImages = ref([
    {
        src: image1,
        alt: "Banner 1",
    },
    {
        src: image2,
        alt: "Banner 2",
    },
    {
        src: image3,
        alt: "Banner 3",
    },
]);

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
]);

const products = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedCategory = ref("all");

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(12);
const itemsPerPageOptions = [6, 12, 24, 48];

const getCategoryIcon = (categoryId) => {
    const icons = {
        all: "grid",
        laptops: "laptop",
        fragrances: "spray-can",
        groceries: "shopping-cart",
        "home-decoration": "home",
        furniture: "sofa",
        "womens-dresses": "shirt",
        "mens-shirts": "shirt",
        "mens-shoes": "footprints",
        "mens-watches": "watch",
    };
    return icons[categoryId] || icons["all"];
};

const fetchData = async () => {
    try {
        loading.value = true;
        const res = await fetch("https://dummyjson.com/products?limit=100");
        const data = await res.json();
        products.value = data.products;
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loading.value = false;
    }
};

const filteredProducts = computed(() => {
    return products.value.filter((product) => {
        const matchesSearch =
            product.title
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase());

        const matchesCategory =
            selectedCategory.value === "all" ||
            product.category.toLowerCase().replace(/\s+/g, "-") ===
                selectedCategory.value;

        return matchesSearch && matchesCategory;
    });
});

// Pagination computed properties
const totalItems = computed(() => filteredProducts.value.length);
const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
);

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProducts.value.slice(start, end);
});

const startItem = computed(() => {
    return totalItems.value === 0
        ? 0
        : (currentPage.value - 1) * itemsPerPage.value + 1;
});

const endItem = computed(() => {
    const end = currentPage.value * itemsPerPage.value;
    return end > totalItems.value ? totalItems.value : end;
});

// Pagination navigation
const visiblePages = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 4) pages.push("...");

        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== total) pages.push(i);
        }

        if (current < total - 3) pages.push("...");
        if (total > 1) pages.push(total);
    }

    return pages;
});

// Pagination methods
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};

const goToPreviousPage = () =>
    currentPage.value > 1 && goToPage(currentPage.value - 1);
const goToNextPage = () =>
    currentPage.value < totalPages.value && goToPage(currentPage.value + 1);
const changeItemsPerPage = (newItemsPerPage) => {
    itemsPerPage.value = newItemsPerPage;
    currentPage.value = 1;
};

// Utility functions
const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price * 15000);
};

const getProductImage = (product) => {
    if (!product?.images?.length)
        return "https://via.placeholder.com/300x300?text=No+Image";
    const imageUrl = product.thumbnail || product.images[0];
    return imageUrl?.trim()
        ? imageUrl
        : "https://via.placeholder.com/300x300?text=No+Image";
};

const handleImageError = (event) => {
    event.target.src =
        "https://via.placeholder.com/300x300?text=Error+Loading+Image";
};

const handleCarouselImageError = (event) => {
    event.target.src = "https://via.placeholder.com/1200x400?text=Banner+Image";
};

// Watchers
watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1;
});

// Lifecycle
onMounted(fetchData);
</script>

<template>
    <div class="container">
        <!-- Hero Carousel Section -->
        <header class="mb-12">
            <Carousel
                :opts="{
                    loop: true,
                    align: 'start',
                }"
                :plugins="[autoplay]"
                class="w-full"
            >
                <CarouselContent>
                    <CarouselItem
                        v-for="(slide, index) in carouselImages"
                        :key="index"
                        class="w-full"
                    >
                        <div
                            class="relative h-96 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                            <img
                                :src="slide.src"
                                :alt="slide.alt"
                                class="w-full h-full object-cover"
                                @error="handleCarouselImageError"
                            />
                        </div>
                    </CarouselItem>
                </CarouselContent>

                <CarouselPrevious class="left-4" />
                <CarouselNext class="right-4" />
            </Carousel>
        </header>

        <!-- Category Filter -->
        <div class="mb-5">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Categories</h3>

            <DropdownMenu>
                <DropdownMenuTrigger
                    class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <span class="font-medium">{{
                        categories.find((c) => c.id === selectedCategory)
                            ?.name || "Select Category"
                    }}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
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
                        @click="selectedCategory = category.id"
                        :class="[
                            'flex items-center gap-2 cursor-pointer',
                            selectedCategory === category.id
                                ? 'bg-indigo-50 text-indigo-600'
                                : '',
                        ]"
                    >
                        <span class="capitalize">{{ category.name }}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <!-- Results Summary -->
        <div class="results-bar" v-if="!loading">
            <div class="results-info">
                <span class="results-text">
                    Showing {{ startItem }}-{{ endItem }} of
                    {{ totalItems }} products
                </span>
            </div>
            <div class="items-per-page">
                <label for="itemsPerPage" class="items-label">Show:</label>
                <select
                    id="itemsPerPage"
                    v-model="itemsPerPage"
                    @change="changeItemsPerPage(itemsPerPage)"
                    class="items-select"
                >
                    <option
                        v-for="option in itemsPerPageOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </option>
                </select>
                <span class="items-label">per page</span>
            </div>
        </div>

        <!-- Loading State -->
        <div class="loader" v-if="loading">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>

        <!-- Products Grid -->
        <div v-else>
            <div v-if="filteredProducts.length === 0" class="no-results">
                <div class="text-center py-16">
                    <svg
                        class="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 3.512V2a10 10 0 00-9.542 13.066M15 3.512A10 10 0 0121 13l-3.288-2.192"
                        />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                        No products found
                    </h3>
                    <p class="text-gray-500">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            </div>

            <div v-else>
                <div class="products-grid">
                    <div
                        v-for="product in paginatedProducts"
                        :key="product.id"
                        class="product-card"
                    >
                        <NuxtLink
                            :to="`/product/${product.id}`"
                            class="block h-full"
                        >
                            <div class="product-image-container">
                                <img
                                    :src="getProductImage(product)"
                                    :alt="product.title"
                                    class="product-image"
                                    @error="handleImageError"
                                    loading="lazy"
                                />
                                <div class="product-category">
                                    {{ product.category || "Uncategorized" }}
                                </div>

                                <!-- Discount badge if available -->
                                <div
                                    v-if="product.discountPercentage"
                                    class="product-discount"
                                >
                                    -{{
                                        Math.round(product.discountPercentage)
                                    }}%
                                </div>
                            </div>

                            <div class="product-details">
                                <h2 class="product-title">
                                    {{ product.title }}
                                </h2>
                                <p class="product-description">
                                    {{
                                        product.description
                                            ? product.description.substring(
                                                  0,
                                                  100
                                              ) + "..."
                                            : "No description available"
                                    }}
                                </p>

                                <!-- Rating -->
                                <div
                                    class="product-rating"
                                    v-if="product.rating"
                                >
                                    <div class="flex items-center gap-1">
                                        <svg
                                            v-for="i in 5"
                                            :key="i"
                                            class="w-4 h-4"
                                            :class="
                                                i <= Math.round(product.rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            "
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <span class="text-sm text-gray-600 ml-1"
                                            >({{ product.rating }})</span
                                        >
                                    </div>
                                </div>

                                <div class="product-footer">
                                    <div class="price-container">
                                        <p class="product-price">
                                            {{ formatPrice(product.price) }}
                                        </p>
                                        <p
                                            v-if="product.discountPercentage"
                                            class="original-price"
                                        >
                                            {{
                                                formatPrice(
                                                    product.price /
                                                        (1 -
                                                            product.discountPercentage /
                                                                100)
                                                )
                                            }}
                                        </p>
                                    </div>
                                    <button
                                        class="buy-button"
                                        @click.prevent="
                                            $router.push(
                                                `/product/${product.id}`
                                            )
                                        "
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="pagination-container" v-if="totalPages > 1">
                    <div class="pagination">
                        <button
                            @click="goToPreviousPage"
                            :disabled="currentPage === 1"
                            class="pagination-btn pagination-prev"
                            :class="{ disabled: currentPage === 1 }"
                        >
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            <span class="hidden sm:inline">Previous</span>
                        </button>

                        <div class="pagination-numbers">
                            <button
                                v-for="page in visiblePages"
                                :key="page"
                                @click="page !== '...' ? goToPage(page) : null"
                                :class="[
                                    'pagination-number',
                                    {
                                        active: page === currentPage,
                                        dots: page === '...',
                                    },
                                ]"
                                :disabled="page === '...'"
                            >
                                {{ page }}
                            </button>
                        </div>

                        <button
                            @click="goToNextPage"
                            :disabled="currentPage === totalPages"
                            class="pagination-btn pagination-next"
                            :class="{ disabled: currentPage === totalPages }"
                        >
                            <span class="hidden sm:inline">Next</span>
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="page-info">
                        <span class="page-text">
                            Page {{ currentPage }} of {{ totalPages }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Base styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Carousel custom styles */
.carousel-container {
    position: relative;
    margin-bottom: 2rem;
}

/* Results Bar */
.results-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
}

.results-info {
    color: #64748b;
    font-weight: 500;
}

.items-per-page {
    display: flex;
    align-items: center;
    gap: 8px;
}

.items-label {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
}

.items-select {
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.items-select:focus {
    outline: none;
    border-color: #6366f1;
}

/* Loading Animation */
.loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(99, 102, 241, 0.1);
    border-radius: 50%;
    border-top-color: #6366f1;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.no-results {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

.product-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.product-image-container {
    position: relative;
    height: 200px;
    background-color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow: hidden;
}

.product-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.product-category {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #6366f1e6;
    color: white;
    padding: 5px 10px;
    font-size: 0.75rem;
    border-radius: 20px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.product-discount {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #ef4444;
    color: white;
    padding: 5px 8px;
    font-size: 0.75rem;
    border-radius: 12px;
    font-weight: 600;
}

.product-details {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.product-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #1e293b;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 2.8rem;
}

.product-description {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 15px;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.product-rating {
    margin-bottom: 10px;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.price-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.product-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #6366f1;
}

.original-price {
    font-size: 0.9rem;
    color: #94a3b8;
    text-decoration: line-through;
}

.buy-button {
    background-color: #6366f1;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.buy-button:hover {
    background-color: #4f46e5;
}

/* Pagination Styles */
.pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 40px;
    padding: 20px 0;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 5px;
    background: white;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
}

.pagination-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    color: #64748b;
}

.pagination-btn:hover:not(.disabled) {
    background: #6366f1;
    color: white;
    border-color: #6366f1;
}

.pagination-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f8fafc;
}

.pagination-numbers {
    display: flex;
    gap: 2px;
    margin: 0 10px;
}

.pagination-number {
    width: 40px;
    height: 40px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pagination-number:hover:not(.dots):not(.active) {
    background: #f1f5f9;
    border-color: #6366f1;
    color: #6366f1;
}

.pagination-number.active {
    background: #6366f1;
    color: white;
    border-color: #6366f1;
}

.pagination-number.dots {
    border: none;
    background: transparent;
    cursor: default;
    color: #94a3b8;
}

.page-info {
    text-align: center;
}

.page-text {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 15px;
    }

    .results-bar {
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
    }

    .pagination {
        padding: 8px;
        gap: 3px;
    }

    .pagination-btn span {
        display: none;
    }

    .pagination-number {
        width: 35px;
        height: 35px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .products-grid {
        grid-template-columns: 1fr;
    }

    .results-bar {
        flex-direction: column;
        align-items: stretch;
    }

    .pagination-numbers {
        margin: 0 5px;
    }

    .pagination-number {
        width: 32px;
        height: 32px;
        font-size: 13px;
    }
}
</style>
