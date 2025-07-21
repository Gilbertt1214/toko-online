// composables/useConfirmation.js
import { ref } from "vue";

export const useConfirmation = () => {
    const isVisible = ref(false);
    const config = ref({
        type: "warning",
        title: "Konfirmasi",
        message: "",
        details: [],
        confirmText: "Ya, Lanjutkan",
        cancelText: "Batal",
        allowBackdropClose: false,
    });

    let resolvePromise = null;
    let rejectPromise = null;

    const showConfirmation = (options = {}) => {
        return new Promise((resolve, reject) => {
            // Store promise resolvers
            resolvePromise = resolve;
            rejectPromise = reject;

            // Update config
            config.value = {
                ...config.value,
                ...options,
            };

            // Show modal
            isVisible.value = true;
        });
    };

    const handleConfirm = () => {
        isVisible.value = false;
        if (resolvePromise) {
            resolvePromise(true);
            resolvePromise = null;
            rejectPromise = null;
        }
    };

    const handleCancel = () => {
        isVisible.value = false;
        if (resolvePromise) {
            resolvePromise(false);
            resolvePromise = null;
            rejectPromise = null;
        }
    };

    // Predefined confirmation types
    const confirmDelete = (itemName, count = 1) => {
        return showConfirmation({
            type: "danger",
            title: "Hapus Produk",
            message:
                count === 1
                    ? `Apakah Anda yakin ingin menghapus "${itemName}" dari keranjang?`
                    : `Apakah Anda yakin ingin menghapus ${count} produk yang dipilih?`,
            details:
                count > 1
                    ? [
                          { label: "Jumlah produk", value: `${count} item` },
                          { label: "Aksi", value: "Hapus permanen" },
                      ]
                    : [],
            confirmText: "Ya, Hapus",
            cancelText: "Batal",
        });
    };

    const confirmClearCart = (itemCount) => {
        return showConfirmation({
            type: "warning",
            title: "Kosongkan Keranjang",
            message:
                "Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?",
            details: [
                { label: "Total produk", value: `${itemCount} item` },
                { label: "Aksi", value: "Hapus semua produk" },
            ],
            confirmText: "Ya, Kosongkan",
            cancelText: "Batal",
        });
    };

    const confirmCheckout = (selectedCount, total) => {
        return showConfirmation({
            type: "info",
            title: "Konfirmasi Checkout",
            message:
                "Apakah Anda yakin ingin melanjutkan ke halaman pembayaran?",
            details: [
                { label: "Produk dipilih", value: `${selectedCount} item` },
                {
                    label: "Total pembayaran",
                    value: `Rp ${new Intl.NumberFormat("id-ID").format(total)}`,
                },
            ],
            confirmText: "Ya, Checkout",
            cancelText: "Periksa Lagi",
        });
    };

    return {
        // State
        isVisible,
        config,

        // Methods
        showConfirmation,
        handleConfirm,
        handleCancel,

        // Predefined confirmations
        confirmDelete,
        confirmClearCart,
        confirmCheckout,
    };
};
