<template>
  <div class="profile-container">
    <h1>Profil Pengguna</h1>
    
    <div v-if="user" class="profile-card">
      <div class="profile-header">
        <img v-if="user.photoURL" :src="user.photoURL" alt="Foto Profil" class="profile-image">
        <div v-else class="profile-image-placeholder">{{ user.displayName?.charAt(0) || user.email?.charAt(0) }}</div>
        
        <div class="profile-info">
          <h2>{{ user.displayName || 'Pengguna' }}</h2>
          <p>{{ user.email }}</p>
        </div>
      </div>
      
      <div class="profile-details">
        <p><strong>User ID:</strong> {{ user.uid }}</p>
        <!-- Tambahkan detail profil lainnya yang ingin ditampilkan -->
      </div>
      
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
    
    <div v-else>
      <p>Anda belum login. Silakan <NuxtLink to="/login">login</NuxtLink> terlebih dahulu.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

// Middleware untuk memastikan pengguna sudah login
onMounted(() => {
  if (!user.value) {
    router.push('/login')
  }
})

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}

.profile-image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-right: 20px;
}

.logout-button {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>