<script setup>
import { ref, onMounted, computed } from "vue";
const products = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedCategory = ref("all");
const categories = ref([]);

const fetchData = async () => {
    try {
        loading.value = true;
        const res = await fetch("https://api.escuelajs.co/api/v1/products");
        const data = await res.json();
        products.value = data;

        // Fetch categories separately as Platzi API has a dedicated categories endpoint
        fetchCategories();
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loading.value = false;
    }
};

const fetchCategories = async () => {
    try {
        const res = await fetch("https://api.escuelajs.co/api/v1/categories");
        const data = await res.json();
        // Add "all" option at the beginning
        categories.value = [
            { id: "all", name: "All Categories" },
            ...data
        ];
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
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
            product.category.id === selectedCategory.value;

        return matchesSearch && matchesCategory;
    });
});

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
    
    const imageUrl = product.images[0];
    
    // Check if URL is valid
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    // Check if URL is a relative path
    if (imageUrl.startsWith('/')) {
        return `https://api.escuelajs.co${imageUrl}`;
    }
    
    return imageUrl;
};

// Function to get category image
const getCategoryImage = (category) => {
    if (!category || !category.image) {
        return 'https://via.placeholder.com/150x150?text=Category';
    }
    
    const imageUrl = category.image;
    
    // Check if URL is valid
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        return 'https://via.placeholder.com/150x150?text=Category';
    }
    
    // Check if URL is a relative path
    if (imageUrl.startsWith('/')) {
        return `https://api.escuelajs.co${imageUrl}`;
    }
    
    return imageUrl;
};

// Function to handle image loading error
const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/300x300?text=Error+Loading+Image';
};

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

        <div class="loader" v-if="loading">
            <div class="spinner"></div>
            <p>Memuat produk...</p>
        </div>

        <div v-else>
            <p v-if="filteredProducts.length === 0" class="no-results">
                Tidak ada produk yang ditemukan.
            </p>

            <div class="products-grid">
                <div
                    v-for="product in filteredProducts"
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
                                {{ product.category?.name || 'Uncategorized' }}
                            </div>
                        </div>

                        <div class="product-details">
                            <h2 class="product-title">{{ product.title }}</h2>
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
    margin-bottom: 30px;
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
}
</style>
