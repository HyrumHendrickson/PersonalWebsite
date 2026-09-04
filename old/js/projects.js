document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-detailed-card, .project-link-card').forEach(card => {
        observer.observe(card);
    });

    // Click handlers for project cards using data-url attribute
    document.querySelectorAll('[data-url]').forEach(card => {
        card.addEventListener('click', () => {
            window.open(card.dataset.url, '_blank');
        });
    });
});
