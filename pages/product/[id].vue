<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { useCartStore } from '~/stores/cart';
import  CartNotification from '~/components/CartNotification.vue';
const route = useRoute();
const cartStore = useCartStore();

const product = ref(null);
const loading = ref(true);
const quantity = ref(1);
const activeTab = ref("description");
const relatedProducts = ref([]);
const activeImageIndex = ref(0);

const fetchSingleProduct = async () => {
    try {
        loading.value = true;
        const res = await fetch(
            `https://dummyjson.com/products/${route.params.id}`
        );
        const data = await res.json();
        product.value = data;

        // Fetch related products from the same category
        fetchRelatedProducts(data.category);
    } catch (error) {
        console.error("Error fetching product:", error);
    } finally {
        loading.value = false;
    }
};

const fetchRelatedProducts = async (category) => {
    try {
        const res = await fetch(
            `https://dummyjson.com/products/category/${encodeURIComponent(category)}`
        );
        let data = await res.json();
        // Remove current product and limit to 4 products
        data = data.products.filter((item) => item.id !== product.value.id).slice(0, 4);
        relatedProducts.value = data;
    } catch (error) {
        console.error("Error fetching related products:", error);
    }
};

const incrementQuantity = () => {
    if (quantity.value < product.value.stock) {
        quantity.value++;
    }
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

// DummyJSON already has rating data
const rating = computed(() => {
    return product.value ? {
        rate: product.value.rating,
        count: Math.floor(Math.random() * 100) + 1 // DummyJSON doesn't provide review count
    } : { rate: 0, count: 0 };
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
        return 'https://via.placeholder.com/400x400?text=No+Image';
    }
    return product.value.images[activeImageIndex.value];
});

// Thumbnail Gallery
const thumbnailGallery = computed(() => {
    if (!product.value || !product.value.images) return [];
    return product.value.images.slice(0, 4); // Limit to 4 thumbnails
});

// Function to change active image
const setActiveImage = (index) => {
    if (product.value && product.value.images && index < product.value.images.length) {
        activeImageIndex.value = index;
    }
};

// Function to handle image errors
const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/400x400?text=Error+Loading+Image';
};

// For related product images
const getRelatedProductImage = (relatedProduct) => {
    if (!relatedProduct || !relatedProduct.thumbnail) {
        return 'https://via.placeholder.com/200x200?text=No+Image';
    }
    return relatedProduct.thumbnail;
};

// Cart Integration Functions
const addToCart = () => {
    if (!product.value || product.value.stock === 0) return;
    
    const cartItem = {
        id: product.value.id.toString(),
        name: product.value.title,
        price: product.value.price * 15000, // Convert to IDR
        image: mainImage.value,
        quantity: quantity.value,
        variant: product.value.brand || '',
        store: 'NUVELLA STORE'
    };
    
    cartStore.addToCart(cartItem);
    
    // Reset quantity after adding to cart
    quantity.value = 1;
};

const buyNow = () => {
    addToCart();
    // Navigate to cart page
    navigateTo('/cart');
};

// Check if product is already in cart
const isInCart = computed(() => {
    if (!product.value) return false;
    return cartStore.getItemById(product.value.id.toString()) !== undefined;
});

// Get quantity in cart
const cartQuantity = computed(() => {
    if (!product.value) return 0;
    const item = cartStore.getItemById(product.value.id.toString());
    return item ? item.quantity : 0;
});

onMounted(() => {
    fetchSingleProduct();
    // Load cart from localStorage
    cartStore.loadFromLocalStorage();
});
</script>

<template>
    <div class="product-detail-container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Memuat detail produk...</p>
        </div>
        <CartNotification />
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
                    <div v-if="thumbnailGallery.length > 1" class="thumbnail-gallery">
                        <div 
                            v-for="(image, index) in thumbnailGallery" 
                            :key="index" 
                            class="thumbnail-item"
                            :class="{ active: activeImageIndex === index }"
                            @click="setActiveImage(index)"
                        >
                            <img 
                                :src="image" 
                                :alt="`${product.title} view ${index+1}`"
                                @error="handleImageError"
                            />
                        </div>
                    </div>
                    
                    <div class="image-badge">{{ product.category || 'Uncategorized' }}</div>
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
                        <span class="product-stock in-stock" v-if="product.stock > 0"
                            >✓ Stok Tersedia ({{ product.stock }})</span
                        >
                        <span class="product-stock out-of-stock" v-else
                            >✗ Stok Habis</span
                        >
                    </div>

                    <!-- Cart Status -->
                    <div v-if="isInCart" class="cart-status">
                        <div class="cart-status-badge">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Sudah ada di keranjang ({{ cartQuantity }})</span>
                        </div>
                    </div>

                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button
                                @click="decrementQuantity"
                                :disabled="quantity <= 1"
                                class="quantity-btn"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                v-model="quantity"
                                min="1"
                                :max="product.stock"
                                class="quantity-input"
                            />
                            <button
                                @click="incrementQuantity"
                                :disabled="quantity >= product.stock"
                                class="quantity-btn"
                            >
                                +
                            </button>
                        </div>

                        <div class="action-buttons">
                            <button 
                                @click="addToCart"
                                :disabled="product.stock === 0"
                                class="add-to-cart-btn"
                                :class="{ 'btn-disabled': product.stock === 0 }"
                            >
                                <span class="cart-icon">🛒</span> 
                                {{ isInCart ? 'Tambah Lagi' : 'Tambahkan ke Keranjang' }}
                            </button>
                            <button 
                                @click="buyNow"
                                :disabled="product.stock === 0"
                                class="buy-now-btn"
                                :class="{ 'btn-disabled': product.stock === 0 }"
                            >
                                Beli Sekarang
                            </button>
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
                                <td>{{ product.category || 'Uncategorized' }}</td>
                            </tr>
                            <tr>
                                <th>Merek</th>
                                <td>{{ product.brand || 'Tidak tersedia' }}</td>
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
                                <th>Stok Tersedia</th>
                                <td>{{ product.stock }}</td>
                            </tr>
                            <tr>
                                <th>Diskon</th>
                                <td>{{ product.discountPercentage || 0 }}%</td>
                            </tr>
                        </table>
                    </div>

                    <div v-if="activeTab === 'reviews'" class="tab-pane">
                        <div class="review-summary">
                            <div class="average-rating">
                                <div class="big-rating">{{ rating.rate.toFixed(1) }}</div>
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
                                            :style="{ width: `${(rating.rate >= 4.5 ? 65 : rating.rate >= 4 ? 50 : rating.rate >= 3.5 ? 35 : 20)}%` }"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">
                                        {{ (rating.rate >= 4.5 ? 65 : rating.rate >= 4 ? 50 : rating.rate >= 3.5 ? 35 : 20) }}%
                                    </span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">4 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            :style="{ width: `${(rating.rate >= 4 ? 25 : rating.rate >= 3 ? 30 : 20)}%` }"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">
                                        {{ (rating.rate >= 4 ? 25 : rating.rate >= 3 ? 30 : 20) }}%
                                    </span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">3 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            :style="{ width: `${(rating.rate >= 3 ? 15 : rating.rate >= 2 ? 25 : 20)}%` }"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">
                                        {{ (rating.rate >= 3 ? 15 : rating.rate >= 2 ? 25 : 20) }}%
                                    </span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">2 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            :style="{ width: `${(rating.rate >= 2 ? 5 : rating.rate >= 1 ? 15 : 20)}%` }"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">
                                        {{ (rating.rate >= 2 ? 5 : rating.rate >= 1 ? 15 : 20) }}%
                                    </span>
                                </div>
                                <div class="rating-bar">
                                    <span class="rating-label">1 ★</span>
                                    <div class="bar-container">
                                        <div
                                            class="bar"
                                            :style="{ width: `${(rating.rate >= 1 ? 0 : 20)}%` }"
                                        ></div>
                                    </div>
                                    <span class="rating-percent">
                                        {{ (rating.rate >= 1 ? 0 : 20) }}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p class="no-reviews-msg">
                            Ulasan spesifik tidak tersedia. Data rating disediakan oleh API.
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

        <!-- Cart Drawer -->
        <CartDrawer />
        
        <!-- Cart Notification -->
        <CartNotification />
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
    
    min-height: 100vh;
}

/* Header Navigation */
.product-header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 10px 0;
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

/* Product Grid Layout */
.product-grid {
    display: grid;
    grid-template-columns: minmax(300px, 5fr) 7fr;
    gap: 40px;
    margin-bottom: 40px;
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Product Image Section */
.product-image-section {
    position: relative;
}

.main-image-container {
    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.1);
    height: 400px;
    border: 2px solid rgba(99, 102, 241, 0.1);
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

.thumbnail-gallery {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    justify-content: center;
}

.thumbnail-item {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.3s ease;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
}

.thumbnail-item:hover {
    border-color: #a855f7;
    transform: translateY(-2px);
}

.thumbnail-item.active {
    border-color: #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.image-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 15px;
    line-height: 1.3;
    background: linear-gradient(135deg, #1e293b 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 6px;
}

/* Price Section */
.product-price-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
}

.product-price {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.product-stock {
    font-size: 0.9rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 20px;
}

.in-stock {
    color: #10b981;
    background: #d1fae5;
}

.out-of-stock {
    color: #ef4444;
    background: #fee2e2;
}

/* Cart Status */
.cart-status {
    margin-bottom: 20px;
}

.cart-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    background: white;
}

.quantity-btn {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: none;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6366f1;
}

.quantity-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
}

.quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity-input {
    width: 70px;
    height: 45px;
    border: none;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
    color: #6366f1;
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
    padding: 15px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    position: relative;
    overflow: hidden;
}

.add-to-cart-btn {
    background: white;
    color: #6366f1;
    border: 2px solid #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.add-to-cart-btn:hover:not(.btn-disabled) {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}

.cart-icon {
    margin-right: 8px;
}

.buy-now-btn {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    flex: 1;
}

.buy-now-btn:hover:not(.btn-disabled) {
    background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

/* Product Benefits */
.product-benefits {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #e2e8f0;
}

.benefit-item {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #475569;
    background: #f8fafc;
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
}

.benefit-icon {
    margin-right: 8px;
    font-size: 1.2rem;
}

/* Product Tabs */
.product-tabs {
    margin-top: 40px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    background: white;
}

.tabs-header {
    display: flex;
    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    border-bottom: 2px solid #e2e8f0;
}

.tab-btn {
    padding: 20px 25px;
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    flex: 1;
}

.tab-btn:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: transparent;
    transition: background 0.3s ease;
}

.tab-btn.active {
    color: #6366f1;
    background: white;
}

.tab-btn.active:after {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
}

.tab-btn:hover:not(.active) {
    background: rgba(99, 102, 241, 0.05);
    color: #6366f1;
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
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.product-description {
    line-height: 1.8;
    color: #475569;
    font-size: 1.1rem;
}

/* Product Details Table */
.product-details-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
}

.product-details-table tr {
    border-bottom: 1px solid #e2e8f0;
}

.product-details-table tr:last-child {
    border-bottom: none;
}

.product-details-table tr:nth-child(even) {
    background: #f8fafc;
}

.product-details-table th,
.product-details-table td {
    padding: 15px 20px;
    text-align: left;
}

.product-details-table th {
    width: 30%;
    color: #64748b;
    font-weight: 600;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.product-details-table td {
    color: #1e293b;
    font-weight: 500;
}

/* Reviews Tab */
.review-summary {
    display: flex;
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 2px solid #e2e8f0;
    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    border-radius: 15px;
    padding: 30px;
}

.average-rating {
    flex: 1;
    text-align: center;
    padding-right: 30px;
    border-right: 2px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.big-rating {
    font-size: 3.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
    margin-bottom: 12px;
}

.rating-label {
    width: 40px;
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
}

.bar-container {
    flex: 1;
    height: 14px;
    background-color: #e2e8f0;
    border-radius: 7px;
    margin: 0 15px;
    overflow: hidden;
}

.bar {
    height: 100%;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-radius: 7px;
    transition: width 0.5s ease;
}

.rating-percent {
    width: 40px;
    font-size: 0.9rem;
    color: #64748b;
    text-align: right;
    font-weight: 600;
}

.no-reviews-msg {
    color: #64748b;
    font-style: italic;
    text-align: center;
    padding: 20px 0;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
}

/* Related Products Section */
.related-products {
    margin-top: 50px;
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1e293b 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 25px;
    position: relative;
    padding-bottom: 15px;
}

.section-title:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    border-radius: 2px;
}

.related-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}

.related-product-card {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    background: white;
    border: 1px solid #e2e8f0;
}

.related-product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
    border-color: #6366f1;
}

.related-product-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.related-product-image {
    height: 160px;
    padding: 15px;
    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.related-product-image img {
    max-width: 100%;
    max-height: 130px;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.related-product-card:hover .related-product-image img {
    transform: scale(1.05);
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
    line-height: 1.3;
}

.related-product-price {
    font-size: 1.1rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
        border-bottom: 2px solid #e2e8f0;
    }

    .rating-bars {
        padding-left: 0;
    }

    .product-header-nav {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
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
        padding: 15px 20px;
    }

    .tab-btn:after {
        display: none;
    }

    .tab-content {
        padding: 20px 15px;
    }

    .related-products-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }

    .product-price {
        font-size: 1.6rem;
    }

    .product-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .thumbnail-gallery {
        flex-wrap: wrap;
    }
}

@media (max-width: 480px) {
    .main-image-container {
        height: 280px;
    }

    .product-price {
        font-size: 1.4rem;
    }

    .product-title {
        font-size: 1.6rem;
    }

    .related-products-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .product-detail-container {
        padding: 15px;
    }

    .product-grid {
        padding: 20px;
    }

    .benefit-item {
        font-size: 0.8rem;
        padding: 6px 10px;
    }
}
</style>