document.addEventListener("DOMContentLoaded", function () {

    // Корзина
    const cart = document.querySelector(".cart");
    const cartButton = document.querySelector(".cartButton");

    if (cartButton && cart) {
        cartButton.addEventListener("click", function (event) {
            event.stopPropagation();
            cart.classList.toggle("open");
        });

        document.addEventListener("click", function (event) {
            if (!cart.contains(event.target)) {
                cart.classList.remove("open");
            }
        });
    }

    // Выбор размера
    const sizeBtns = document.querySelectorAll(".size-btn");
    sizeBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            sizeBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Переключение миниатюр и основного изображения
    const thumbs = document.querySelectorAll(".thumb");
    const mainImg = document.querySelector(".main-img-wrapper img");
    let currentThumbIndex = 0;

    function switchImage(index) {
        thumbs.forEach(t => t.classList.remove("active"));
        thumbs[index].classList.add("active");
        mainImg.src = thumbs[index].querySelector("img").src;
        currentThumbIndex = index;
    }

    thumbs.forEach(function (thumb, index) {
        thumb.addEventListener("click", function () {
            switchImage(index);
        });
    });

    // Стрелки
    const prevBtn = document.querySelector(".gallery-arrow.prev");
    const nextBtn = document.querySelector(".gallery-arrow.next");

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", function () {
            const newIndex = currentThumbIndex > 0 ? currentThumbIndex - 1 : thumbs.length - 1;
            switchImage(newIndex);
        });

        nextBtn.addEventListener("click", function () {
            const newIndex = currentThumbIndex < thumbs.length - 1 ? currentThumbIndex + 1 : 0;
            switchImage(newIndex);
        });
    }

    // Модальное окно — открытие по клику на фото
    const mainImgEl = document.querySelector(".main-img-wrapper img");
    const modal = document.getElementById("imageModal");
    const modalWrapper = modal.querySelector(".modal-img-wrapper");
    const modalImg = modal.querySelector(".modal-img");
    const modalClose = modal.querySelector(".modal-close");
    const modalPrev = modal.querySelector(".modal-prev");
    const modalNext = modal.querySelector(".modal-next");
    const modalCounter = modal.querySelector(".modal-counter .modal-current");
    const modalTotal = modal.querySelector(".modal-counter .modal-total");
    let modalIndex = 0;

    // Общее количество фото
    if (modalTotal) {
        modalTotal.textContent = thumbs.length;
    }

    function openModal(index) {
        modalIndex = index;
        modalWrapper.classList.remove("loaded");
        modalImg.src = thumbs[index].querySelector("img").src;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        updateModalCounter();
    }

    function closeModal() {
        modal.classList.remove("active");
        modalWrapper.classList.remove("loaded");
        document.body.style.overflow = "";
    }

    function updateModalCounter() {
        if (modalCounter) {
            modalCounter.textContent = modalIndex + 1;
        }
    }

    function switchModalImage(index) {
        modalIndex = index;
        modalWrapper.classList.remove("loaded");
        modalImg.src = thumbs[index].querySelector("img").src;
        updateModalCounter();
    }

    if (mainImgEl) {
        mainImgEl.addEventListener("click", function () {
            openModal(currentThumbIndex);
        });
    }

    // Анимация появления после загрузки
    modalImg.addEventListener("load", function () {
        modalWrapper.classList.add("loaded");
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalPrev) {
        modalPrev.addEventListener("click", function () {
            const newIndex = modalIndex > 0 ? modalIndex - 1 : thumbs.length - 1;
            switchModalImage(newIndex);
        });
    }

    if (modalNext) {
        modalNext.addEventListener("click", function () {
            const newIndex = modalIndex < thumbs.length - 1 ? modalIndex + 1 : 0;
            switchModalImage(newIndex);
        });
    }

    // Закрытие по Escape и навигация стрелками клавиатуры
    document.addEventListener("keydown", function (e) {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft") modalPrev.click();
        if (e.key === "ArrowRight") modalNext.click();
    });

    // Закрытие по клику на фон
    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeModal();
        });
    }

    // Аккордеон
    const accordionTitles = document.querySelectorAll(".accordion-title");
    accordionTitles.forEach(function (title) {
        title.addEventListener("click", function () {
            const item = this.parentElement;
            item.classList.toggle("open");
        });
    });
});
