<template>
  <div>
    <!-- Main content -->
    <slot />
    
    <!-- Global components -->
    <CartNotification />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.loadFromLocalStorage()
})
</script>