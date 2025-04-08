// middleware/auth.ts
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Fungsi untuk mendapatkan user saat ini dari Firebase
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                unsubscribe();
                resolve(user);
            },
            reject
        );
    });
};

const user = ref(null);

export const useAuthUser = () => {
    return {
        user,
        setUser: (val: null) => (user.value = val),
        clearUser: () => (user.value = null),
    };
};


export default defineNuxtRouteMiddleware(async (to, from) => {
    // Periksa status autentikasi user
    const user = await getCurrentUser();

    // Jika tidak ada user dan mencoba mengakses halaman yang memerlukan autentikasi
    if (!user && to.path !== "/login" && to.path !== "/register") {
        return navigateTo("/login");
    }

    // Jika user sudah login dan mencoba mengakses halaman login/register
    if (user && (to.path === "/login" || to.path === "/register")) {
        return navigateTo("/");
    }
});
