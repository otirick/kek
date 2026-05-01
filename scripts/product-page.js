document.addEventListener("DOMContentLoaded", function () {
    // 1. --- Data Loading ---
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = window.products ? window.products.find(p => p.id === productId) : null;

    if (!product) {
        document.body.innerHTML = '<div class="container" style="padding: 50px; text-align: center;"><h1>Товар не найден</h1><a href="index.html">Вернуться в каталог</a></div>';
        return;
    }

    // 2. --- DOM Elements ---
    const breadcrumbCurrent = document.getElementById("breadcrumb-current");
    const mainImg = document.getElementById("main-product-img");
    const thumbnailsContainer = document.getElementById("product-thumbnails");
    const productTitle = document.getElementById("product-title");
    const productPrice = document.getElementById("product-price");
    const descriptionList = document.getElementById("product-description-list");
    const careList = document.getElementById("product-care-list");
    const deliveryList = document.getElementById("product-delivery-list");
    const returnText = document.getElementById("product-return-text");
    const cart = document.querySelector(".cart");
    const cartButton = document.querySelector(".cartButton");
    const sizeBtns = document.querySelectorAll(".size-btn");
    const accordionTitles = document.querySelectorAll(".accordion-title");

    // 3. --- Populate Content ---
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;
    if (productTitle) productTitle.textContent = product.name;
    if (productPrice) productPrice.textContent = product.price;
    if (mainImg) {
        mainImg.src = product.images[0];
        mainImg.alt = product.name;
    }

    if (descriptionList) {
        product.description.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            descriptionList.appendChild(li);
        });
    }

    if (careList) {
        product.care.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            careList.appendChild(li);
        });
    }

    if (deliveryList) {
        product.delivery.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            deliveryList.appendChild(li);
        });
    }

    if (returnText) returnText.textContent = product.return;

    // 4. --- Gallery Logic ---
    let currentThumbIndex = 0;
    const thumbs = [];

    if (thumbnailsContainer) {
        product.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumb ${index === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${imgSrc}" alt="">`;
            thumb.addEventListener('click', () => switchImage(index));
            thumbnailsContainer.appendChild(thumb);
            thumbs.push(thumb);
        });
    }

    function switchImage(index) {
        if (thumbs.length === 0) return;
        thumbs.forEach(t => t.classList.remove("active"));
        thumbs[index].classList.add("active");
        mainImg.src = thumbs[index].querySelector("img").src;
        currentThumbIndex = index;
    }

    const prevBtn = document.querySelector(".gallery-arrow.prev");
    const nextBtn = document.querySelector(".gallery-arrow.next");
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            const newIndex = currentThumbIndex > 0 ? currentThumbIndex - 1 : thumbs.length - 1;
            switchImage(newIndex);
        });
        nextBtn.addEventListener("click", () => {
            const newIndex = currentThumbIndex < thumbs.length - 1 ? currentThumbIndex + 1 : 0;
            switchImage(newIndex);
        });
    }

    // 5. --- Modal Logic ---
    const modal = document.getElementById("imageModal");
    const modalWrapper = modal.querySelector(".modal-img-wrapper");
    const modalImg = modal.querySelector(".modal-img");
    const modalClose = modal.querySelector(".modal-close");
    const modalPrev = modal.querySelector(".modal-prev");
    const modalNext = modal.querySelector(".modal-next");
    const modalCounter = modal.querySelector(".modal-counter .modal-current");
    const modalTotal = modal.querySelector(".modal-counter .modal-total");
    let modalIndex = 0;

    if (modalTotal && thumbs.length > 0) {
        modalTotal.textContent = thumbs.length;
    }

    function openModal(index) {
        modalIndex = index;
        modalWrapper.classList.remove("loaded");
        modalImg.src = thumbs[index].querySelector("img").src;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        if (modalCounter) modalCounter.textContent = modalIndex + 1;
    }

    function closeModal() {
        modal.classList.remove("active");
        modalWrapper.classList.remove("loaded");
        document.body.style.overflow = "";
    }

    function switchModalImage(index) {
        modalIndex = index;
        modalWrapper.classList.remove("loaded");
        modalImg.src = thumbs[index].querySelector("img").src;
        if (modalCounter) modalCounter.textContent = modalIndex + 1;
    }

    if (mainImg) {
        mainImg.addEventListener("click", () => openModal(currentThumbIndex));
    }

    modalImg.addEventListener("load", () => modalWrapper.classList.add("loaded"));
    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalPrev) {
        modalPrev.addEventListener("click", () => {
            const newIndex = modalIndex > 0 ? modalIndex - 1 : thumbs.length - 1;
            switchModalImage(newIndex);
        });
    }
    if (modalNext) {
        modalNext.addEventListener("click", () => {
            const newIndex = modalIndex < thumbs.length - 1 ? modalIndex + 1 : 0;
            switchModalImage(newIndex);
        });
    }
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft") modalPrev.click();
        if (e.key === "ArrowRight") modalNext.click();
    });
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // 6. --- UI Extras (Cart, Sizes, Accordion) ---
    if (cartButton && cart) {
        cartButton.addEventListener("click", (e) => {
            e.stopPropagation();
            cart.classList.toggle("open");
        });
        document.addEventListener("click", (e) => {
            if (!cart.contains(e.target)) cart.classList.remove("open");
        });
    }

    sizeBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            sizeBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
        });
    });

    accordionTitles.forEach(title => {
        title.addEventListener("click", function() {
            this.parentElement.classList.toggle("open");
        });
    });
});
