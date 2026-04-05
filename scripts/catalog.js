const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

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

        cards.forEach((card) => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
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
});