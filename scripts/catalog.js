// scripts/catalog.js — Отрисовка каталога

// Функция отрисовки товаров
window.renderCatalog = function() {
    const container = document.getElementById('catalog-items');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!container || !window.products?.length) return;

    let activeFilter = 'all';

    function render(filter = 'all') {
        container.innerHTML = '';

        const filtered = filter === 'all'
            ? window.products
            : window.products.filter(p => p.category === filter);

        if (filtered.length === 0) {
            container.innerHTML = '<p class="no-results">Товары не найдены</p>';
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'catalog-item';
            card.dataset.category = product.category;
            card.innerHTML = `
                <a href="product-page.html?id=${product.id}">
                    <div class="product-image">
                        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <span class="product-price">${product.price}</span>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">В корзину</button>
                    </div>
                </a>
            `;
            container.appendChild(card);
        });
    }

    // Обработчик фильтров
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.dataset.filter;
            render(activeFilter);
        });
    });

    // Первая отрисовка
    render('all');
};

// Запускаем при загрузке DOM и при получении данных с сервера
document.addEventListener('DOMContentLoaded', function() {
    if (window.products?.length) {
        window.renderCatalog();
    } else {
        document.addEventListener('products:loaded', () => window.renderCatalog(), { once: true });
    }
});

// Поиск по каталогу (если есть поле поиска)
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const items = document.querySelectorAll('.catalog-item');

        items.forEach(item => {
            const name = item.querySelector('.product-name')?.textContent.toLowerCase() || '';
            item.style.display = name.includes(query) ? '' : 'none';
        });
    });
});