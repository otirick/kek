document.addEventListener("DOMContentLoaded", function () {
    const reviews = [
        {name: "Николай Петрович", text: "Шапка-ушанка — огонь. Мех теплый, в -20 уши не мерзнут. Завязки крепкие. Рекомендую всем, кто ценит тепло, а не бренды.", rating: 5},
    {name: "Валентина Ивановна", text: "Платок яркий, пёстрый, прямо как у моей бабушки был. Ткань тонкая, шелковистая. Повязала на голову — сразу настроение поднялось.", rating: 5},
    {name: "Дмитрий", text: "Свитер с узорами немного колючий, надо под низ футболку. Но греет отлично. Стирал в машинке при 30 градусах — не сел, не полинял.", rating: 4},
    {name: "Светлана", text: "Красный ковер — классика! Повесила на стену в зале, муж сначала ругался, а потом привык. Ворс мягкий, уютно стало.", rating: 5},
    {name: "Олег", text: "Лебедь из покрышки — шедевр! Привезли уже покрашенным в белый. Поставил на клумбу, соседи завидуют. Тяжелый, ветром не унесет.", rating: 5},
    {name: "Максим", text: "Хлеб дороговат, конечно... Но вкус тот самый, домашний. Корочка хрустит, мякиш мягкий. Видимо, это элитный хлеб.", rating: 4},
    ];

    const reviewsGrid = document.getElementById("reviews-grid");
    // Shuffle and pick a few reviews
    const shuffledReviews = reviews.sort(() => 0.5 - Math.random()).slice(0, 6);

    shuffledReviews.forEach(rev => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
                    <div class="review-author">${rev.name}</div>
                    <div class="review-rating">${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}</div>
                    <div class="review-text">"${rev.text}"</div>
                `;
        reviewsGrid.appendChild(card);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            item.classList.toggle("active");
        });
    });

    // Support Form
    const form = document.getElementById("support-form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log("Support form submitted:", data);
            alert("Ваш вопрос отправлен! Мы свяжемся с вами в ближайшее время.");
            form.reset();
        });
    }
});