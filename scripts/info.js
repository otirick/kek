document.addEventListener("DOMContentLoaded", function () {
            const reviews = [
                { name: "Александр", text: "Отличное качество, футболка после стирки не села. Рекомендую!", rating: 5 },
                { name: "Мария", text: "Очень быстрая доставка. Куртка подошла идеально.", rating: 5 },
                { name: "Дмитрий", text: "Нормальные штаны, но доставка задержалась на день.", rating: 4 },
                { name: "Елена", text: "Очень стильные носки, теперь заказываю только здесь.", rating: 5 },
                { name: "Игорь", text: "Все супер, сервис на высоте!", rating: 5 },
                { name: "Анна", text: "Качество ткани очень приятное к телу.", rating: 4 }
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