<!-- CartNotification.vue -->
<template>
  <!-- Notification Overlay -->
  <div
    v-if="cartStore.showNotification"
    class="notification-overlay"
    @click="closeNotification"
  >
    <div class="notification-modal" @click.stop>
      <!-- Header -->
      <div class="notification-header">
        <div class="success-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="notification-title">Berhasil Ditambahkan</h3>
        <button @click="closeNotification" class="close-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Product Info -->
      <div class="notification-content" v-if="cartStore.lastAddedItem">
        <div class="product-info">
          <img 
            :src="cartStore.lastAddedItem.image" 
            :alt="cartStore.lastAddedItem.name"
            class="product-image"
            @error="handleImageError"
          />
          <div class="product-details">
            <h4 class="product-name">{{ cartStore.lastAddedItem.name }}</h4>
            <p class="product-price">Rp{{ formatPrice(cartStore.lastAddedItem.price) }}</p>
            <p class="product-quantity">Qty: {{ cartStore.lastAddedItem.quantity }}</p>
          </div>
        </div>
      </div>

      <!-- Suggested Products -->
      <div class="suggested-section" v-if="suggestedProducts.length > 0">
        <h4 class="suggested-title">Kamu Mungkin Juga Suka</h4>
        <div class="suggested-grid">
          <div 
            v-for="product in suggestedProducts" 
            :key="product.id"
            class="suggested-item"
            @click="goToProduct(product.id)"
          >
            <img 
              :src="getProductImage(product)" 
              :alt="product.title"
              class="suggested-image"
              @error="handleImageError"
            />
            <div class="suggested-info">
              <p class="suggested-name">{{ truncateText(product.title, 40) }}</p>
              <p class="suggested-price">Rp{{ formatPrice(product.price * 15000) }}</p>
              <div class="suggested-rating">
                <span class="rating-stars">{{ renderStars(product.rating) }}</span>
                <span class="rating-count">({{ Math.floor(Math.random() * 100) + 1 }})</span>
              </div>
            </div>
            <div class="discount-badge" v-if="product.discountPercentage > 0">
              -{{ Math.round(product.discountPercentage) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="notification-actions">
        <button @click="viewCart" class="view-cart-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5H19"></path>
          </svg>
          Lihat Keranjang
        </button>
        <button @click="continueShopping" class="continue-btn">
          Lanjut Belanja
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

// Suggested products state
const suggestedProducts = ref([])

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=No+Image'
}

const getProductImage = (product) => {
  if (!product || !product.images || product.images.length === 0) {
    return 'https://via.placeholder.com/150x150?text=No+Image'
  }
  return product.thumbnail || product.images[0]
}

const truncateText = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const renderStars = (rating) => {
  const stars = []
  const rate = Math.round(rating)
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rate) {
      stars.push("★")
    } else {
      stars.push("☆")
    }
  }
  
  return stars.join("")
}

const closeNotification = () => {
  cartStore.hideNotification()
}

const viewCart = () => {
  closeNotification()
  navigateTo('/cart')
}

const continueShopping = () => {
  closeNotification()
}

const goToProduct = (productId) => {
  closeNotification()
  navigateTo(`/product/${productId}`)
}

// Fetch suggested products
const fetchSuggestedProducts = async () => {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=6&skip=' + Math.floor(Math.random() * 50))
    const data = await response.json()
    suggestedProducts.value = data.products.slice(0, 6)
  } catch (error) {
    console.error('Error fetching suggested products:', error)
  }
}

// Watch for notification changes
watch(() => cartStore.showNotification, (newValue) => {
  if (newValue) {
    fetchSuggestedProducts()
    
    // Auto close after 8 seconds if user doesn't interact
    setTimeout(() => {
      if (cartStore.showNotification) {
        closeNotification()
      }
    }, 8000)
  }
})

onMounted(() => {
  fetchSuggestedProducts()
})
</script>

<style scoped>
.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.notification-modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.notification-header {
  display: flex;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 20px 20px 0 0;
}

.success-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.notification-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(107, 114, 128, 0.2);
  color: #374151;
}

/* Content */
.notification-content {
  padding: 20px 24px;
}

.product-info {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
  border-radius: 12px;
  border: 2px solid rgba(99, 102, 241, 0.1);
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid rgba(99, 102, 241, 0.2);
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.4;
}

.product-price {
  font-size: 1.125rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.product-quantity {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Suggested Products */
.suggested-section {
  padding: 0 24px 20px;
}

.suggested-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.suggested-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.suggested-item {
  position: relative;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.suggested-item:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

.suggested-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f9fafb;
}

.suggested-info {
  text-align: left;
}

.suggested-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  line-height: 1.3;
  height: 2.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.suggested-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 4px;
}

.suggested-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-stars {
  color: #f59e0b;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.rating-count {
  font-size: 0.7rem;
  color: #6b7280;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Actions */
.notification-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.view-cart-btn {
  flex: 1;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.view-cart-btn:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.continue-btn {
  flex: 1;
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-btn:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .notification-modal {
    margin: 10px;
    max-height: 90vh;
  }
  
  .suggested-grid {
    grid-template-columns: 1fr;
  }
  
  .notification-actions {
    flex-direction: column;
  }
  
  .suggested-item {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .suggested-image {
    width: 60px;
    height: 60px;
    margin-bottom: 0;
    flex-shrink: 0;
  }
  
  .suggested-info {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .notification-overlay {
    padding: 10px;
  }
  
  .notification-header {
    padding: 16px 20px 12px;
  }
  
  .notification-content {
    padding: 16px 20px;
  }
  
  .suggested-section {
    padding: 0 20px 16px;
  }
  
  .notification-actions {
    padding: 0 20px 20px;
  }
  
  .product-info {
    padding: 12px;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>