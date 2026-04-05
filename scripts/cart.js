document.addEventListener("DOMContentLoaded", function () {
    const cart = document.querySelector(".cart");
    const cartButton = document.querySelector(".cartButton");

    cartButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Чтобы клик по кнопке не закрывал корзину
        cart.classList.toggle("open");
    });

    document.addEventListener("click", function (event) {
        if (!cart.contains(event.target)) {
            cart.classList.remove("open");
        }
    });
});