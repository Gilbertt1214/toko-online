<template>
    <div>
        <Navbar v-if="!isAuthPage" />
        <NuxtPage />
        <Footer v-if="!isAuthPage" />
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const isAuthPage = computed(() => ["/login", "/register"].includes(route.path));

useHead({
    title: "Toko Online",
    meta: [
        {
            name: "description",
            content:
                "Selamat datang di toko online kami. Temukan produk terbaik dengan harga terjangkau dan pelayanan maksimal.",
        },
    ],
});
</script>
