// Состояние корзины
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

document.addEventListener("DOMContentLoaded", function () {
// ... (existing code)
    const cart = document.querySelector(".cart");
    const cartButton = document.querySelector(".cartButton");
    const cartDropdown = document.querySelector(".cartDropdown");

    if (!cart || !cartButton || !cartDropdown) {
        console.error("Cart elements not found!");
        return;
    }

    // Открытие/закрытие корзины
    cartButton.addEventListener("click", function (event) {
        event.stopPropagation();
        cart.classList.toggle("open");
    });

    document.addEventListener("click", function (event) {
        if (!cart.contains(event.target)) {
            cart.classList.remove("open");
        }
    });

    // Делегирование событий для кнопок "В корзину"
    document.addEventListener("click", function (event) {
        const btn = event.target.closest(".add-to-cart-btn");
        if (btn) {
            const productId = btn.dataset.productId;
            if (productId) {
                window.addToCart(productId);
            }
        }
    });

    // Функция добавления в корзину
    window.addToCart = function(productId) {
        const product = window.products.find(p => p.id === productId);
        if (product) {
            const existingItem = cartItems.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ ...product, quantity: 1 });
            }
            saveCart();
            updateCartUI();
        }
    };

    function updateCartUI() {
        // Обновление счетчика на кнопке корзины
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        let badge = cartButton.querySelector(".cartBadge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "cartBadge";
            cartButton.appendChild(badge);
        }
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? "block" : "none";

        // Обновление списка внутри выпадающего меню
        if (cartItems.length === 0) {
            cartDropdown.innerHTML = '<p>Корзина пуста</p>';
        } else {
            cartDropdown.innerHTML = '';
            let totalPrice = 0;

            cartItems.forEach(item => {
                const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
                totalPrice += numericPrice * item.quantity;

                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.images[0]}" class="cart-item-img" alt="">
                        <div class="cart-item-text">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-qty">${item.quantity} x ${item.price}</span>
                        </div>
                    </div>
                    <button class="remove-from-cart" data-id="${item.id}">&times;</button>
                `;
                itemEl.querySelector('.cart-item-info').addEventListener('click', () => {
                    window.location.href = `product.html?id=${item.id}`;
                });
                itemEl.querySelector('.remove-from-cart').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromCart(item.id);
                });
                cartDropdown.appendChild(itemEl);
            });

            const totalEl = document.createElement('div');
            totalEl.className = 'cart-total';
            const formattedTotal = totalPrice.toLocaleString('ru-RU') + ' ₽';
            totalEl.innerHTML = `<span>Итого:</span> <span>${formattedTotal}</span>`;
            cartDropdown.appendChild(totalEl);

            const orderBtn = document.createElement('button');
            orderBtn.className = 'order-btn';
            orderBtn.textContent = 'Оформить заказ';
            orderBtn.onclick = () => {
                window.location.href = 'checkout.html';
            };
            cartDropdown.appendChild(orderBtn);
        }
    }

    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    // Инициализация
    updateCartUI();
});

