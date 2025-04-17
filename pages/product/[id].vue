<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const quantity = ref(1);
const activeTab = ref("description");
const relatedProducts = ref([]);
const activeImageIndex = ref(0); // Untuk menangani multiple images

const fetchSingleProduct = async () => {
    try {
        loading.value = true;
        const res = await fetch(
            `https://api.escuelajs.co/api/v1/products/${route.params.id}`
        );
        const data = await res.json();
        product.value = data;

        // Fetch related products from the same category
        fetchRelatedProducts(data.category.id);
    } catch (error) {
        console.error("Error fetching product:", error);
    } finally {
        loading.value = false;
    }
};

const fetchRelatedProducts = async (categoryId) => {
    try {
        const res = await fetch(
            `https://api.escuelajs.co/api/v1/categories/${categoryId}/products`
        );
        let data = await res.json();
        // Remove current product and limit to 4 products
        data = data.filter((item) => item.id !== product.value.id).slice(0, 4);
        relatedProducts.value = data;
    } catch (error) {
        console.error("Error fetching related products:", error);
    }
};

const incrementQuantity = () => {
    quantity.value++;
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const formattedPrice = computed(() => {
    if (!product.value) return "";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(product.value.price * 15000); // Assuming conversion rate to IDR
});

const rating = computed(() => {
    // Platzi API doesn't have ratings, so we'll create a mock value
    return { rate: Math.floor(Math.random() * 5) + 1, count: Math.floor(Math.random() * 100) + 1 };
});

const renderStars = computed(() => {
    const stars = [];
    const rate = Math.round(rating.value.rate);

    for (let i = 1; i <= 5; i++) {
        if (i <= rate) {
            stars.push("★"); // Filled star
        } else {
            stars.push("☆"); // Empty star
        }
    }

    return stars.join("");
});

// Computed property to get the current main image
const mainImage = computed(() => {
    if (!product.value || !product.value.images || product.value.images.length === 0) {
        return 'https://via.placeholder.com/400x400?text=No+Image'; // Fallback image
    }
    return product.value.images[activeImageIndex.value];
});

// Function to change active image
const setActiveImage = (index) => {
    if (product.value && product.value.images && index < product.value.images.length) {
        activeImageIndex.value = index;
    }
};

// Function to check if image URLs are valid
const getValidImageUrl = (url) => {
    // Check if URL is valid
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return 'https://via.placeholder.com/100x100?text=No+Image';
    }
    
    // Check if URL is a relative path
    if (url.startsWith('/')) {
        return `https://api.escuelajs.co${url}`;
    }
    
    return url;
};

// For related product images
const getRelatedProductImage = (relatedProduct) => {
    if (!relatedProduct || !relatedProduct.images || relatedProduct.images.length === 0) {
        return 'https://via.placeholder.com/200x200?text=No+Image';
    }
    return getValidImageUrl(relatedProduct.images[0]);
};

onMounted(() => {
    fetchSingleProduct();
});
</script>

<template>
    <div class="product-detail-container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Memuat detail produk...</p>
        </div>

        <!-- Back Button -->
        <NuxtLink to=".\index.vue" class="inline-flex items-center gap-2 px-4 py-2 font-medium text-indigo-600 transition-all duration-300 bg-white border-2 border-indigo-500 rounded-full shadow-md hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white group">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-[-3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali </span>
        </NuxtLink>
        
        <!-- Product Detail Section -->
        <div v-if="product && !loading" class="product-detail">
            <div class="product-grid">
                <!-- Product Image Section -->
                <div class="product-image-section">
                    <div class="main-image-container">
                        <img
                            :src="mainImage"
                            :alt="product.title"
                            class="main-image"
                            @error="handleImageError"
                        />
                    </div>
                    
                    <!-- Thumbnail Gallery -->
                    <div v-if="product.images && product.images.length > 1" class="thumbnail-gallery">
                        <div 
                            v-for="(image, index) in product.images" 
                            :key="index" 
                            class="thumbnail-item"
                            :class="{ active: activeImageIndex === index }"
                            @click="setActiveImage(index)"
                        >
                            <img 
                                :src="getValidImageUrl(image)" 
                                :alt="`${product.title} view ${index+1}`"
                                @error="handleThumbnailError"
                            />
                        </div>
                    </div>
                    
                    <div class="image-badge">{{ product.category?.name || 'Uncategorized' }}</div>
                </div>

                <!-- Product Info Section -->
                <div class="product-info-section">
                    <div class="product-header">
                        <h1 class="product-title">{{ product.title }}</h1>
                        <div class="product-meta">
                            <div class="product-rating">
                                <span
                                    class="stars"
                                    :title="`${rating.rate} dari 5 bintang`"
                                    >{{ renderStars }}</span
                                >
                                <span class="rating-count"
                                    >({{ rating.count }} ulasan)</span
                                >
                            </div>
                            <div class="product-id">
                                SKU: #{{
                                    product.id.toString().padStart(5, "0")
                                }}
                            </div>
                        </div>
                    </div>

                    <div class="product-price-section">
                        <span class="product-price">{{ formattedPrice }}</span>
                        <span class="product-stock in-stock"
                            >✓ Stok Tersedia</span
                        >
                    </div>

                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button
                                @click="decrementQuantity"
                                class="quantity-btn"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                v-model="quantity"
                                min="1"
                                class="quantity-input"
                            />
                            <button
                                @click="incrementQuantity"
                                class="quantity-btn"
                            >
                                +
                            </button>
                        </div>

                        <div class="action-buttons">
                            <button class="add-to-cart-btn">
                                <span class="cart-icon">🛒</span> Tambahkan ke
                                Keranjang
                            </button>
                            <button class="buy-now-btn">Beli Sekarang</button>
                        </div>
                    </div>

                    <div class="product-benefits">
                        <div class="benefit-item">
                            <span class="benefit-icon">🚚</span>
                            <span class="benefit-text">Pengiriman Cepat</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">💯</span>
                            <span class="benefit-text">Produk Original</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">🔄</span>
                            <span class="benefit-text">Garansi 30 Hari</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Tabs Section -->
            <div class="product-tabs">
                <div class="tabs-header">
                    <button
                        class="tab-btn"
                        :class="{ active: activeTab === 'description' }"
                        @click="activeTab = 'description'"
                    >
                        Deskripsi
                    </button>
                    <button
                        class="tab-btn"
                        :class="{ active: activeTab === 'details' }"
                        @click="activeTab = 'details'"
                    >
                        Detail Produk
                    </button>
                    <button
                        class="tab-btn"
                        :class="{ active: activeTab === 'reviews' }"
                        @click="activeTab = 'reviews'"
                    >
                        Ulasan ({{ rating.count }})
                    </button>
                </div>

                <div class="tab-content">
                    <div v-if="activeTab === 'description'" class="tab-pane">
                        <p class="product-description">
                            {{ product.description }}
                        </p>
                    </div>

                    <div v-if="activeTab === 'details'" class="tab-pane">
                        <table class="product-details-table">
                            <tr>
                                <th>Kategori</th>
                                <td>{{ product.category?.name || 'Uncategorized' }}</td>
                            </tr>
                            <tr>
                                <th>ID Produk</th>
                                <td>{{ product.id }}</td>
                            </tr>
                            <tr>
                                <th>Rating</th>
                                <td>{{ rating.rate }} dari 5</td>
                            </tr>
                            <tr>
                                <th>Jumlah Ulasan</th>
                                <td>{{ rating.count }}</td>
                            </tr>
                        </table>
                    </div>

                    <div v-if="activeTab === 'reviews'" class="tab-pane">
                        <div class="review-summary">
                            <div class="average-rating">
                                <div class="big-rating">{{ rating.rate }}</div>
                                <div class="rating-stars">
                                    {{ renderStars }}
                                </div>
                                <div class="rating-count">
                                    Berdasarkan {{ rating.count }} ulasan
                                </div>
                            </div>

                            <div class="rating-bars">
                                <div class="rating-bar">
                                    <span class="rating-label">5 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            style="width: 65%"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">65%</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">4 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            style="width: 20%"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">20%</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">3 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            style="width: 10%"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">10%</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">2 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            style="width: 3%"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">3%</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">1 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            style="width: 2%"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">2%</span>
                                </div>
                            </div>
                        </div>

                        <p class="no-reviews-msg">
                            Ulasan spesifik tidak tersedia. Data rating
                            disediakan oleh API.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Related Products Section -->
            <div v-if="relatedProducts.length > 0" class="related-products">
                <h3 class="section-title">Produk Terkait</h3>
                <div class="related-products-grid">
                    <div
                        v-for="item in relatedProducts"
                        :key="item.id"
                        class="related-product-card"
                    >
                        <NuxtLink
                            :to="`/product/${item.id}`"
                            class="related-product-link"
                        >
                            <div class="related-product-image">
                                <img 
                                    :src="getRelatedProductImage(item)" 
                                    :alt="item.title"
                                    @error="handleImageError" 
                                />
                            </div>
                            <div class="related-product-info">
                                <h4 class="related-product-title">
                                    {{ item.title }}
                                </h4>
                                <p class="related-product-price">
                                    {{
                                        new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        }).format(item.price * 15000)
                                    }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Base Styles & Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.product-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

/* Loading Animation */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 100px 0;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 5px solid rgba(99, 102, 241, 0.1);
    border-radius: 50%;
    border-top-color: #6366f1;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Back Link */
.back-link {
    display: inline-flex;
    align-items: center;
    margin-bottom: 30px;
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
}

.back-link:hover {
    color: #4f46e5;
}

.back-icon {
    margin-right: 8px;
    font-size: 18px;
}

/* Product Grid Layout */
.product-grid {
    display: grid;
    grid-template-columns: minmax(300px, 5fr) 7fr;
    gap: 40px;
    margin-bottom: 40px;
}

/* Product Image Section */
.product-image-section {
    position: relative;
}

.main-image-container {
    background-color: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    height: 400px;
}

.main-image {
    max-width: 100%;
    max-height: 360px;
    object-fit: contain;
    transition: transform 0.5s ease;
}

.main-image-container:hover .main-image {
    transform: scale(1.05);
}

.image-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #6366f1;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Product Info Section */
.product-info-section {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.product-header {
    margin-bottom: 20px;
}

.product-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 15px;
    line-height: 1.3;
}

.product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.product-rating {
    display: flex;
    align-items: center;
}

.stars {
    color: #f59e0b;
    font-size: 1.2rem;
    letter-spacing: 2px;
    margin-right: 5px;
}

.rating-count {
    color: #64748b;
    font-size: 0.9rem;
}

.product-id {
    font-size: 0.85rem;
    color: #64748b;
}

/* Price Section */
.product-price-section {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.product-price {
    font-size: 2rem;
    font-weight: 700;
    color: #6366f1;
    margin-right: 15px;
}

.product-stock {
    font-size: 0.9rem;
    font-weight: 600;
}

.in-stock {
    color: #10b981;
}

/* Product Actions */
.product-actions {
    margin-bottom: 30px;
}

.quantity-selector {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: fit-content;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
}

.quantity-btn {
    width: 40px;
    height: 40px;
    background-color: #f1f5f9;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.quantity-btn:hover {
    background-color: #e2e8f0;
}

.quantity-input {
    width: 60px;
    height: 40px;
    border: none;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
    -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 15px;
}

.add-to-cart-btn,
.buy-now-btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}

.add-to-cart-btn {
    background-color: white;
    color: #6366f1;
    border: 2px solid #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-to-cart-btn:hover {
    background-color: #eef2ff;
}

.cart-icon {
    margin-right: 8px;
}

.buy-now-btn {
    background-color: #6366f1;
    color: white;
}

.buy-now-btn:hover {
    background-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
}

/* Product Benefits */
.product-benefits {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}

.benefit-item {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #475569;
}

.benefit-icon {
    margin-right: 8px;
    font-size: 1.2rem;
}

/* Product Tabs */
.product-tabs {
    margin-top: 40px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
}

.tabs-header {
    display: flex;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.tab-btn {
    padding: 15px 25px;
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.tab-btn:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: transparent;
    transition: background-color 0.2s ease;
}

.tab-btn.active {
    color: #6366f1;
}

.tab-btn.active:after {
    background-color: #6366f1;
}

.tab-btn:hover {
    background-color: #f1f5f9;
}

.tab-content {
    padding: 30px;
}

.tab-pane {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.product-description {
    line-height: 1.7;
    color: #475569;
}

/* Product Details Table */
.product-details-table {
    width: 100%;
    border-collapse: collapse;
}

.product-details-table tr {
    border-bottom: 1px solid #e2e8f0;
}

.product-details-table tr:last-child {
    border-bottom: none;
}

.product-details-table th,
.product-details-table td {
    padding: 15px 10px;
    text-align: left;
}

.product-details-table th {
    width: 30%;
    color: #64748b;
    font-weight: 600;
}

.product-details-table td {
    color: #1e293b;
}

/* Reviews Tab */
.review-summary {
    display: flex;
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #e2e8f0;
}

.average-rating {
    flex: 1;
    text-align: center;
    padding-right: 30px;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.big-rating {
    font-size: 3rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 10px;
}

.rating-stars {
    color: #f59e0b;
    font-size: 1.5rem;
    letter-spacing: 3px;
    margin-bottom: 10px;
}

.rating-count {
    color: #64748b;
    font-size: 0.9rem;
}

.rating-bars {
    flex: 2;
    padding-left: 30px;
}

.rating-bar {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.rating-label {
    width: 40px;
    font-size: 0.9rem;
    color: #64748b;
}

.bar-container {
    flex: 1;
    height: 12px;
    background-color: #e2e8f0;
    border-radius: 6px;
    margin: 0 15px;
    overflow: hidden;
}

.bar {
    height: 100%;
    background-color: #f59e0b;
    border-radius: 6px;
}

.rating-percent {
    width: 40px;
    font-size: 0.9rem;
    color: #64748b;
    text-align: right;
}

.no-reviews-msg {
    color: #64748b;
    font-style: italic;
    text-align: center;
    padding: 20px 0;
}

/* Related Products Section */
.related-products {
    margin-top: 50px;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;
}

.section-title:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #6366f1;
}

.related-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.related-product-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: white;
}

.related-product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.related-product-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.related-product-image {
    height: 150px;
    padding: 15px;
    background-color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
}

.related-product-image img {
    max-width: 100%;
    max-height: 120px;
    object-fit: contain;
}

.related-product-info {
    padding: 15px;
}

.related-product-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 2.7rem;
}

.related-product-price {
    font-size: 1rem;
    font-weight: 700;
    color: #6366f1;
}

/* Responsive Styles */
@media (max-width: 992px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .main-image-container {
        height: 350px;
    }

    .review-summary {
        flex-direction: column;
    }

    .average-rating {
        padding-right: 0;
        border-right: none;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #e2e8f0;
    }

    .rating-bars {
        padding-left: 0;
    }
}

@media (max-width: 768px) {
    .action-buttons {
        flex-direction: column;
    }

    .add-to-cart-btn,
    .buy-now-btn {
        width: 100%;
    }

    .product-benefits {
        flex-direction: column;
        gap: 15px;
    }

    .tabs-header {
        flex-direction: column;
    }

    .tab-btn {
        width: 100%;
        text-align: left;
        padding: 12px 15px;
    }

    .tab-btn:after {
        display: none;
    }

    .tab-content {
        padding: 20px 15px;
    }

    .related-products-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
}

@media (max-width: 480px) {
    .main-image-container {
        height: 280px;
    }

    .product-price {
        font-size: 1.6rem;
    }

    .product-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .related-products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
