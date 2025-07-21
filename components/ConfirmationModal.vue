<!-- ConfirmationModal.vue -->
<template>
  <!-- Confirmation Overlay -->
  <div
    v-if="isVisible"
    class="confirmation-overlay"
    @click="handleBackdropClick"
  >
    <div class="confirmation-modal" @click.stop>
      <!-- Icon Container -->
      <div class="icon-container">
        <div class="warning-icon" v-if="type === 'warning'">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="danger-icon" v-else-if="type === 'danger'">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <div class="info-icon" v-else>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
        
        <!-- Additional Info -->
        <div v-if="details" class="modal-details">
          <div class="details-container">
            <div v-for="detail in details" :key="detail.label" class="detail-item">
              <span class="detail-label">{{ detail.label }}:</span>
              <span class="detail-value">{{ detail.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions">
        <button
          @click="handleCancel"
          class="cancel-btn"
          :disabled="loading"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          :class="[
            'confirm-btn',
            {
              'danger': type === 'danger',
              'warning': type === 'warning',
              'loading': loading
            }
          ]"
          :disabled="loading"
        >
          <div v-if="loading" class="loading-spinner"></div>
          <span :class="{ 'opacity-0': loading }">{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'info'
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  },
  title: {
    type: String,
    default: 'Konfirmasi'
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: Array,
    default: () => []
  },
  confirmText: {
    type: String,
    default: 'Ya, Hapus'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  allowBackdropClose: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['confirm', 'cancel', 'close'])

// State
const loading = ref(false)

// Methods
const handleConfirm = async () => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
    emit('confirm')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (!loading.value) {
    emit('cancel')
  }
}

const handleBackdropClick = () => {
  if (props.allowBackdropClose && !loading.value) {
    emit('cancel')
  }
}

// Watch for visibility changes to handle body scroll
watch(() => props.isVisible, (newValue) => {
  if (typeof document !== 'undefined') {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<style scoped>
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirmation-modal {
  background: white;
  border-radius: 24px;
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: slideUp 0.3s ease-out;
  position: relative;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Icon Container */
.icon-container {
  display: flex;
  justify-content: center;
  padding: 32px 32px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
}

.warning-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 20px 25px -5px rgba(245, 158, 11, 0.4),
    0 0 0 1px rgba(245, 158, 11, 0.1);
  animation: pulse 2s infinite;
}

.danger-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 20px 25px -5px rgba(239, 68, 68, 0.4),
    0 0 0 1px rgba(239, 68, 68, 0.1);
  animation: pulse 2s infinite;
}

.info-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 20px 25px -5px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(59, 130, 246, 0.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 
      0 20px 25px -5px rgba(245, 158, 11, 0.4),
      0 0 0 1px rgba(245, 158, 11, 0.1),
      0 0 0 0px rgba(245, 158, 11, 0.7);
  }
  50% {
    box-shadow: 
      0 20px 25px -5px rgba(245, 158, 11, 0.4),
      0 0 0 1px rgba(245, 158, 11, 0.1),
      0 0 0 8px rgba(245, 158, 11, 0);
  }
}

/* Content */
.modal-content {
  padding: 0 32px 24px;
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1f2937 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-message {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

.modal-details {
  margin-top: 20px;
}

.details-container {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  padding: 24px 32px 32px;
  background: #f9fafb;
}

.cancel-btn {
  flex: 1;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  padding: 14px 20px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
  transform: translateY(-1px);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-btn {
  flex: 1;
  border: none;
  padding: 14px 20px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.confirm-btn.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 8px 16px rgba(245, 158, 11, 0.3);
}

.confirm-btn.warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(245, 158, 11, 0.4);
}

.confirm-btn.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
}

.confirm-btn.danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(239, 68, 68, 0.4);
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

/* Loading Spinner */
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .confirmation-modal {
    margin: 20px;
    max-width: none;
  }
  
  .icon-container {
    padding: 24px 24px 20px;
  }
  
  .warning-icon,
  .danger-icon,
  .info-icon {
    width: 64px;
    height: 64px;
  }
  
  .modal-content {
    padding: 0 24px 20px;
  }
  
  .modal-actions {
    padding: 20px 24px 24px;
    flex-direction: column;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .modal-message {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .confirmation-overlay {
    padding: 10px;
  }
  
  .confirmation-modal {
    margin: 10px;
  }
}
</style>