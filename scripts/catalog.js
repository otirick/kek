const filterBtns = document.querySelectorAll('.filter-btn');
const catalogItemsContainer = document.getElementById('catalog-items');
const searchInput = document.querySelector('.searchInput');
const searchSubmitBtn = document.querySelector('.submitButton');

function renderProducts(filter = 'all', searchQuery = '') {
    if (!catalogItemsContainer) return;

    catalogItemsContainer.innerHTML = '';

    // Используем window.products, так как он объявлен глобально
    const allProducts = window.products || [];

    let filteredProducts = filter === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === filter);

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query)
        );
    }

    if (filteredProducts.length === 0) {
        catalogItemsContainer.innerHTML = '<p class="no-results" style="text-align: center; width: 100%; padding: 20px;">Ничего не найдено</p>';
        return;
    }

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
            <button class="add-to-cart-btn" data-product-id="${product.id}">В корзину</button>
            <a href="product.html?id=${product.id}" class="card-link"></a>
        `;

        catalogItemsContainer.appendChild(card);
    });
}

function handleSearch() {
    const query = searchInput.value.trim();
    const activeBtn = document.querySelector('.filter-btn.active');
    const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    renderProducts(filter, query);
}

if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
    });
}

if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const slider = document.querySelector('.filter-slider');
        if (slider) {
            slider.style.width = btn.offsetWidth + 'px';
            slider.style.left = btn.offsetLeft + 'px';
        }

        const filter = btn.getAttribute('data-filter');
        const query = searchInput.value.trim();
        renderProducts(filter, query);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const activeBtn = document.querySelector('.filter-btn.active');
    const slider = document.querySelector('.filter-slider');
    if (activeBtn && slider) {
        slider.style.width = activeBtn.offsetWidth + 'px';
        slider.style.left = activeBtn.offsetLeft + 'px';
    }
    renderProducts();
});




