<template>
  <div class="min-h-screen bg-gradient-to-br ">


    <!-- Empty Cart State -->
    <div v-if="cartStore.items.length === 0" class="max-w-4xl mx-auto px-4 py-16 text-center">
      <div class="bg-white rounded-2xl shadow-xl p-12 border border-purple-100">
        <div class="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5H19"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Keranjang Anda Kosong</h2>
        <p class="text-gray-600 mb-8">Belum ada produk yang ditambahkan ke keranjang. Yuk, mulai belanja sekarang!</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          Mulai Belanja
        </NuxtLink>
      </div>
    </div>

    <!-- Cart Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Select All -->
          <div class="bg-white rounded-xl shadow-lg border border-purple-100 p-4">
            <div class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
              />
              <span class="text-sm font-medium text-gray-900">Pilih Semua ({{ cartItems.length }})</span>
            </div>
          </div>

          <!-- Store Items -->
          <div v-for="store in stores" :key="store.id" class="bg-white rounded-xl shadow-lg border border-purple-100">
            <!-- Store Header -->
            <div class="border-b border-purple-100 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl">
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  v-model="store.selected"
                  @change="toggleStoreSelection(store)"
                  class="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                />
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span class="font-semibold text-gray-900">{{ store.name }}</span>
                </div>
              </div>
            </div>

            <!-- Store Items -->
            <div class="divide-y divide-purple-100">
              <div
                v-for="item in store.items"
                :key="item.id"
                class="p-4 flex items-start space-x-4 hover:bg-purple-25 transition-colors"
              >
                <input
                  type="checkbox"
                  v-model="item.selected"
                  @change="updateItemSelection"
                  class="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 mt-2"
                />
                
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-20 h-20 object-cover rounded-xl border border-purple-200 shadow-sm"
                    @error="handleImageError"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ item.name }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1" v-if="item.variant">{{ item.variant }}</p>
                  <p class="text-xs text-purple-600 mt-1">{{ item.store }}</p>
                  
                  <!-- Price and Quantity Controls -->
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex flex-col">
                      <span class="text-lg font-bold text-gray-900">
                        Rp{{ formatPrice(item.price) }}
                      </span>
                      <span v-if="item.originalPrice" class="text-sm text-gray-500 line-through">
                        Rp{{ formatPrice(item.originalPrice) }}
                      </span>
                    </div>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-3">
                      <button
                        @click="decreaseQuantity(item)"
                        :disabled="item.quantity <= 1"
                        class="w-8 h-8 rounded-full border border-purple-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 text-purple-600 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      
                      <span class="w-8 text-center font-medium text-purple-700">{{ item.quantity }}</span>
                      
                      <button
                        @click="increaseQuantity(item)"
                        class="w-8 h-8 rounded-full border border-purple-300 flex items-center justify-center hover:bg-purple-50 text-purple-600 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col space-y-2">
                  <button 
                    @click="toggleWishlist(item)"
                    :class="[
                      'transition-colors',
                      item.inWishlist ? 'text-red-500 hover:text-red-600' : 'text-purple-400 hover:text-purple-600'
                    ]"
                    :title="item.inWishlist ? 'Hapus dari wishlist' : 'Tambahkan ke wishlist'"
                  >
                    <svg class="w-5 h-5" :fill="item.inWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                  <button
                    @click="removeItem(item)"
                    class="text-purple-400 hover:text-red-500 transition-colors"
                    title="Hapus dari keranjang"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Bar -->
          <div class="bg-white rounded-xl shadow-lg border border-purple-100 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">{{ selectedItemsCount }} item dipilih</span>
                <span class="text-xs text-purple-600" v-if="selectedItemsCount > 0">
                  Total: Rp{{ formatPrice(subtotal) }}
                </span>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  @click="selectAllItems"
                  class="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Pilih Semua
                </button>
                <button
                  @click="clearSelectedItems"
                  :disabled="selectedItemsCount === 0"
                  class="text-sm text-red-600 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Hapus Dipilih ({{ selectedItemsCount }})
                </button>
                <button
                  @click="clearCart"
                  :disabled="cartItems.length === 0"
                  class="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-xl shadow-lg border border-purple-100 p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Ringkasan Belanja</h3>
            
            <!-- Promo Banner -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-3 mb-4 flex items-center space-x-3 cursor-pointer hover:from-purple-100 hover:to-blue-100 transition-all">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span class="text-xs font-bold text-white">%</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ selectedItemsCount > 0 ? 'Gunakan Promo' : 'Pilih barang dulu sebelum pakai promo' }}</p>
                <p class="text-xs text-gray-600" v-if="selectedItemsCount > 0">Hemat lebih banyak dengan kode promo</p>
              </div>
              <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <!-- Summary Details -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total ({{ selectedItemsCount }} barang)</span>
                <span class="font-medium">Rp{{ formatPrice(subtotal) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total Ongkos Kirim</span>
                <span class="font-medium">{{ shippingCost ? `Rp${formatPrice(shippingCost)}` : '-' }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Biaya Layanan</span>
                <span class="font-medium">{{ serviceFee ? `Rp${formatPrice(serviceFee)}` : '-' }}</span>
              </div>
              
              <div class="flex justify-between text-sm text-green-600" v-if="discount > 0">
                <span>Diskon</span>
                <span>-Rp{{ formatPrice(discount) }}</span>
              </div>
              
              <hr class="border-purple-200" />
              
              <div class="flex justify-between text-lg font-bold text-purple-700">
                <span>Total Pembayaran</span>
                <span>{{ total ? `Rp${formatPrice(total)}` : '-' }}</span>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              @click="checkout"
              :disabled="selectedItemsCount === 0"
              class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <span v-if="selectedItemsCount === 0">Pilih Produk Dulu</span>
              <span v-else>Checkout ({{ selectedItemsCount }})</span>
            </button>

            <!-- Continue Shopping -->
            <NuxtLink
              to="/product"
              class="w-full mt-3 bg-white border-2 border-purple-600 text-purple-600 py-3 px-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 text-center block"
            >
              Lanjut Belanja
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :isVisible="showConfirmModal"
      :type="confirmConfig.type"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :details="confirmConfig.details"
      :confirmText="confirmConfig.confirmText"
      :cancelText="confirmConfig.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

// Reactive data
const selectAll = ref(false)
const discount = ref(0) // For future promo functionality

// Confirmation modal state
const showConfirmModal = ref(false)
const confirmConfig = ref({
  type: 'warning',
  title: 'Konfirmasi',
  message: '',
  details: [],
  confirmText: 'Ya',
  cancelText: 'Batal'
})
let confirmResolve = null

// Group cart items by store
const stores = computed(() => {
  const groupedByStore = cartStore.items.reduce((acc, item) => {
    const storeName = item.store || 'NUVELLA STORE'
    if (!acc[storeName]) {
      acc[storeName] = {
        id: storeName.toLowerCase().replace(/\s+/g, '-'),
        name: storeName,
        selected: false,
        items: []
      }
    }
    acc[storeName].items.push({
      ...item,
      selected: item.selected || false,
      inWishlist: item.inWishlist || false
    })
    return acc
  }, {})

  return Object.values(groupedByStore)
})

// Computed properties
const cartItems = computed(() => {
  return stores.value.flatMap(store => store.items)
})

const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected)
})

const selectedItemsCount = computed(() => {
  return selectedItems.value.reduce((total, item) => total + item.quantity, 0)
})

const subtotal = computed(() => {
  return selectedItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const shippingCost = computed(() => {
  return selectedItems.value.length > 0 ? 15000 : 0
})

const serviceFee = computed(() => {
  return selectedItems.value.length > 0 ? 2000 : 0
})

const total = computed(() => {
  return subtotal.value + shippingCost.value + serviceFee.value - discount.value
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=No+Image'
}

// Confirmation helper
const showConfirmation = (config) => {
  return new Promise((resolve) => {
    confirmConfig.value = { ...confirmConfig.value, ...config }
    showConfirmModal.value = true
    confirmResolve = resolve
  })
}

const handleConfirm = () => {
  showConfirmModal.value = false
  if (confirmResolve) {
    confirmResolve(true)
    confirmResolve = null
  }
}

const handleCancel = () => {
  showConfirmModal.value = false
  if (confirmResolve) {
    confirmResolve(false)
    confirmResolve = null
  }
}

const toggleSelectAll = () => {
  stores.value.forEach(store => {
    store.selected = selectAll.value
    store.items.forEach(item => {
      item.selected = selectAll.value
      // Update in cart store
      const cartItem = cartStore.items.find(ci => ci.id === item.id)
      if (cartItem) {
        cartItem.selected = selectAll.value
      }
    })
  })
  cartStore.saveToLocalStorage()
}

const toggleStoreSelection = (store) => {
  store.items.forEach(item => {
    item.selected = store.selected
    // Update in cart store
    const cartItem = cartStore.items.find(ci => ci.id === item.id)
    if (cartItem) {
      cartItem.selected = store.selected
    }
  })
  updateSelectAll()
  cartStore.saveToLocalStorage()
}

const updateItemSelection = () => {
  // Update store selection based on items
  stores.value.forEach(store => {
    const allSelected = store.items.every(item => item.selected)
    store.selected = allSelected
    
    // Update cart store
    store.items.forEach(item => {
      const cartItem = cartStore.items.find(ci => ci.id === item.id)
      if (cartItem) {
        cartItem.selected = item.selected
      }
    })
  })
  updateSelectAll()
  cartStore.saveToLocalStorage()
}

const updateSelectAll = () => {
  const allItems = cartItems.value
  selectAll.value = allItems.length > 0 && allItems.every(item => item.selected)
}

const increaseQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = async (itemToRemove) => {
  const confirmed = await showConfirmation({
    type: 'danger',
    title: 'Hapus Produk',
    message: `Apakah Anda yakin ingin menghapus "${itemToRemove.name}" dari keranjang?`,
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (confirmed) {
    cartStore.removeFromCart(itemToRemove.id)
    cartStore.showSimpleNotification('Produk berhasil dihapus dari keranjang!')
  }
}

const toggleWishlist = (item) => {
  // Toggle wishlist status
  item.inWishlist = !item.inWishlist
  
  // Update in cart store
  const cartItem = cartStore.items.find(ci => ci.id === item.id)
  if (cartItem) {
    cartItem.inWishlist = item.inWishlist
  }
  
  cartStore.saveToLocalStorage()
  
  // Show notification
  const message = item.inWishlist ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist'
  cartStore.showSimpleNotification(message)
}

const selectAllItems = () => {
  selectAll.value = true
  toggleSelectAll()
}

const clearSelectedItems = async () => {
  if (selectedItemsCount.value === 0) return
  
  const confirmed = await showConfirmation({
    type: 'warning',
    title: 'Hapus Produk Terpilih',
    message: `Apakah Anda yakin ingin menghapus ${selectedItemsCount.value} produk yang dipilih?`,
    details: [
      { label: 'Jumlah produk', value: `${selectedItemsCount.value} item` },
      { label: 'Total nilai', value: `Rp${formatPrice(subtotal.value)}` }
    ],
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (confirmed) {
    const selectedIds = selectedItems.value.map(item => item.id)
    selectedIds.forEach(id => {
      cartStore.removeFromCart(id)
    })
    cartStore.showSimpleNotification(`${selectedItemsCount.value} produk berhasil dihapus!`)
  }
}

const clearCart = async () => {
  if (cartItems.value.length === 0) return
  
  const confirmed = await showConfirmation({
    type: 'warning',
    title: 'Kosongkan Keranjang',
    message: 'Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?',
    details: [
      { label: 'Total produk', value: `${cartItems.value.length} item` },
      { label: 'Total nilai', value: `Rp${formatPrice(cartStore.totalPrice)}` }
    ],
    confirmText: 'Ya, Kosongkan',
    cancelText: 'Batal'
  })
  
  if (confirmed) {
    cartStore.clearCart()
  }
}

const checkout = async () => {
  if (selectedItemsCount.value > 0) {
    const confirmed = await showConfirmation({
      type: 'info',
      title: 'Konfirmasi Checkout',
      message: 'Apakah Anda yakin ingin melanjutkan ke halaman pembayaran?',
      details: [
        { label: 'Produk dipilih', value: `${selectedItemsCount.value} item` },
        { label: 'Total pembayaran', value: `Rp${formatPrice(total.value)}` }
      ],
      confirmText: 'Ya, Checkout',
      cancelText: 'Periksa Lagi'
    })
    
    if (confirmed) {
      // Save selected items for checkout
      const checkoutItems = selectedItems.value.map(item => ({
        ...item,
        subtotal: item.price * item.quantity
      }))
      
      // Navigate to checkout with selected items
      navigateTo({
        path: '/checkout',
        query: {
          items: JSON.stringify(checkoutItems),
          total: total.value,
          shipping: shippingCost.value,
          service: serviceFee.value,
          discount: discount.value
        }
      })
    }
  }
}

// Load cart from localStorage on mount and sync with local state
onMounted(() => {
  cartStore.loadFromLocalStorage()
  
  // Initialize selection state for existing items
  cartStore.items.forEach(item => {
    if (item.selected === undefined) {
      item.selected = false
    }
    if (item.inWishlist === undefined) {
      item.inWishlist = false
    }
  })
})

// Watch for changes in cart store and update local state
watch(() => cartStore.items, () => {
  // Sync selection state
  updateSelectAll()
}, { deep: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom purple shade for hover states */
.hover\:bg-purple-25:hover {
  background-color: rgb(250 245 255);
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease-in-out;
}

/* Enhanced shadow effects */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05);
}

/* Gradient text effect for total */
.text-gradient {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animation for empty cart */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lg\:col-span-8, .lg\:col-span-4 {
    grid-column: span 12;
  }
  
  .sticky {
    position: relative !important;
    top: auto !important;
  }
}
</style>