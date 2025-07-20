<script setup>
import { ref, onMounted, computed, watch } from "vue";

const products = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedCategory = ref("all");
const categories = ref([]);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(12); // Default items per page
const itemsPerPageOptions = [6, 12, 24, 48];

const fetchData = async () => {
    try {
        loading.value = true;
        const res = await fetch("https://dummyjson.com/products?limit=100"); // Fetch more products for pagination demo
        const data = await res.json();
        products.value = data.products;

        // Generate categories from products
        generateCategories();
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loading.value = false;
    }
};

const generateCategories = () => {
    // Extract unique categories from products
    const uniqueCategories = [...new Set(products.value.map(product => product.category))];
    
    // Format categories for our dropdown
    categories.value = [
        { id: "all", name: "All Categories" },
        ...uniqueCategories.map((category, index) => ({
            id: category.toLowerCase().replace(/\s+/g, '-'),
            name: category
        }))
    ];
};

const filteredProducts = computed(() => {
    return products.value.filter((product) => {
        // Filter by search query (title & description)
        const matchesSearch = 
            product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.value.toLowerCase());

        // Filter by category
        const matchesCategory =
            selectedCategory.value === "all" ||
            product.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.value;

        return matchesSearch && matchesCategory;
    });
});

// Pagination computed properties
const totalItems = computed(() => filteredProducts.value.length);

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value);
});

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProducts.value.slice(start, end);
});

const startItem = computed(() => {
    if (totalItems.value === 0) return 0;
    return (currentPage.value - 1) * itemsPerPage.value + 1;
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
        // Show all pages if total is 7 or less
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // Show first page
        pages.push(1);
        
        if (current > 4) {
            pages.push('...');
        }
        
        // Show pages around current page
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== total) {
                pages.push(i);
            }
        }
        
        if (current < total - 3) {
            pages.push('...');
        }
        
        // Show last page
        if (total > 1) {
            pages.push(total);
        }
    }
    
    return pages;
});

// Pagination methods
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page;
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        goToPage(currentPage.value - 1);
    }
};

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1);
    }
};

const changeItemsPerPage = (newItemsPerPage) => {
    itemsPerPage.value = newItemsPerPage;
    currentPage.value = 1; // Reset to first page
};

// Utility functions
const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price * 15000); // Assuming conversion rate to IDR
};

// Function to get valid product image
const getProductImage = (product) => {
    if (!product || !product.images || product.images.length === 0) {
        return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    const imageUrl = product.thumbnail || product.images[0];
    
    // Check if URL is valid
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    return imageUrl;
};

// Function to handle image loading error
const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/300x300?text=Error+Loading+Image';
};

// Watch for filter changes and reset to first page
watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1;
});

onMounted(() => {
    fetchData();
});
</script>

<template>
    <div class="container">
        <header class="header">
            <h1 class="title">Katalog Produk</h1>
            <p class="subtitle">
                Temukan produk berkualitas terbaik untuk Anda
            </p>
        </header>

        <div class="filters">
            <div class="search-box">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari produk..."
                    class="search-input"
                />
            </div>
            <div class="category-filter">
                <select v-model="selectedCategory" class="category-select">
                    <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Results Summary and Items Per Page -->
        <div class="results-bar" v-if="!loading">
            <div class="results-info">
                <span class="results-text">
                    Menampilkan {{ startItem }}-{{ endItem }} dari {{ totalItems }} produk
                </span>
            </div>
            <div class="items-per-page">
                <label for="itemsPerPage" class="items-label">Tampilkan:</label>
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
                <span class="items-label">per halaman</span>
            </div>
        </div>

        <div class="loader" v-if="loading">
            <div class="spinner"></div>
            <p>Memuat produk...</p>
        </div>

        <div v-else>
            <p v-if="filteredProducts.length === 0" class="no-results">
                Tidak ada produk yang ditemukan.
            </p>

            <div v-else>
                <!-- Products Grid -->
                <div class="products-grid">
                    <div
                        v-for="product in paginatedProducts"
                        :key="product.id"
                        class="product-card"
                    >
                        <NuxtLink :to="`/product/${product.id}`">
                            <div class="product-image-container">
                                <img
                                    :src="getProductImage(product)"
                                    :alt="product.title"
                                    class="product-image"
                                    @error="handleImageError"
                                />
                                <div class="product-category">
                                    {{ product.category || 'Uncategorized' }}
                                </div>
                            </div>

                            <div class="product-details">
                                <h2 class="product-title">{{ product.title }}</h2>
                                <p class="product-description">
                                    {{
                                        product.description
                                            ? product.description.substring(0, 100) + "..."
                                            : "No description available"
                                    }}
                                </p>
                                <div class="product-footer">
                                    <p class="product-price">
                                        {{ formatPrice(product.price) }}
                                    </p>
                                    <button class="buy-button">
                                        Beli Sekarang
                                    </button>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="pagination-container" v-if="totalPages > 1">
                    <div class="pagination">
                        <!-- Previous Button -->
                        <button 
                            @click="goToPreviousPage"
                            :disabled="currentPage === 1"
                            class="pagination-btn pagination-prev"
                            :class="{ 'disabled': currentPage === 1 }"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            <span class="hidden sm:inline">Previous</span>
                        </button>

                        <!-- Page Numbers -->
                        <div class="pagination-numbers">
                            <button
                                v-for="page in visiblePages"
                                :key="page"
                                @click="page !== '...' ? goToPage(page) : null"
                                :class="[
                                    'pagination-number',
                                    {
                                        'active': page === currentPage,
                                        'dots': page === '...'
                                    }
                                ]"
                                :disabled="page === '...'"
                            >
                                {{ page }}
                            </button>
                        </div>

                        <!-- Next Button -->
                        <button 
                            @click="goToNextPage"
                            :disabled="currentPage === totalPages"
                            class="pagination-btn pagination-next"
                            :class="{ 'disabled': currentPage === totalPages }"
                        >
                            <span class="hidden sm:inline">Next</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Page Info -->
                    <div class="page-info">
                        <span class="page-text">
                            Halaman {{ currentPage }} dari {{ totalPages }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Base styles & CSS reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.header {
    text-align: center;
    margin-bottom: 40px;
    padding: 20px 0;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.subtitle {
    font-size: 1.1rem;
    opacity: 0.8;
}

/* Search and Filters */
.filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.search-box {
    flex: 1;
    min-width: 250px;
}

.search-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.category-select {
    padding: 12px 15px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
    background-color: white;
    min-width: 180px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-select:focus {
    outline: none;
    border-color: #6366f1;
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
    text-align: center;
    padding: 40px;
    font-size: 18px;
    color: #64748b;
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

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.product-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #6366f1;
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

    .header {
        padding: 15px 0;
    }

    .title {
        font-size: 2rem;
    }

    .results-bar {
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
    }

    .items-per-page {
        justify-content: center;
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

    .filters {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box,
    .category-filter {
        width: 100%;
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