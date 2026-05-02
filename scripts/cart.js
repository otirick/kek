// Состояние корзины
let cartItems = [];

document.addEventListener("DOMContentLoaded", function () {
    const cartDropdown = document.querySelector(".cartDropdown");
    const cartButton = document.querySelector(".cartButton");

    // Открытие/закрытие корзины
    if (cartButton) {
        cartButton.addEventListener("click", function (event) {
            event.stopPropagation();
            document.querySelector(".cart").classList.toggle("open");
        });
    }

    document.addEventListener("click", function (event) {
        const cart = document.querySelector(".cart");
        if (cart && !cart.contains(event.target)) {
            cart.classList.remove("open");
        }
    });

    // Делегирование событий для кнопок "В корзину"
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart-btn")) {
            const productId = event.target.dataset.productId;
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
            updateCartUI();
        }
    };

    function updateCartUI() {
        // Обновление счетчика на кнопке корзины
        const cartBadge = document.querySelector(".cartButton");
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        // Создаем или обновляем бейдж
        let badge = document.querySelector(".cartBadge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "cartBadge";
            cartButton.appendChild(badge);
        }
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? "block" : "none";

        // Обновление списка внутри выпадающего меню
        if (cartDropdown) {
            if (cartItems.length === 0) {
                cartDropdown.innerHTML = '<p>Корзина пуста</p>';
            } else {
                cartDropdown.innerHTML = '';
                cartItems.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    itemEl.innerHTML = `
                        <div class="cart-item-info">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-qty">${item.quantity} x ${item.price}</span>
                        </div>
                        <button class="remove-from-cart" data-id="${item.id}">&times;</button>
                    `;
                    itemEl.querySelector('.remove-from-cart').addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                    });
                    cartDropdown.appendChild(itemEl);
                });
                
                // Добавляем кнопку оформления заказа, если есть товары
                const orderBtn = document.createElement('button');
                orderBtn.className = 'order-btn';
                orderBtn.textContent = 'Оформить заказ';
                orderBtn.onclick = () => alert('Заказ оформлен! (Демо)');
                cartDropdown.appendChild(orderBtn);
            }
        }
    }

    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        updateCartUI();
    }

    // Инициализация
    updateCartUI();
});
