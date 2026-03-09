
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