export default defineNuxtPlugin(() => {
    // Auto-load cart from localStorage when app starts
    const cartStore = useCartStore();
    cartStore.loadFromLocalStorage();
});
