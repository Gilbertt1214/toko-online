<template>
  <div>
    <!-- Main content -->
    <slot />
    
    <!-- Global components -->
    <CartNotification />
    <ConfirmationModal />
    <ChatPopup />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import CartNotification from '~/components/CartNotification.vue'




const cartStore = useCartStore()

onMounted(() => {
  cartStore.loadFromLocalStorage()
})
</script>