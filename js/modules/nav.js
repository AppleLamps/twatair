/**
 * TwatAir Navigation Module
 * Handles responsive navigation menu and active page highlighting
 */

import { dom } from './utils.js';
import { icons } from './icons.js';

export class Navigation {
    constructor() {
        this.navData = [
            { href: 'index.html', text: 'HOME', icon: 'home' },
            { href: 'book.html', text: 'BOOK FLIGHTS', icon: 'plane' },
            { href: 'destinations.html', text: 'DESTINATIONS', icon: 'map' },
            { href: 'fees.html', text: 'FEES', icon: 'money' },
            { href: 'about.html', text: 'ABOUT', icon: 'info' },
            { href: 'coin.html', text: 'COIN', icon: 'coin' },
            { href: 'contact.html', text: 'CONTACT', icon: 'phone' }
        ];
        this.isOpen = false;
        this.backdrop = null;
    }

    /**
     * Initialize navigation
     */
    init() {
        this.createNav();
        this.bindEvents();
        this.setActivePage();
    }

    /**
     * Create navigation HTML structure
     */
    createNav() {
        const navContainer = dom.get('#nav-container');
        if (!navContainer) return;

        // Create backdrop for mobile menu
        this.backdrop = dom.create('div', { className: 'nav-backdrop' });
        document.body.appendChild(this.backdrop);

        // Create nav wrapper
        const nav = dom.create('nav', { className: 'nav' });

        // Create mobile toggle button
        const toggleBtn = dom.create('button', {
            className: 'nav-toggle',
            'aria-label': 'Toggle navigation menu',
            'aria-expanded': 'false'
        });
        toggleBtn.innerHTML = icons.menu;

        // Create nav menu
        const menu = dom.create('ul', { className: 'nav-menu' });

        // Add nav items
        this.navData.forEach(item => {
            const li = dom.create('li');
            const a = dom.create('a', { href: item.href });

            // Add icon
            const iconSpan = dom.create('span', { className: 'nav-icon' });
            iconSpan.innerHTML = icons[item.icon] || '';
            a.appendChild(iconSpan);

            // Add text
            const textSpan = dom.create('span', {
                className: 'nav-text',
                textContent: item.text
            });
            a.appendChild(textSpan);

            li.appendChild(a);
            menu.appendChild(li);
        });

        // Assemble nav
        nav.appendChild(toggleBtn);
        nav.appendChild(menu);
        navContainer.appendChild(nav);

        this.nav = nav;
        this.menu = menu;
        this.toggleBtn = toggleBtn;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Mobile menu toggle
        dom.on(this.toggleBtn, 'click', () => this.toggleMenu());

        // Close menu when clicking backdrop
        dom.on(this.backdrop, 'click', () => this.closeMenu());

        // Close menu when clicking outside
        dom.on(document, 'click', (e) => {
            if (!this.nav.contains(e.target) && !this.backdrop.contains(e.target) && this.isOpen) {
                this.closeMenu();
            }
        }, { passive: true });

        // Close menu on window resize (desktop)
        dom.on(window, 'resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        }, { passive: true });

        // Close menu on Escape key
        dom.on(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle navigation clicks
        dom.on(this.menu, 'click', (e) => {
            if (e.target.tagName === 'A') {
                this.handleNavClick(e);
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMenu() {
        this.isOpen = !this.isOpen;
        dom.toggleClass(this.menu, 'open');
        dom.toggleClass(this.toggleBtn, 'active');
        dom.toggleClass(this.backdrop, 'active');
        document.body.classList.toggle('menu-open', this.isOpen);

        // Update toggle button icon and aria state
        this.toggleBtn.innerHTML = this.isOpen ? icons.close : icons.menu;
        this.toggleBtn.setAttribute('aria-expanded', this.isOpen.toString());
    }

    /**
     * Close mobile menu
     */
    closeMenu() {
        this.isOpen = false;
        dom.removeClass(this.menu, 'open');
        dom.removeClass(this.toggleBtn, 'active');
        dom.removeClass(this.backdrop, 'active');
        document.body.classList.remove('menu-open');
        this.toggleBtn.innerHTML = icons.menu;
        this.toggleBtn.setAttribute('aria-expanded', 'false');
    }

    /**
     * Handle navigation link clicks
     * @param {Event} e - Click event
     */
    handleNavClick(e) {
        // Close mobile menu
        this.closeMenu();

        // Add click tracking or analytics here if needed
    }

    /**
     * Set active page based on current URL
     */
    setActivePage() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        dom.getAll('.nav-menu a').forEach(link => {
            const linkPath = link.href.split('/').pop();

            if (linkPath === currentPath) {
                dom.addClass(link, 'active');
            } else {
                dom.removeClass(link, 'active');
            }
        });
    }

    /**
     * Get navigation data (for external use)
     * @returns {Array} Navigation items
     */
    getNavData() {
        return this.navData;
    }
}

// Export singleton instance
export const navigation = new Navigation();