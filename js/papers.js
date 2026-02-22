document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const paperCards = document.querySelectorAll('.paper-card');

    // Ensure all cards are visible initially
    paperCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.dataset.filter;

            paperCards.forEach(card => {
                const categories = card.dataset.categories.split(' ');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    // PDF Preview functionality
    const modal = document.getElementById('pdfModal');
    const modalTitle = document.getElementById('modalTitle');
    const pdfFrame = document.getElementById('pdfFrame');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalDownload = document.getElementById('modalDownload');
    const modalOpenNew = document.getElementById('modalOpenNew');

    let currentPdfUrl = '';

    document.querySelectorAll('.preview-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.paper-card');
            const pdfUrl = card.dataset.pdf;
            const title = card.querySelector('.paper-title').textContent;
            showPdfPreview(pdfUrl, title);
        });
    });

    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.paper-card');
            const pdfUrl = card.dataset.pdf;
            downloadPdf(pdfUrl);
        });
    });

    modalClose.addEventListener('click', closePdfPreview);
    modalBackdrop.addEventListener('click', closePdfPreview);

    modalDownload.addEventListener('click', () => {
        downloadPdf(currentPdfUrl);
    });

    modalOpenNew.addEventListener('click', () => {
        window.open(currentPdfUrl, '_blank');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePdfPreview();
        }
    });

    function showPdfPreview(pdfUrl, title) {
        currentPdfUrl = pdfUrl;
        modalTitle.textContent = title;
        pdfFrame.src = pdfUrl;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePdfPreview() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            pdfFrame.src = '';
        }, 300);
    }

    function downloadPdf(pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = pdfUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.papers-hero, .papers-filters').forEach(el => {
        if (el) observer.observe(el);
    });
});
