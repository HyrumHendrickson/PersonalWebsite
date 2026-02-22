document.addEventListener('DOMContentLoaded', function() {
    createFloatingElements();

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

    document.querySelectorAll('section, .work-card, .capability-item').forEach(el => {
        observer.observe(el);
    });

    // Hero button click handlers
    const primaryBtn = document.querySelector('.hero-actions .btn-primary');
    const secondaryBtn = document.querySelector('.hero-actions .btn-secondary');

    if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
            window.open('https://hyrumhendrickson.github.io/Study_Tools/', '_blank');
        });
    }

    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', () => {
            window.open('https://www.linkedin.com/in/hyrum-hendrickson-3ab56532b/', '_blank');
        });
    }
});

function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    const elementCount = window.innerWidth > 768 ? 20 : 10;

    for (let i = 0; i < elementCount; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 10 + 's';
        element.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(element);
    }
}
