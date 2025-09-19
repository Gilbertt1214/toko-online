<!-- components/ChatPopup.vue - FREE AI API VERSION -->
<template>
    <div class="chat-widget">
        <!-- Chat Toggle Button -->
        <button
            @click="toggleChat"
            class="chat-toggle-btn"
            :class="{ 'chat-open': isOpen }"
        >
            <svg v-if="!isOpen" class="chat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7-4L3 20l4-3a8.013 8.013 0 014-7c4.418 0 8 3.582 8 8z" />
            </svg>
            <svg v-else class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            
            <span v-if="unreadCount > 0 && !isOpen" class="unread-badge">
                {{ unreadCount }}
            </span>
        </button>

        <!-- Chat Window -->
        <div v-if="isOpen" class="chat-popup">
            <!-- Chat Header -->
            <div class="chat-header">
                <div class="chat-title">
                    <h3>AI Assistant</h3>
                    <p class="chat-subtitle">
                        <span class="status-dot"></span>
                        {{ isOnline ? 'Online' : 'Offline' }} - {{ currentModel }}
                    </p>
                </div>
                <div class="header-controls">
                    <!-- Model Selector -->
                    <select v-model="selectedModel" @change="changeModel" class="model-selector">
                        <option value="microsoft/DialoGPT-medium">DialoGPT</option>
                        <option value="facebook/blenderbot-400M-distill">BlenderBot</option>
                        <option value="microsoft/DialoGPT-small">DialoGPT-Small</option>
                    </select>
                    <button @click="closeChat" class="close-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Messages -->
            <div ref="messagesContainer" class="chat-messages">
                <div
                    v-for="message in messages"
                    :key="message.id"
                    class="message"
                    :class="{ 'user-message': message.isUser, 'ai-message': !message.isUser }"
                >
                    <div class="message-content">
                        <p>{{ message.text }}</p>
                        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="message ai-message error-message">
                    <div class="message-content">
                        <p>❌ {{ error }}</p>
                        <button @click="retryLastMessage" class="retry-btn">Coba Lagi</button>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div v-if="isTyping" class="message ai-message typing-message">
                    <div class="message-content">
                        <div class="typing-indicator">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div v-if="messages.length <= 1 && !isTyping" class="quick-actions">
                <p class="quick-actions-title">Pertanyaan Populer:</p>
                <div class="quick-actions-grid">
                    <button
                        v-for="action in quickActions"
                        :key="action.id"
                        @click="handleQuickActionClick(action.text)"
                        class="quick-action-btn"
                        :disabled="isTyping || !isOnline"
                    >
                        {{ action.text }}
                    </button>
                </div>
            </div>

            <!-- Chat Input -->
            <div class="chat-input-container">
                <form @submit.prevent="handleSendMessage" class="chat-input-form">
                    <input
                        v-model="inputMessage"
                        type="text"
                        placeholder="Ketik pesan Anda..."
                        class="chat-input"
                        :disabled="isTyping || !isOnline"
                        maxlength="500"
                        ref="chatInput"
                    />
                    <button
                        type="submit"
                        :disabled="!inputMessage.trim() || isTyping || !isOnline"
                        class="send-btn"
                        :class="{ 'sending': isTyping }"
                    >
                        <svg v-if="!isTyping" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <svg v-else class="spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </form>
                
                <div class="chat-footer">
                    <p class="chat-disclaimer">
                        🤖 Powered by Hugging Face • Free AI Models
                    </p>
                    <p class="api-status" :class="{ 'online': isOnline, 'offline': !isOnline }">
                        {{ isOnline ? '🟢 API Connected' : '🔴 API Disconnected' }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'

// State management
const isOpen = ref(false)
const unreadCount = ref(0)
const messages = ref([
    {
        id: 'welcome',
        text: 'Halo! Saya adalah AI Assistant yang menggunakan Hugging Face API. Ada yang bisa saya bantu? 😊',
        isUser: false,
        timestamp: new Date().toISOString()
    }
])
const isTyping = ref(false)
const isOnline = ref(true)
const error = ref('')
const inputMessage = ref('')
const messagesContainer = ref(null)
const chatInput = ref(null)
const lastUserMessage = ref('')

// AI Configuration
const selectedModel = ref('facebook/blenderbot-400M-distill')
const availableModels = {
    'microsoft/DialoGPT-medium': 'DialoGPT',
    'facebook/blenderbot-400M-distill': 'BlenderBot',
    'microsoft/DialoGPT-small': 'DialoGPT-Small'
}

const currentModel = computed(() => {
    return availableModels[selectedModel.value] || 'AI Model'
})

// Quick Actions
const quickActions = [
    { id: 1, text: 'Apa kabar?' },
    { id: 2, text: 'Ceritakan tentang dirimu' },
    { id: 3, text: 'Apa yang bisa kamu lakukan?' },
    { id: 4, text: 'Berikan saran hari ini' }
]

// Hugging Face API Configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/'
const HF_TOKEN = 'hf_your_token_here' // Ganti dengan token Hugging Face Anda

// AI Service Functions
const callHuggingFaceAPI = async (message, model) => {
    try {
        const response = await fetch(`${HF_API_URL}${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: message,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
        }

        const result = await response.json()
        
        if (result.error) {
            throw new Error(result.error)
        }

        // Handle different response formats
        if (Array.isArray(result) && result[0]?.generated_text) {
            return result[0].generated_text.trim()
        } else if (result.generated_text) {
            return result.generated_text.trim()
        } else if (typeof result === 'string') {
            return result.trim()
        } else {
            throw new Error('Unexpected response format')
        }
    } catch (error) {
        console.error('Hugging Face API Error:', error)
        throw error
    }
}

// Fallback AI responses for when API is not available
const getFallbackResponse = (message) => {
    const responses = {
        'apa kabar': 'Saya baik-baik saja, terima kasih! Bagaimana dengan Anda?',
        'siapa kamu': 'Saya adalah AI Assistant yang menggunakan model dari Hugging Face.',
        'apa yang bisa kamu lakukan': 'Saya bisa membantu menjawab pertanyaan, berdiskusi, dan memberikan informasi umum.',
        'terima kasih': 'Sama-sama! Senang bisa membantu Anda.',
        'halo': 'Halo! Ada yang bisa saya bantu hari ini?',
        'selamat pagi': 'Selamat pagi! Semoga hari Anda menyenangkan.',
        'selamat siang': 'Selamat siang! Ada yang bisa saya bantu?',
        'selamat malam': 'Selamat malam! Bagaimana kabar Anda?'
    }

    const lowerMessage = message.toLowerCase()
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response
        }
    }

    return 'Maaf, saya tidak dapat terhubung ke API saat ini. Silakan coba lagi nanti atau periksa koneksi internet Anda.'
}

// Core Functions
const toggleChat = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        unreadCount.value = 0
    }
}

const closeChat = () => {
    isOpen.value = false
}

const changeModel = () => {
    addSystemMessage(`Model diubah ke ${currentModel.value}`)
}

const addSystemMessage = (text) => {
    const systemMessage = {
        id: Date.now() + '_system',
        text,
        isUser: false,
        timestamp: new Date().toISOString()
    }
    messages.value.push(systemMessage)
}

const sendMessage = async (text) => {
    lastUserMessage.value = text
    error.value = ''
    
    // Add user message
    const userMessage = {
        id: Date.now() + '_user',
        text,
        isUser: true,
        timestamp: new Date().toISOString()
    }
    messages.value.push(userMessage)
    
    // Show typing indicator
    isTyping.value = true
    
    try {
        let aiResponse
        
        // Try to use Hugging Face API
        if (HF_TOKEN !== 'hf_your_token_here') {
            try {
                aiResponse = await callHuggingFaceAPI(text, selectedModel.value)
                isOnline.value = true
            } catch (apiError) {
                console.error('API call failed:', apiError)
                isOnline.value = false
                aiResponse = getFallbackResponse(text)
                error.value = 'Menggunakan mode offline - API tidak tersedia'
            }
        } else {
            // Use fallback if no token provided
            aiResponse = getFallbackResponse(text)
            error.value = 'Token API belum dikonfigurasi - menggunakan respons fallback'
        }
        
        // Add AI response
        const aiMessage = {
            id: Date.now() + '_ai',
            text: aiResponse,
            isUser: false,
            timestamp: new Date().toISOString()
        }
        
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        messages.value.push(aiMessage)
        
    } catch (error) {
        console.error('Error in sendMessage:', error)
        const errorMessage = {
            id: Date.now() + '_error',
            text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
            isUser: false,
            timestamp: new Date().toISOString()
        }
        messages.value.push(errorMessage)
        isOnline.value = false
    } finally {
        isTyping.value = false
    }
}

const retryLastMessage = async () => {
    if (lastUserMessage.value) {
        error.value = ''
        await sendMessage(lastUserMessage.value)
    }
}

const handleSendMessage = async () => {
    const message = inputMessage.value.trim()
    if (!message || isTyping.value) return

    inputMessage.value = ''
    await sendMessage(message)
    scrollToBottom()
}

const handleQuickActionClick = async (actionText) => {
    await sendMessage(actionText)
    scrollToBottom()
}

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    try {
        return new Date(timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (error) {
        return ''
    }
}

const scrollToBottom = () => {
    nextTick(() => {
        const container = messagesContainer.value
        if (container) {
            container.scrollTop = container.scrollHeight
        }
    })
}

// Watchers
watch(messages, () => {
    scrollToBottom()
}, { deep: true })

watch(isOpen, (newValue) => {
    if (newValue) {
        nextTick(() => {
            scrollToBottom()
            if (chatInput.value) {
                chatInput.value.focus()
            }
        })
    }
})

// Lifecycle
onMounted(() => {
    console.log('ChatPopup with Free AI API mounted successfully')
    
    // Check if we have a valid token
    if (HF_TOKEN === 'hf_your_token_here') {
        console.warn('Hugging Face token not configured. Please set your token to use AI features.')
        isOnline.value = false
    }
})
</script>

<style scoped>
.chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    font-family: system-ui, -apple-system, sans-serif;
}

.chat-toggle-btn {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
    color: white;
}

.chat-toggle-btn:hover {
    transform: scale(1.05);
}

.chat-toggle-btn.chat-open {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.chat-icon,
.close-icon {
    width: 24px;
    height: 24px;
}

.unread-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    border: 2px solid white;
}

.chat-popup {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 380px;
    height: 500px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideInUp 0.3s ease-out;
}

.chat-header {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-title h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.chat-subtitle {
    margin: 4px 0 0 0;
    font-size: 12px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.model-selector {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
}

.model-selector option {
    background: #1f2937;
    color: white;
}

.close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    width: 20px;
    height: 20px;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f9fafb;
    scroll-behavior: smooth;
}

.message {
    margin-bottom: 16px;
    display: flex;
}

.user-message {
    justify-content: flex-end;
}

.ai-message {
    justify-content: flex-start;
}

.error-message .message-content {
    background: #fef2f2 !important;
    border: 1px solid #fecaca !important;
    color: #dc2626 !important;
}

.message-content {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 18px;
    position: relative;
}

.user-message .message-content {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border-bottom-right-radius: 4px;
}

.ai-message .message-content {
    background: white;
    color: #374151;
    border: 1px solid #e5e7eb;
    border-bottom-left-radius: 4px;
}

.message-content p {
    margin: 0;
    line-height: 1.5;
    font-size: 14px;
}

.message-time {
    font-size: 10px;
    opacity: 0.7;
    display: block;
    margin-top: 4px;
}

.retry-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    cursor: pointer;
    margin-top: 8px;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 8px 0;
}

.typing-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6b7280;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
    animation-delay: -0.16s;
}

.quick-actions {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    background: white;
}

.quick-actions-title {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 12px 0;
    font-weight: 500;
}

.quick-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.quick-action-btn {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    font-size: 12px;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
}

.quick-action-btn:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #f0f9ff;
}

.quick-action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.chat-input-container {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    background: white;
}

.chat-input-form {
    display: flex;
    gap: 8px;
    align-items: center;
}

.chat-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

.chat-input:focus {
    border-color: #3b82f6;
}

.chat-input:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
}

.send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
    transform: scale(1.05);
}

.send-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
}

.send-btn svg {
    width: 18px;
    height: 18px;
}

.send-btn .spin {
    animation: spin 1s linear infinite;
}

.chat-footer {
    margin-top: 8px;
    text-align: center;
}

.chat-disclaimer {
    font-size: 10px;
    color: #9ca3af;
    margin: 0;
}

.api-status {
    font-size: 10px;
    margin: 2px 0 0 0;
    font-weight: 500;
}

.api-status.online {
    color: #10b981;
}

.api-status.offline {
    color: #ef4444;
}

/* Animations */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

@keyframes typing {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 480px) {
    .chat-popup {
        width: calc(100vw - 40px);
        right: -10px;
        height: 450px;
    }
    
    .chat-widget {
        right: 10px;
        bottom: 10px;
    }
    
    .quick-actions-grid {
        grid-template-columns: 1fr;
    }
    
    .header-controls {
        flex-direction: column;
        gap: 5px;
    }
    
    .model-selector {
        font-size: 10px;
        padding: 2px 4px;
    }
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
    width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>