// Terminal Store - Shopping Cart System
class TerminalStore {
    constructor() {
        this.products = [
            { id: 1, name: "Vanilla Cupcakes (6 Pack)", price: 12.99, category: "Cupcake" },
            { id: 2, name: "French Macaron", price: 3.99, category: "Macaron" },
            { id: 3, name: "Pumpkin Cupcake", price: 3.99, category: "Cupcake" },
            { id: 4, name: "Chocolate Cupcake", price: 5.99, category: "Cupcake" },
            { id: 5, name: "Chocolate Pretzels (4 Pack)", price: 10.99, category: "Pretzel" },
            { id: 6, name: "Strawberry Ice Cream", price: 2.99, category: "Ice Cream" },
            { id: 7, name: "Chocolate Macarons (4 Pack)", price: 9.99, category: "Macaron" },
            { id: 8, name: "Strawberry Pretzel", price: 4.99, category: "Pretzel" },
            { id: 9, name: "Butter Pecan Ice Cream", price: 2.99, category: "Ice Cream" },
            { id: 10, name: "Rocky Road Ice Cream", price: 2.99, category: "Ice Cream" },
            { id: 11, name: "Vanilla Macarons (5 Pack)", price: 11.99, category: "Macaron" },
            { id: 12, name: "Lemon Cupcakes (4 Pack)", price: 12.99, category: "Cupcake" }
        ];
        
        this.cart = [];
        this.isCartVisible = false;
        this.taxRate = 8.25;
        
        this.initializeStore();
    }

    initializeStore() {
        this.renderProducts();
        this.bindEvents();
        this.updateCartDisplay();
    }

    renderProducts() {
        const container = document.getElementById('products-container');
        container.innerHTML = '';

        this.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-category">${product.category}</div>
                <button class="tui-btn primary full-width add-to-cart" data-id="${product.id}">
                    <span class="btn-icon">🛒</span>
                    ADD TO CART
                </button>
            `;
            container.appendChild(productCard);
        });
    }

    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
                this.addToCart(productId);
            }
        });

        // Cart controls
        document.getElementById('toggle-cart').addEventListener('click', () => this.toggleCart());
        document.getElementById('clear-cart').addEventListener('click', () => this.clearCart());
        document.getElementById('checkout-btn').addEventListener('click', () => this.checkout());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.showNotification(`Added ${product.name} to cart`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
    }

    updateCartItemQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCartDisplay();
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const totalItems = document.getElementById('total-items');
        const totalPrice = document.getElementById('total-price');
        const subtotal = document.getElementById('subtotal');
        const taxes = document.getElementById('taxes');
        const total = document.getElementById('total');

        // Update cart items display
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">CART_IS_EMPTY</div>';
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                    <div class="item-controls">
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="item-actions">
                            <button class="tui-btn small" onclick="store.updateCartItemQuantity(${item.id}, -1)" title="Decrease">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="tui-btn small" onclick="store.updateCartItemQuantity(${item.id}, 1)" title="Increase">+</button>
                            <button class="tui-btn small danger" onclick="store.removeFromCart(${item.id})" title="Remove">×</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Calculate totals
        const cartSubtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartTaxes = cartSubtotal * (this.taxRate / 100);
        const cartTotal = cartSubtotal + cartTaxes;

        // Update display
        totalItems.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        totalPrice.textContent = `$${cartTotal.toFixed(2)}`;
        subtotal.textContent = `$${cartSubtotal.toFixed(2)}`;
        taxes.textContent = `$${cartTaxes.toFixed(2)}`;
        total.textContent = `$${cartTotal.toFixed(2)}`;

        // Update global status
        document.getElementById('global-status').textContent = 'CART_UPDATED';
    }

    toggleCart() {
        this.isCartVisible = !this.isCartVisible;
        const cartContainer = document.getElementById('cart-container');
        const cartStatus = document.getElementById('cart-status');
        const toggleBtn = document.getElementById('toggle-cart');

        if (this.isCartVisible) {
            cartContainer.style.display = 'block';
            cartStatus.textContent = 'VISIBLE';
            toggleBtn.innerHTML = '<span class="btn-icon">👁</span> HIDE';
        } else {
            cartContainer.style.display = 'none';
            cartStatus.textContent = 'HIDDEN';
            toggleBtn.innerHTML = '<span class="btn-icon">👁</span> SHOW';
        }
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is already empty', 'warning');
            return;
        }

        if (confirm('Are you sure you want to clear the cart?')) {
            this.cart = [];
            this.updateCartDisplay();
            this.showNotification('Cart cleared', 'success');
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty', 'warning');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalWithTax = total + (total * (this.taxRate / 100));
        
        this.showNotification(`Checkout completed! Total: $${totalWithTax.toFixed(2)}`, 'success');
        this.cart = [];
        this.updateCartDisplay();
        this.toggleCart();
    }

    showNotification(message, type = 'info') {
        const status = document.getElementById('global-status');
        const originalText = status.textContent;
        
        status.textContent = message;
        
        switch (type) {
            case 'success':
                status.style.color = 'var(--accent-green)';
                break;
            case 'warning':
                status.style.color = 'var(--accent-orange)';
                break;
            case 'error':
                status.style.color = 'var(--control-red)';
                break;
            default:
                status.style.color = 'var(--accent-cyan)';
        }

        setTimeout(() => {
            status.textContent = originalText;
            status.style.color = 'var(--text-accent)';
        }, 3000);
    }

    handleKeyboard(event) {
        // Ctrl+C to clear cart
        if (event.ctrlKey && event.key === 'c') {
            event.preventDefault();
            this.clearCart();
        }
        
        // Ctrl+T to toggle cart
        if (event.ctrlKey && event.key === 't') {
            event.preventDefault();
            this.toggleCart();
        }
        
        // Escape to close cart
        if (event.key === 'Escape' && this.isCartVisible) {
            this.toggleCart();
        }
    }
}

// Initialize the store when DOM is loaded
let store;
document.addEventListener('DOMContentLoaded', () => {
    store = new TerminalStore();
});

// Make store globally available for button onclick handlers
window.store = store;