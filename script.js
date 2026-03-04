// ===== POSIUFO - Main Script =====
document.addEventListener('DOMContentLoaded', () => {

    // ===== Cursor Glow =====
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ===== Header Scroll Effect =====
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===== Scroll Animations =====
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    }

    // ===== Back to Top =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Cart Badge =====
    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (!badge) return;
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    function getCart() {
        const cart = localStorage.getItem('posiufoCart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('posiufoCart', JSON.stringify(cart));
    }

    function formatCurrency(amount) {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    }

    // ===== Search Functionality =====
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');

    const products = [
        { name: 'DELUSIONAL STICKER', url: 'stickers.html' },
        { name: 'BANYAK REZEKI STICKER', url: 'stickers.html' },
        { name: 'CONCEPT STICKER', url: 'stickers.html' },
        { name: 'TRAVEL STICKER', url: 'stickers.html' },
        { name: 'ASLI STICKER', url: 'stickers.html' },
        { name: 'I WILL GET THROUGH THIS STICKER', url: 'stickers.html' },
        { name: 'CUTE CHAIR PINK KEYCHAIN', url: 'keychains.html' },
        { name: 'CUTE CHAIR RED KEYCHAIN', url: 'keychains.html' },
        { name: 'CUTE CHAIR CYAN KEYCHAIN', url: 'keychains.html' },
        { name: 'CUTE CHAIR BLUE KEYCHAIN', url: 'keychains.html' },
        { name: 'AWAS JATOH PIN', url: 'keychains.html' },
        { name: 'HAVE A NICE DAY TSHIRT', url: 'tshirts.html' }
    ];

    if (searchInput && searchSuggestions) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            searchSuggestions.innerHTML = '';
            if (query.length < 2) {
                searchSuggestions.classList.remove('show');
                return;
            }
            const filtered = products.filter(p => p.name.toLowerCase().includes(query));
            if (filtered.length > 0) {
                filtered.forEach(product => {
                    const item = document.createElement('div');
                    item.classList.add('search-suggestion-item');
                    item.textContent = product.name;
                    item.addEventListener('click', () => {
                        window.location.href = product.url;
                    });
                    searchSuggestions.appendChild(item);
                });
                searchSuggestions.classList.add('show');
            } else {
                searchSuggestions.classList.remove('show');
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchSuggestions.contains(e.target) && e.target !== searchInput) {
                searchSuggestions.classList.remove('show');
            }
        });
    }

    // ===== Newsletter Form =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Terima kasih sudah subscribe! 💜');
            newsletterForm.reset();
        });
    }

    // ===== Toast Message =====
    function showToast(message) {
        let toast = document.querySelector('.toast-message');
        if (!toast) {
            toast = document.createElement('div');
            toast.classList.add('toast-message');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Make showToast available globally
    window.showToast = showToast;
    window.getCart = getCart;
    window.saveCart = saveCart;
    window.formatCurrency = formatCurrency;
    window.updateCartBadge = updateCartBadge;

    // ===== Add to Cart (for sub-pages) =====
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const btn = event.currentTarget;
            const product = {
                id: btn.dataset.productId,
                name: btn.dataset.productName,
                price: parseInt(btn.dataset.productPrice),
                image: btn.dataset.productImage,
                quantity: 1
            };

            let cart = getCart();
            const existingIndex = cart.findIndex(item => item.id === product.id);

            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(product);
            }

            saveCart(cart);
            updateCartBadge();
            showToast(`"${product.name}" ditambahkan ke keranjang! 🛒`);
        });
    });

    // ===== Cart Page Logic =====
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const shippingCost = 10000;

    function renderCart() {
        if (!cartItemsContainer) return;
        const cart = getCart();
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Keranjang kamu masih kosong 🛒</p>';
            updateCartTotals(0);
            return;
        }

        cart.forEach(item => {
            const row = document.createElement('div');
            row.classList.add('cart-item-row');
            row.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <p class="cart-item-title">${item.name}</p>
                    <p class="cart-item-unit-price">${formatCurrency(item.price)}</p>
                    <div class="cart-qty-controls">
                        <button class="qty-btn decrease" data-id="${item.id}">−</button>
                        <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${item.id}">
                        <button class="qty-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-remove-btn" data-id="${item.id}">Hapus</button>
                </div>
                <p class="cart-item-subtotal">${formatCurrency(item.price * item.quantity)}</p>
            `;
            cartItemsContainer.appendChild(row);
        });

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        updateCartTotals(subtotal);
    }

    function updateCartTotals(subtotal) {
        const cart = getCart();
        const currentShipping = cart.length > 0 ? shippingCost : 0;
        const total = subtotal + currentShipping;

        if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotal);
        if (cartShipping) cartShipping.textContent = formatCurrency(currentShipping);
        if (cartTotal) cartTotal.textContent = formatCurrency(total);
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.dataset.id;
            if (!id) return;

            let cart = getCart();

            if (target.classList.contains('increase')) {
                const item = cart.find(i => i.id === id);
                if (item) item.quantity += 1;
            } else if (target.classList.contains('decrease')) {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity < 1) cart = cart.filter(i => i.id !== id);
                }
            } else if (target.classList.contains('cart-remove-btn')) {
                cart = cart.filter(i => i.id !== id);
            }

            saveCart(cart);
            renderCart();
            updateCartBadge();
        });

        cartItemsContainer.addEventListener('change', (e) => {
            const target = e.target;
            if (target.classList.contains('qty-input')) {
                const id = target.dataset.id;
                const newQty = parseInt(target.value);
                let cart = getCart();
                if (newQty < 1) {
                    cart = cart.filter(i => i.id !== id);
                } else {
                    const item = cart.find(i => i.id === id);
                    if (item) item.quantity = newQty;
                }
                saveCart(cart);
                renderCart();
                updateCartBadge();
            }
        });
    }

    // Note: Checkout button logic is handled in cart.html's inline script

    // Initial calls
    updateCartBadge();
    renderCart();
});