document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.close-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');

    let currentIndex = 0;
    let visibleItems = [...items];

    // Staggered Entry Animation for Filtering
    function animateItems(filteredItems) {
        items.forEach(item => {
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.95)';
        });

        filteredItems.forEach((item, index) => {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, index * 80); // Stagger effect
        });
    }

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            const toShow = Array.from(items).filter(item => {
                const itemCategory = item.getAttribute('data-category');
                return category === 'all' || itemCategory === category;
            });

            animateItems(toShow);
            visibleItems = toShow;
        });
    });

    // Lightbox Logic
    items.forEach((item) => {
        item.addEventListener('click', () => {
            currentIndex = visibleItems.indexOf(item);
            showLightbox(item);
        });
    });

    function showLightbox(item) {
        if (!item) return;
        const imgSrc = item.querySelector('img').src;
        const imgAlt = item.querySelector('img').alt;

        lightboxImg.style.transform = 'scale(0.9)';
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            lightboxImg.style.transform = 'scale(1)';
        }, 50);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        showLightbox(visibleItems[currentIndex]);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        showLightbox(visibleItems[currentIndex]);
    }

    // Event Listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox(); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Initial load animation
    animateItems(Array.from(items));
});
