// scripts/checkout.js — Оформление заказа

document.addEventListener("DOMContentLoaded", function () {
    const checkoutItemsList = document.getElementById("checkout-items-list");
    const checkoutTotalPrice = document.getElementById("checkout-total-price");
    const checkoutForm = document.getElementById("checkout-form");

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    function saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    if (cartItems.length === 0) {
        checkoutItemsList.innerHTML = '<p>Ваша корзина пуста</p>';
        checkoutTotalPrice.innerHTML = '<span>Итого:</span> <span>0 ₽</span>';
        const submitBtn = checkoutForm?.querySelector('.submit-order-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
        return;
    }

    function renderItems() {
        checkoutItemsList.innerHTML = '';
        let totalPrice = 0;

        cartItems.forEach(item => {
            const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
            totalPrice += numericPrice * item.quantity;

            const itemEl = document.createElement('div');
            itemEl.className = 'checkout-item';
            itemEl.innerHTML = `
                <div class="checkout-item-info">
                    <img src="${item.images[0]}" class="checkout-item-img" alt="${item.name}">
                    <div>
                        <div style="font-weight: 500;">${item.name}</div>
                        <div style="font-size: 0.9em; color: #666;">${item.quantity} x ${item.price}</div>
                    </div>
                </div>
                <button class="remove-checkout-item" style="background:none; border:none; color:#ff4d4d; font-size:20px; cursor:pointer;">&times;</button>
            `;

            itemEl.querySelector('.checkout-item-info').addEventListener('click', () => {
                window.location.href = `product-page.html?id=${item.id}`;
            });

            itemEl.querySelector('.remove-checkout-item').addEventListener('click', (e) => {
                e.stopPropagation();
                cartItems = cartItems.filter(i => i.id !== item.id);
                saveCart();
                renderItems();
            });

            checkoutItemsList.appendChild(itemEl);
        });

        const formattedTotal = totalPrice.toLocaleString('ru-RU') + ' ₽';
        checkoutTotalPrice.innerHTML = `<span>Итого:</span> <span>${formattedTotal}</span>`;
    }

    renderItems();

    // Обработка отправки формы
    checkoutForm?.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const submitBtn = checkoutForm.querySelector('.submit-order-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {
            const formData = new FormData(checkoutForm);
            
            let totalKopeks = 0;
            const orderItems = cartItems.map(item => {
                const priceNumeric = parseInt(item.price.replace(/[^\d]/g, ''), 10);
                totalKopeks += priceNumeric * item.quantity;
                return {
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: priceNumeric
                };
            });

            const payload = {
                customer: {
                    name: formData.get('fullname'),
                    address: formData.get('address'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    postalCode: formData.get('postalCode')
                },
                items: orderItems,
                total: totalKopeks / 100
            };

            const response = await fetch('api/checkout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.removeItem('cartItems');
                alert(`✅ Заказ #${result.order_id} оформлен!\nМы свяжемся с вами в ближайшее время.`);
                window.location.href = 'index.html';
            } else {
                throw new Error(result.error || 'Ошибка сервера');
            }
            
        } catch (error) {
            console.error('❌ Ошибка оформления:', error);
            alert('⚠️ Не удалось оформить заказ: ' + error.message + '\nПопробуйте позже или напишите нам в поддержку.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});