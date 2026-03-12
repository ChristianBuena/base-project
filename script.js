
// Intersection Observer for Scroll Reveals
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
});

// Contact Modal
const contactModal = document.getElementById('contact-modal');
const getInTouchBtn = document.getElementById('get-in-touch-btn');
const modalClose = document.getElementById('modal-close');
const contactForm = document.getElementById('contact-form');
const fromEmailInput = document.getElementById('from-email');
const noteInput = document.getElementById('note-field');
const fromError = document.getElementById('from-error');
const noteError = document.getElementById('note-error');

function openModal() {
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => fromEmailInput && fromEmailInput.focus(), 50);
}

function closeModal() {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function clearErrors() {
    fromError.textContent = '';
    noteError.textContent = '';
    fromEmailInput.classList.remove('invalid');
    noteInput.classList.remove('invalid');
}

if (getInTouchBtn) {
    getInTouchBtn.addEventListener('click', openModal);
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (contactModal) {
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('open')) closeModal();
});

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const fromVal = fromEmailInput.value.trim();
        const noteVal = noteInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let valid = true;

        if (!fromVal || !emailPattern.test(fromVal)) {
            fromError.textContent = 'Please enter a valid email address.';
            fromEmailInput.classList.add('invalid');
            valid = false;
        }

        if (!noteVal) {
            noteError.textContent = 'Please enter a message.';
            noteInput.classList.add('invalid');
            valid = false;
        }

        if (!valid) return;

        const subject = encodeURIComponent('New Inquiry from ' + fromVal);
        const body = encodeURIComponent('From: ' + fromVal + '\n\n' + noteVal);
        window.location.href = 'mailto:thebaseproject@gmail.com?subject=' + subject + '&body=' + body;

        closeModal();
        contactForm.reset();
        clearErrors();
    });
}

// Show More / Show Less for Projects
const showMoreBtn = document.getElementById('show-more-btn');
const showMoreWrapper = document.getElementById('show-more-wrapper');
const allProjects = Array.from(document.querySelectorAll('.project-card'));
const VISIBLE_COUNT = 4;
let projectsExpanded = false;

// Dynamically hide everything beyond the first 4
const extraProjects = allProjects.slice(VISIBLE_COUNT);

extraProjects.forEach(p => {
    p.style.display = 'none';
});

// Show button only if there are more than 4 projects
if (showMoreWrapper) {
    showMoreWrapper.style.display = extraProjects.length > 0 ? 'flex' : 'none';
}

if (showMoreBtn && extraProjects.length > 0) {
    showMoreBtn.addEventListener('click', () => {
        projectsExpanded = !projectsExpanded;

        if (projectsExpanded) {
            extraProjects.forEach((p, i) => {
                p.style.display = 'block';
                p.style.opacity = '0';
                p.style.transform = 'translateY(24px)';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        p.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
                        p.style.opacity = '1';
                        p.style.transform = 'translateY(0)';
                    });
                });
            });
        } else {
            extraProjects.forEach(p => {
                p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                p.style.opacity = '0';
                p.style.transform = 'translateY(24px)';
                setTimeout(() => {
                    p.style.display = 'none';
                    p.style.transition = '';
                }, 350);
            });
        }

        showMoreBtn.querySelector('.show-more-text').textContent = projectsExpanded ? 'Show Less' : 'View More';
        showMoreBtn.querySelector('.show-more-arrow').style.transform = projectsExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    });
}