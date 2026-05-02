document.addEventListener("DOMContentLoaded", function () {
    const checkoutItemsList = document.getElementById("checkout-items-list");
    const checkoutTotalPrice = document.getElementById("checkout-total-price");
    const checkoutForm = document.getElementById("checkout-form");

    // Load cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
        checkoutItemsList.innerHTML = '<p>Ваша корзина пуста</p>';
        checkoutTotalPrice.innerHTML = '<span>Итого:</span> <span>0 ₽</span>';
        const submitBtn = checkoutForm.querySelector('.submit-order-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
        return;
    }

    // Render items
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
        `;
        checkoutItemsList.appendChild(itemEl);
    });

    // Render total
    const formattedTotal = totalPrice.toLocaleString('ru-RU') + ' ₽';
    checkoutTotalPrice.innerHTML = `<span>Итого:</span> <span>${formattedTotal}</span>`;

    // Handle form submission
    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(checkoutForm);
        const customerData = {
            fullname: formData.get('fullname'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            postalCode: formData.get('postalCode'),
        };

        console.log("Order submitted:", {
            customer: customerData,
            items: cartItems,
            total: formattedTotal
        });

        alert(`Спасибо за заказ, ${customerData.fullname}! Мы свяжемся с вами по номеру ${customerData.phone}.`);

        // Clear cart
        localStorage.removeItem('cartItems');
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
});
