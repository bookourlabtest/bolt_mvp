// Main JavaScript for BookOurLabTest

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Toast notification system
class Toast {
    constructor(message, type = 'info', duration = 3000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.element = null;
        this.show();
    }

    show() {
        const container = document.getElementById('toast-container');
        if (!container) return;

        this.element = document.createElement('div');
        this.element.className = `toast toast-${this.type} flex items-center space-x-2`;

        const icon = this.getIcon();
        const text = document.createElement('span');
        text.textContent = this.message;

        this.element.appendChild(icon);
        this.element.appendChild(text);

        container.appendChild(this.element);

        // Animate in
        setTimeout(() => {
            this.element.style.transform = 'translateX(0)';
            this.element.style.opacity = '1';
        }, 10);

        // Auto remove
        setTimeout(() => {
            this.hide();
        }, this.duration);
    }

    hide() {
        if (!this.element) return;

        this.element.style.transform = 'translateX(100%)';
        this.element.style.opacity = '0';

        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
    }

    getIcon() {
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', this.getIconName());
        icon.className = 'w-5 h-5 flex-shrink-0';

        switch (this.type) {
            case 'success':
                icon.classList.add('text-green-600');
                break;
            case 'error':
                icon.classList.add('text-red-600');
                break;
            case 'info':
            default:
                icon.classList.add('text-blue-600');
                break;
        }

        return icon;
    }

    getIconName() {
        switch (this.type) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'x-circle';
            case 'info':
            default:
                return 'info';
        }
    }
}

// Global toast functions
window.showToast = function(message, type = 'info') {
    new Toast(message, type);
};

// Cart functionality
function addToCart(testId, offerId) {
    fetch(`/api/cart/add/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
            test_id: testId,
            offer_id: offerId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Added to cart', 'success');
            updateCartCount();
        } else {
            showToast('Failed to add to cart', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('An error occurred', 'error');
    });
}

function updateCartCount() {
    fetch('/api/cart/count/')
    .then(response => response.json())
    .then(data => {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = data.count;
            cartBadge.style.display = data.count > 0 ? 'flex' : 'none';
        }
    });
}

function getCSRFToken() {
    const token = document.querySelector('[name=csrfmiddlewaretoken]');
    return token ? token.value : '';
}

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Update cart count on page load
    updateCartCount();
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// Search functionality
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedSearch = debounce(function(query) {
    // Implement search functionality
    console.log('Searching for:', query);
}, 300);