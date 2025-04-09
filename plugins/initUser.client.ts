export default defineNuxtPlugin(() => {
    const user = useAuth();
    if (process.client) {
        const storedUser = localStorage.getItem("user");
        if (storedUser && !user.value) {
            try {
                user.value = JSON.parse(storedUser);
            } catch {
                user.value = null;
            }
        }
    }
});
