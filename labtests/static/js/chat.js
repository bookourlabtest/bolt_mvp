class HealthChatBot {
    constructor() {
        this.isOpen = false;
        this.sessionId = null;
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.loadChatHistory();
    }

    addCustomStyles() {
        if (document.getElementById('ai-chat-styles')) return;

        const style = document.createElement('style');
        style.id = 'ai-chat-styles';
        style.textContent = `
            /* Floating animation */
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(5deg); }
            }

            /* Rotating shadow */
            @keyframes rotateShadow {
                0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1); }
                25% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(59, 130, 246, 0.4), 0 0 75px rgba(59, 130, 246, 0.2); }
                50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(59, 130, 246, 0.5), 0 0 90px rgba(59, 130, 246, 0.3); }
                75% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(59, 130, 246, 0.4), 0 0 75px rgba(59, 130, 246, 0.2); }
                100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1); }
            }

            /* Pulse glow */
            @keyframes pulseGlow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1);
                }
                50% {
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.2);
                }
            }

            .ai-chat-button {
                animation: float 3s ease-in-out infinite, rotateShadow 4s ease-in-out infinite, pulseGlow 2s ease-in-out infinite;
                position: relative;
            }

            .ai-chat-button:hover {
                animation-play-state: paused;
                transform: scale(1.1) !important;
            }

            .ai-chat-button::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, #3b82f6, #1d4ed8, #1e40af, #3b82f6);
                border-radius: inherit;
                z-index: -1;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .ai-chat-button:hover::before {
                opacity: 0.8;
            }

            /* Brain Button Styles */
            .ai-chat-brain {
                position: relative;
                width: 60px;
                height: 60px;
                background: transparent;
                border: none;
                cursor: pointer;
                border-radius: 50%;
                animation: brainSpin 3s linear infinite, brainBounce 3s ease-in-out infinite;
                transition: all 0.3s ease;
                overflow: visible;
            }

            .ai-chat-brain:hover {
                animation-play-state: paused;
                transform: scale(1.1);
            }

            /* Brain Icon */
            .brain-icon {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
            }

            /* Spinning Animation - 3 seconds infinite */
            @keyframes brainSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Up and Down Bounce Animation - 3cm movement */
            @keyframes brainBounce {
                0%, 100% {
                    transform: translateY(0px);
                }
                25% {
                    transform: translateY(-30px); /* 3cm = 30px approximately */
                }
                50% {
                    transform: translateY(0px);
                }
                75% {
                    transform: translateY(-30px);
                }
            }

            /* Brain Rings */
            .brain-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid;
                border-radius: 50%;
                animation: brainRingPulse 3s ease-in-out infinite;
            }

            .brain-ring-1 {
                width: 70px;
                height: 70px;
                border-color: rgba(59, 130, 246, 0.6);
                animation-delay: 0s;
            }

            .brain-ring-2 {
                width: 80px;
                height: 80px;
                border-color: rgba(29, 78, 216, 0.4);
                animation-delay: 1s;
            }

            .brain-ring-3 {
                width: 90px;
                height: 90px;
                border-color: rgba(30, 64, 175, 0.3);
                animation-delay: 2s;
            }

            @keyframes brainRingPulse {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.3;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0.8;
                }
            }

            /* Animated particles */
            .brain-particle {
                animation: particleFloat 4s ease-in-out infinite;
            }

            .particle-1 { animation-delay: 0s; }
            .particle-2 { animation-delay: 1s; }
            .particle-3 { animation-delay: 2s; }
            .particle-4 { animation-delay: 3s; }

            @keyframes particleFloat {
                0%, 100% {
                    transform: translateY(0px) scale(1);
                    opacity: 0.7;
                }
                50% {
                    transform: translateY(-10px) scale(1.2);
                    opacity: 1;
                }
            }

            /* Sparkle effect */
            .ai-chat-brain::after {
                content: '✨';
                position: absolute;
                top: -10px;
                right: -10px;
                font-size: 12px;
                animation: sparkle 2s ease-in-out infinite;
                opacity: 0;
            }

            @keyframes sparkle {
                0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
                50% { opacity: 1; transform: scale(1) rotate(180deg); }
            }

            /* Typing indicator animation */
            .typing-dot {
                animation: typing 1.4s infinite ease-in-out;
            }

            .typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dot:nth-child(2) { animation-delay: -0.16s; }

            /* Chat window entrance animation */
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

            #chat-window {
                animation: slideInUp 0.3s ease-out;
            }

            /* Notification badge */
            .notification-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                animation: notificationPulse 2s infinite;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            @keyframes notificationPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    createChatWidget() {
        // Add custom CSS for animations
        this.addCustomStyles();

        const chatHTML = `
            <div id="health-chat-widget" class="fixed bottom-4 right-4 z-50">
                <!-- Chat Button -->
                <button id="chat-toggle" class="ai-chat-brain">
                    <!-- Single Big Star Icon SVG -->
                    <svg class="brain-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <!-- Blue gradient for sparkles -->
                            <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                                <stop offset="50%" style="stop-color:#1d4ed8;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
                            </linearGradient>
                            <!-- Glow effect -->
                            <filter id="sparkleGlow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        <!-- Single Big Star Design -->
                        <g transform="translate(50,50)">
                            <!-- Main big star -->
                            <g transform="scale(2.0)">
                                <circle cx="0" cy="0" r="4" fill="url(#sparkleGradient)" filter="url(#sparkleGlow)"/>
                                <path d="M0,-12 L2,-4 L12,0 L2,4 L0,12 L-2,4 L-12,0 L-2,-4 Z"
                                      fill="url(#sparkleGradient)" filter="url(#sparkleGlow)"/>
                            </g>

                            <!-- Center highlight -->
                            <circle cx="0" cy="0" r="2" fill="rgba(255,255,255,0.9)"/>
                        </g>

                        <!-- Animated particles around the sparkles -->
                        <circle cx="25" cy="25" r="2" fill="#3b82f6" opacity="0.7" class="brain-particle particle-1"/>
                        <circle cx="70" cy="20" r="1.5" fill="#1d4ed8" opacity="0.8" class="brain-particle particle-2"/>
                        <circle cx="75" cy="65" r="2.5" fill="#1e40af" opacity="0.6" class="brain-particle particle-3"/>
                        <circle cx="20" cy="70" r="1" fill="#2563eb" opacity="0.9" class="brain-particle particle-4"/>
                    </svg>

                    <!-- Animated rings -->
                    <div class="brain-ring brain-ring-1"></div>
                    <div class="brain-ring brain-ring-2"></div>
                    <div class="brain-ring brain-ring-3"></div>
                </button>

                <!-- Chat Window -->
                <div id="chat-window" class="hidden bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96 flex flex-col mt-4">
                    <!-- Chat Header -->
                    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            <span class="font-semibold">AI Health Assistant</span>
                        </div>
                        <button id="chat-close" class="hover:bg-blue-800 rounded-full p-1 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Disclaimer -->
                    <div class="bg-yellow-50 border-b border-yellow-200 p-3">
                        <p class="text-xs text-yellow-800">
                            <strong>⚠️ Medical Disclaimer:</strong> I am not a substitute for professional medical advice. Always consult healthcare providers for diagnosis and treatment.
                        </p>
                    </div>

                    <!-- Messages Container -->
                    <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3">
                        <div class="text-center text-gray-500 text-sm py-4 welcome-message">
                            <div class="animate-pulse">
                                👋 <strong>Hello! I'm your AI Health Assistant</strong><br>
                                <span class="text-xs">Ask me about symptoms, lab tests, or upload medical reports for analysis</span>
                            </div>
                        </div>
                    </div>

                    <!-- File Upload Area -->
                    <div id="file-upload-area" class="hidden border-t border-gray-200 p-3 bg-gray-50">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Attach medical report (image/PDF)</span>
                            <button id="cancel-attachment" class="text-red-500 hover:text-red-700">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div id="attachment-preview" class="mt-2"></div>
                    </div>

                    <!-- Input Area -->
                    <div class="border-t border-gray-200 p-3">
                        <div class="flex space-x-2">
                            <input type="text" id="chat-input" placeholder="Describe your symptoms or ask about tests..."
                                   class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <button id="attach-file" class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg p-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                            </button>
                            <button id="send-message" class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium">
                                Send
                            </button>
                        </div>
                        <input type="file" id="file-input" accept="image/*,.pdf" class="hidden">
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chat-toggle');
        const closeBtn = document.getElementById('chat-close');
        const sendBtn = document.getElementById('send-message');
        const inputField = document.getElementById('chat-input');
        const attachBtn = document.getElementById('attach-file');
        const fileInput = document.getElementById('file-input');
        const cancelAttachment = document.getElementById('cancel-attachment');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        attachBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        cancelAttachment.addEventListener('click', () => this.cancelAttachment());
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            chatWindow.style.display = 'flex';
            // Force reflow to restart animation
            chatWindow.offsetHeight;
            chatWindow.classList.remove('hidden');
            document.getElementById('chat-input').focus();
        } else {
            chatWindow.classList.add('hidden');
            setTimeout(() => {
                chatWindow.style.display = 'none';
            }, 300);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.add('hidden');
        setTimeout(() => {
            chatWindow.style.display = 'none';
        }, 300);
        this.isOpen = false;
    }

    async sendMessage() {
        const inputField = document.getElementById('chat-input');
        const message = inputField.value.trim();

        if (!message && !this.selectedFile) return;

        // Add user message to chat
        this.addMessage('user', message || '[Medical report attached]');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const formData = {
                message: message
            };

            // Add attachment if present
            if (this.selectedFile) {
                formData.attachment = this.selectedFile;
            }

            const response = await fetch('/api/chat/message/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.addMessage('assistant', data.response);
                if (data.attachment_url) {
                    this.addAttachmentPreview(data.attachment_url);
                }
            } else {
                this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage('assistant', 'Sorry, I\'m having trouble connecting. Please try again later.');
        }

        // Clear input and hide typing indicator
        inputField.value = '';
        this.hideTypingIndicator();
        this.cancelAttachment();
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;

        const messageContent = document.createElement('div');
        messageContent.className = `max-w-xs px-4 py-2 rounded-lg text-sm ${
            type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
        }`;
        messageContent.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add notification pulse for new messages when chat is closed
        if (!this.isOpen && type === 'assistant') {
            this.showNotificationBadge();
        }
    }

    formatMessage(content) {
        // Convert line breaks to <br> and basic formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex justify-start';
        typingDiv.innerHTML = `
            <div class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm">
                <div class="flex items-center space-x-2">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-blue-500 rounded-full typing-dot"></div>
                        <div class="w-2 h-2 bg-blue-500 rounded-full typing-dot"></div>
                        <div class="w-2 h-2 bg-blue-500 rounded-full typing-dot"></div>
                    </div>
                    <span class="text-xs text-gray-600">AI is thinking...</span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image (JPG, PNG) or PDF file.');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB.');
            return;
        }

        // Convert file to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectedFile = e.target.result;
            this.showAttachmentPreview(file);
        };
        reader.readAsDataURL(file);
    }

    showAttachmentPreview(file) {
        const uploadArea = document.getElementById('file-upload-area');
        const preview = document.getElementById('attachment-preview');

        uploadArea.classList.remove('hidden');

        if (file.type.startsWith('image/')) {
            preview.innerHTML = `
                <div class="flex items-center space-x-2">
                    <img src="${this.selectedFile}" alt="Attachment preview" class="w-16 h-16 object-cover rounded border">
                    <div>
                        <p class="text-sm font-medium">${file.name}</p>
                        <p class="text-xs text-gray-500">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
            `;
        } else {
            preview.innerHTML = `
                <div class="flex items-center space-x-2">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div>
                        <p class="text-sm font-medium">${file.name}</p>
                        <p class="text-xs text-gray-500">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
            `;
        }
    }

    cancelAttachment() {
        this.selectedFile = null;
        document.getElementById('file-upload-area').classList.add('hidden');
        document.getElementById('file-input').value = '';
    }

    addAttachmentPreview(url) {
        const messagesContainer = document.getElementById('chat-messages');
        const attachmentDiv = document.createElement('div');
        attachmentDiv.className = 'flex justify-start mb-2';

        attachmentDiv.innerHTML = `
            <div class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm">
                📎 <a href="${url}" target="_blank" class="text-blue-600 hover:underline">View attached medical report</a>
            </div>
        `;

        messagesContainer.appendChild(attachmentDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async loadChatHistory() {
        try {
            const response = await fetch('/api/chat/history/');
            const data = await response.json();

            data.messages.forEach(msg => {
                this.addMessage(msg.type, msg.content);
                if (msg.attachment) {
                    this.addAttachmentPreview(msg.attachment);
                }
            });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    showNotificationBadge() {
        const chatButton = document.getElementById('chat-toggle');
        let badge = document.getElementById('notification-badge');

        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'notification-badge';
            badge.className = 'notification-badge';
            badge.textContent = '!';
            chatButton.style.position = 'relative';
            chatButton.appendChild(badge);
        }

        // Remove badge when chat is opened
        const observer = new MutationObserver(() => {
            if (this.isOpen) {
                badge.remove();
            }
        });

        observer.observe(document.getElementById('chat-window'), {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    getCSRFToken() {
        // Get CSRF token from cookie
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

// Initialize chat bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HealthChatBot();
});