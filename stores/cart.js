// stores/cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
    state: () => ({
        items: [],
        isOpen: false,
        showNotification: false,
        lastAddedItem: null,
    }),

    getters: {
        totalItems: (state) => {
            return state.items.reduce(
                (total, item) => total + item.quantity,
                0
            );
        },

        totalPrice: (state) => {
            return state.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
        },

        cartItemsCount: (state) => state.items.length,

        getItemById: (state) => (id) => {
            return state.items.find((item) => item.id === id);
        },
    },

    actions: {
        addToCart(product) {
            const existingItem = this.items.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                // Jika item sudah ada, tambah quantity
                existingItem.quantity += product.quantity || 1;
                // Update lastAddedItem with new quantity
                this.lastAddedItem = {
                    ...existingItem,
                    quantity: product.quantity || 1, // Show only the added quantity
                };
            } else {
                // Jika item baru, tambah ke cart
                const newItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    variant: product.variant || "",
                    quantity: product.quantity || 1,
                    selected: false,
                    store: product.store || "NUVELLA STORE",
                    inWishlist: false,
                };
                this.items.push(newItem);
                this.lastAddedItem = { ...newItem };
            }

            // Simpan ke localStorage
            this.saveToLocalStorage();

            // Show notification popup
            this.showCartNotification();
        },

        removeFromCart(productId) {
            const index = this.items.findIndex((item) => item.id === productId);
            if (index > -1) {
                this.items.splice(index, 1);
                this.saveToLocalStorage();
                this.showSimpleNotification("Produk dihapus dari keranjang!");
            }
        },

        updateQuantity(productId, quantity) {
            const item = this.items.find((item) => item.id === productId);
            if (item) {
                if (quantity <= 0) {
                    this.removeFromCart(productId);
                } else {
                    item.quantity = quantity;
                    this.saveToLocalStorage();
                }
            }
        },

        clearCart() {
            this.items = [];
            this.saveToLocalStorage();
            this.showSimpleNotification("Keranjang dikosongkan!");
        },

        toggleCartDrawer() {
            this.isOpen = !this.isOpen;
        },

        showCartNotification() {
            this.showNotification = true;
        },

        hideNotification() {
            this.showNotification = false;
            this.lastAddedItem = null;
        },

        saveToLocalStorage() {
            if (process.client) {
                localStorage.setItem(
                    "nuvella-cart",
                    JSON.stringify(this.items)
                );
            }
        },

        loadFromLocalStorage() {
            if (process.client) {
                const savedCart = localStorage.getItem("nuvella-cart");
                if (savedCart) {
                    this.items = JSON.parse(savedCart);
                }
            }
        },

        showSimpleNotification(message) {
            // Simple toast notification for other actions
            if (process.client) {
                const notification = document.createElement("div");
                notification.className =
                    "fixed top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300";
                notification.textContent = message;
                document.body.appendChild(notification);

                // Add animation
                setTimeout(() => {
                    notification.style.transform = "translateX(0)";
                }, 100);

                // Remove after 3 seconds
                setTimeout(() => {
                    notification.style.transform = "translateX(100%)";
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }, 3000);
            }
        },
    },
});
