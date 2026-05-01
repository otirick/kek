const filterBtns = document.querySelectorAll('.filter-btn');
const catalogItemsContainer = document.getElementById('catalog-items');

function renderProducts(filter = 'all') {
    if (!catalogItemsContainer) return;

    catalogItemsContainer.innerHTML = '';

    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.category = product.category;

        card.innerHTML = `
            <div class="card-img">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="card-info">
                <span class="name">${product.name}</span>
                <span class="price">${product.price}</span>
            </div>
            <button class="add-to-cart-btn">В корзину</button>
            <a href="product.html?id=${product.id}" class="card-link"></a>
        `;

        catalogItemsContainer.appendChild(card);
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Двигаем индикатор
        const slider = document.querySelector('.filter-slider');
        if (slider) {
            slider.style.width = btn.offsetWidth + 'px';
            slider.style.left = btn.offsetLeft + 'px';
        }

        const filter = btn.getAttribute('data-filter');
        renderProducts(filter);
    });
});

// Установить индикатор на активную кнопку при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const activeBtn = document.querySelector('.filter-btn.active');
    const slider = document.querySelector('.filter-slider');
    if (activeBtn && slider) {
        slider.style.width = activeBtn.offsetWidth + 'px';
        slider.style.left = activeBtn.offsetLeft + 'px';
    }
    renderProducts();
});
