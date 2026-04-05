
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

// Hero typewriter animation
const heroTitle = document.querySelector('.hero-title.typewriter');

if (heroTitle) {
    const fullText = (heroTitle.getAttribute('data-text') || heroTitle.textContent || '').trim();
    let charIndex = 0;
    let deleting = false;

    heroTitle.textContent = '';

    const loopTypewriter = () => {
        if (!deleting) {
            charIndex += 1;
            heroTitle.textContent = fullText.slice(0, charIndex);
        } else {
            charIndex -= 1;
            heroTitle.textContent = fullText.slice(0, Math.max(charIndex, 0));
        }

        let nextDelay = deleting ? 90 : 160;

        if (!deleting && charIndex >= fullText.length) {
            deleting = true;
            nextDelay = 1800;
        } else if (deleting && charIndex <= 0) {
            deleting = false;
            nextDelay = 700;
        }

        window.setTimeout(loopTypewriter, nextDelay);
    };

    window.setTimeout(loopTypewriter, 800);
}

// Hero media hover interaction
const heroSection = document.getElementById('home');
const heroVideo = document.getElementById('hero-video');

if (heroSection && heroVideo) {
    const hasVideoSource = heroVideo.querySelector('source')?.getAttribute('src');

    if (hasVideoSource) {
        const startHeroPlayback = () => {
            heroVideo.play().catch(() => {
                // Autoplay may fail depending on browser policy.
            });
        };

        if (heroVideo.readyState >= 2) {
            startHeroPlayback();
        } else {
            heroVideo.addEventListener('loadeddata', startHeroPlayback, { once: true });
        }

        heroSection.addEventListener('mouseenter', () => {
            startHeroPlayback();
            heroVideo.playbackRate = 1.08;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroVideo.playbackRate = 1;
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) startHeroPlayback();
        });
    }
}

// Contact Modal
const contactModal = document.getElementById('contact-modal');
const getInTouchBtn = document.getElementById('get-in-touch-btn');
const packageContactButtons = Array.from(document.querySelectorAll('.package-btn'));
const modalClose = document.getElementById('modal-close');
const contactForm = document.getElementById('contact-form');
const fromNameInput = document.getElementById('from-name');
const fromEmailInput = document.getElementById('from-email');
const contactNumberInput = document.getElementById('contact-number');
const noteInput = document.getElementById('note-field');
const nameError = document.getElementById('name-error');
const fromError = document.getElementById('from-error');
const contactError = document.getElementById('contact-error');
const noteError = document.getElementById('note-error');
const formStatus = document.getElementById('form-status');
const modalSubmitBtn = contactForm?.querySelector('.modal-submit');
const modalSubmitText = contactForm?.querySelector('.modal-submit-text');

function openModal() {
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => fromNameInput?.focus(), 50);
}

function closeModal() {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function clearErrors() {
    nameError.textContent = '';
    fromError.textContent = '';
    contactError.textContent = '';
    noteError.textContent = '';
    fromNameInput.classList.remove('invalid');
    fromEmailInput.classList.remove('invalid');
    contactNumberInput.classList.remove('invalid');
    noteInput.classList.remove('invalid');
}

function setFormStatus(message, type = '') {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove('error', 'success');

    if (type) {
        formStatus.classList.add(type);
    }
}

function setSubmittingState(isSubmitting) {
    if (!modalSubmitBtn || !modalSubmitText) return;

    modalSubmitBtn.disabled = isSubmitting;
    modalSubmitText.textContent = isSubmitting ? 'Sending...' : 'Send Message';
}

if (getInTouchBtn) {
    getInTouchBtn.addEventListener('click', openModal);
}

packageContactButtons.forEach((btn) => {
    btn.addEventListener('click', openModal);
});

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
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        setFormStatus('');

        const nameVal = fromNameInput.value.trim();
        const fromVal = fromEmailInput.value.trim();
        const contactVal = contactNumberInput.value.trim();
        const noteVal = noteInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9+()\-\s]{7,20}$/;
        let valid = true;

        if (!nameVal) {
            nameError.textContent = 'Please enter your name.';
            fromNameInput.classList.add('invalid');
            valid = false;
        }

        if (!fromVal || !emailPattern.test(fromVal)) {
            fromError.textContent = 'Please enter a valid email address.';
            fromEmailInput.classList.add('invalid');
            valid = false;
        }

        if (!contactVal || !phonePattern.test(contactVal)) {
            contactError.textContent = 'Please enter a valid contact number.';
            contactNumberInput.classList.add('invalid');
            valid = false;
        }

        if (!noteVal) {
            noteError.textContent = 'Please enter a message.';
            noteInput.classList.add('invalid');
            valid = false;
        }

        if (!valid) return;

        try {
            setSubmittingState(true);

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: fromVal,
                    contactNumber: contactVal,
                    message: noteVal
                })
            });

            if (!response.ok) {
                throw new Error('Unable to send message right now.');
            }

            setFormStatus('Message sent successfully. We will get back to you soon.', 'success');
            contactForm.reset();
            clearErrors();

            window.setTimeout(() => {
                closeModal();
                setFormStatus('');
            }, 900);
        } catch {
            setFormStatus('Send failed. Please try again in a moment.', 'error');
        } finally {
            setSubmittingState(false);
        }
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