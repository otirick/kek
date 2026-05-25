// scripts/products.js — Загрузка товаров с сервера
window.products = []; // Временная заглушка, чтобы старый код не падал

(async function loadProductsFromServer() {
    try {
        const response = await fetch('api/products.php');
        if (!response.ok) throw new Error('HTTP ' + response.status);

        const products = await response.json();

        // Форматируем цены под ваш старый формат: "2 590 ₽"
        products.forEach(p => {
            p.price = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                maximumFractionDigits: 0
            }).format(p.price);
        });

        // Делаем доступным глобально для совместимости
        window.products = products;

        // Сообщаем остальным скриптам, что данные готовы
        document.dispatchEvent(new CustomEvent('products:loaded', { detail: products }));

        // Если каталог уже отрисовался — перерисовываем
        if (typeof window.renderCatalog === 'function') {
            window.renderCatalog();
        }

    } catch (error) {
        console.error('❌ Ошибка загрузки товаров:', error);
        // Fallback: пустой массив, чтобы сайт не ломался
        window.products = [];
    }
})();