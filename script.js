// Toggle mobile menu visibility
const navMenu = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('#primary-menu');

function toggleMenu() {
    if (!navMenu || !hamburger || !navList) return;

    const isOpen = navMenu.classList.contains('show');
    const nextState = !isOpen;

    navMenu.classList.toggle('mobile-active', nextState);
    navMenu.classList.toggle('show', nextState);
    hamburger.classList.toggle('active', nextState);
    hamburger.setAttribute('aria-expanded', String(nextState));
    navList.setAttribute('aria-hidden', String(!nextState));
}

// Attach to hamburger icon click event
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
} else {
    console.warn('Hamburger element not found');
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        if (navMenu && hamburger && navList) {
            navMenu.classList.remove('mobile-active', 'show');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navList.setAttribute('aria-hidden', 'true');
        }
    });
});

// Filtering projects based on category
function filterProjects(category) {
    const projects = document.querySelectorAll('[data-category]');
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// Attach filter buttons to click events
document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProjects(button.dataset.filter);
    });
});

// Lightbox functionality for project images
function openLightbox(imageSrc, imageAlt = 'Project image') {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Project image preview');

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close" role="button" aria-label="Close preview">&times;</span>
            <img src="${imageSrc}" alt="${imageAlt}">
        </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.remove();
        }
    });

    lightbox.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.remove();
        }
    });
}

// Attach lightbox to project images
const projectImages = document.querySelectorAll('.project img');
if (projectImages.length > 0) {
    projectImages.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt || 'Project image');
        });
    });
} else {
    console.warn('No project images found');
}

// Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Enhanced form validation for contact form
function validateContactForm(formData) {
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();

    const errors = [];

    if (!name) errors.push('Name is required');
    if (!email) errors.push('Email is required');
    else if (!emailRegex.test(email)) errors.push('Please enter a valid email');
    if (!message) errors.push('Message is required');
    if (message && message.length < 10) errors.push('Message must be at least 10 characters');

    return { isValid: errors.length === 0, errors };
}

// Contact form submission and validation
const contactForm = document.querySelector('form[name="contact"]');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const { isValid, errors } = validateContactForm(formData);

        const existingFeedback = contactForm.querySelector('.form-feedback');
        if (existingFeedback) existingFeedback.remove();

        const feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');

        if (isValid) {
            feedback.textContent = '✓ Message sent successfully!';
            feedback.classList.add('success');
            contactForm.reset();
        } else {
            feedback.textContent = '✗ ' + errors.join(', ');
            feedback.classList.add('error');
        }

        contactForm.appendChild(feedback);
        setTimeout(() => feedback.remove(), 4000);
    });
} else {
    console.warn('Contact form not found');
}

// Real-time feedback for form inputs
const formInputs = document.querySelectorAll('form[name="contact"] input, form[name="contact"] textarea');

if (formInputs.length > 0) {
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
} else {
    console.warn('Form inputs not found');
}

function validateField(field) {
    let errorMessage = '';

    if (!field.value.trim()) {
        errorMessage = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`;
    } else if (field.name === 'email' && !emailRegex.test(field.value)) {
        errorMessage = 'Please enter a valid email address';
    } else if (field.name === 'message' && field.value.trim().length < 10) {
        errorMessage = 'Message must be at least 10 characters';
    }

    removeFieldError(field);

    if (errorMessage) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');

        const errorDiv = document.createElement('span');
        errorDiv.className = 'field-error';
        errorDiv.textContent = errorMessage;
        errorDiv.setAttribute('role', 'alert');

        field.parentNode.appendChild(errorDiv);
    } else {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    }
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
}