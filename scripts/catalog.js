// Функция отрисовки товаров
window.renderCatalog = function() {
    const container = document.getElementById('catalog-items');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const slider = document.querySelector('.filter-slider'); // ← находим слайдер

    if (!container || !window.products?.length) return;

    let activeFilter = 'all';

    // 🎯 Функция для анимации слайдера
    function moveSlider(btn) {
        if (!slider) return;
        slider.style.width = btn.offsetWidth + 'px';
        slider.style.left = btn.offsetLeft + 'px';
    }

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

            <button class="add-to-cart-btn" data-product-id="${product.id}">
                В корзину
            </button>

            <a href="product.html?id=${product.id}" class="card-link"></a>
        `;
            container.appendChild(card);
        });
    }

    // Обработчик фильтров
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 1. Переключаем активный класс
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 2. Обновляем текущий фильтр
            activeFilter = this.dataset.filter;

            // 3. 🎯 Двигаем слайдер к нажатой кнопке
            moveSlider(this);

            // 4. Перерисовываем товары
            render(activeFilter);
        });
    });

    // Первая отрисовка
    render('all');

    // 🎯 Инициализация слайдера под первой активной кнопкой
    const initialActive = document.querySelector('.filter-btn.active');
    if (initialActive) {
        moveSlider(initialActive);
    }
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
        // ⚠️ Важно: у тебя карточки имеют класс 'card', а не 'catalog-item'
        const items = document.querySelectorAll('.card');

        items.forEach(item => {
            const name = item.querySelector('.name')?.textContent.toLowerCase() || '';
            item.style.display = name.includes(query) ? '' : 'none';
        });
    });
});

