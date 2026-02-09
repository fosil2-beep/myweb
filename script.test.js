// Tests for script.js
describe('Mobile Menu Toggle', () => {
    test('toggleMenu should toggle classes and ARIA attributes', () => {
        document.body.innerHTML = `
            <nav>
                <button class="hamburger" aria-expanded="false"></button>
                <ul id="primary-menu" aria-hidden="false"></ul>
            </nav>
        `;
        toggleMenu();
        const nav = document.querySelector('nav');
        const button = document.querySelector('.hamburger');
        const menu = document.querySelector('#primary-menu');

        expect(nav.classList.contains('show')).toBe(true);
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(menu.getAttribute('aria-hidden')).toBe('false');

        toggleMenu();
        expect(nav.classList.contains('show')).toBe(false);
        expect(button.getAttribute('aria-expanded')).toBe('false');
        expect(menu.getAttribute('aria-hidden')).toBe('true');
    });
});

describe('Smooth Scrolling', () => {
    test('smooth scrolling should prevent default and scroll to target', () => {
        document.body.innerHTML = '<nav><a href="#section1"></a></nav><section id="section1"></section>';
        const link = document.querySelector('nav a');
        const mockScroll = jest.fn();
        document.querySelector('#section1').scrollIntoView = mockScroll;
        link.click();
        expect(mockScroll).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
});

describe('Project Filtering', () => {
    test('filterProjects should show all projects when category is all', () => {
        document.body.innerHTML = '<div data-category="web"></div><div data-category="design"></div>';
        filterProjects('all');
        const projects = document.querySelectorAll('[data-category]');
        projects.forEach(p => expect(p.style.display).toBe('block'));
    });

    test('filterProjects should show only matching category', () => {
        document.body.innerHTML = '<div data-category="web" style="display: block;"></div><div data-category="design" style="display: block;"></div>';
        filterProjects('web');
        expect(document.querySelector('[data-category="web"]').style.display).toBe('block');
        expect(document.querySelector('[data-category="design"]').style.display).toBe('none');
    });
});

describe('Lightbox', () => {
    test('openLightbox should create accessible dialog', () => {
        document.body.innerHTML = '';
        openLightbox('test.jpg', 'Test image');
        const lightbox = document.querySelector('.lightbox');

        expect(lightbox).toBeTruthy();
        expect(lightbox.getAttribute('role')).toBe('dialog');
        expect(lightbox.getAttribute('aria-modal')).toBe('true');
        expect(document.querySelector('.lightbox img').alt).toBe('Test image');
    });

    test('lightbox should close on click', () => {
        document.body.innerHTML = '';
        openLightbox('test.jpg');
        const lightbox = document.querySelector('.lightbox');
        lightbox.click();
        expect(document.querySelector('.lightbox')).toBeFalsy();
    });
});

describe('Form Validation', () => {
    test('validateContactForm should return valid for correct data', () => {
        const formData = new FormData();
        formData.append('name', 'John');
        formData.append('email', 'john@example.com');
        formData.append('message', 'This is a test message');
        const result = validateContactForm(formData);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    test('validateContactForm should return errors for invalid data', () => {
        const formData = new FormData();
        formData.append('name', '');
        formData.append('email', 'invalid');
        formData.append('message', 'short');
        const result = validateContactForm(formData);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

describe('Field Validation', () => {
    test('validateField should set aria-invalid on error', () => {
        document.body.innerHTML = '<div><input name="test" value=""></div>';
        const field = document.querySelector('input');
        validateField(field);
        expect(field.getAttribute('aria-invalid')).toBe('true');
    });

    test('validateField should clear aria-invalid when valid', () => {
        document.body.innerHTML = '<div><input name="email" value="test@example.com"></div>';
        const field = document.querySelector('input');
        validateField(field);
        expect(field.getAttribute('aria-invalid')).toBe('false');
    });
});