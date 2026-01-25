/**
 * TwatAir Main Application Module
 * Entry point that initializes all core modules and handles global app state
 */

import { header } from './header.js';
import { footer } from './footer.js';
import { toast } from './toast.js';

// Global app configuration
const CONFIG = {
    version: '1.0.0',
    debug: false,
    animations: true,
    rudeMode: true // Always true for TwatAir
};

/**
 * Main application class
 */
export class TwatAirApp {
    constructor() {
        this.initialized = false;
        this.modules = new Map();
        this.config = CONFIG;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;

        try {
            // Initialize core modules
            await this.initCoreModules();

            // Initialize page-specific modules
            await this.initPageModules();

            // Add global event listeners
            this.bindGlobalEvents();

            // Show welcome message
            this.showWelcomeMessage();

            this.initialized = true;

            // Signal that app is ready - triggers smooth fade-in
            this.signalReady();

        } catch (error) {
            console.error('💥 TwatAir initialization failed:', error);
            this.showErrorMessage();
            // Still show the page even on error
            this.signalReady();
        }
    }

    /**
     * Signal that the app is ready and trigger fade-in
     */
    signalReady() {
        // Use requestAnimationFrame to ensure styles are applied before transition
        requestAnimationFrame(() => {
            document.body.classList.add('app-ready');
        });
    }

    /**
     * Initialize core modules (header, footer, nav, toast)
     */
    async initCoreModules() {
        // Initialize toast notification system
        toast.init();

        // Initialize header (includes navigation)
        await header.init();

        // Initialize footer
        await footer.init();

        // Store module references
        this.modules.set('header', header);
        this.modules.set('footer', footer);
        this.modules.set('toast', toast);
    }

    /**
     * Initialize page-specific modules based on current page
     */
    async initPageModules() {
        const currentPage = this.getCurrentPage();

        try {
            switch (currentPage) {
                case 'index':
                    await this.initHomePage();
                    break;
                case 'book':
                    await this.initBookPage();
                    break;
                case 'destinations':
                    await this.initDestinationsPage();
                    break;
                case 'fees':
                    await this.initFeesPage();
                    break;
                case 'about':
                    await this.initAboutPage();
                    break;
                case 'contact':
                    await this.initContactPage();
                    break;
                case 'coin':
                    await this.initCoinPage();
                    break;
                default:
                    console.warn(`Unknown page: ${currentPage}`);
            }
        } catch (error) {
            console.error(`Failed to initialize ${currentPage} page:`, error);
        }
    }

    /**
     * Initialize home page modules
     */
    async initHomePage() {
        const { hero } = await import('./hero.js');
        await hero.init();
        this.modules.set('hero', hero);
    }

    /**
     * Initialize booking page modules
     */
    async initBookPage() {
        const { bookingWidget } = await import('./bookingWidget.js');
        await bookingWidget.init();
        this.modules.set('bookingWidget', bookingWidget);
    }

    /**
     * Initialize destinations page modules
     */
    async initDestinationsPage() {
        const { destinations } = await import('./destinations.js');
        await destinations.init();
        this.modules.set('destinations', destinations);
    }

    /**
     * Initialize fees page modules
     */
    async initFeesPage() {
        const { feeCalculator } = await import('./feeCalculator.js');
        await feeCalculator.init();
        this.modules.set('feeCalculator', feeCalculator);
    }

    /**
     * Initialize about page modules
     */
    async initAboutPage() {
        const { about } = await import('./about.js');
        await about.init();
        this.modules.set('about', about);
    }

    /**
     * Initialize contact page modules
     */
    async initContactPage() {
        const { contact } = await import('./contact.js');
        await contact.init();
        this.modules.set('contact', contact);
    }

    /**
     * Initialize coin page modules
     */
    async initCoinPage() {
        const { coin } = await import('./coin.js');
        await coin.init();
        this.modules.set('coin', coin);
    }

    /**
     * Get current page name from URL
     * @returns {string} Page name (e.g., 'index', 'book', 'about')
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    /**
     * Bind global event listeners
     */
    bindGlobalEvents() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled promise rejection:', event.reason);
            if (this.config.debug) {
                alert(`Error: ${event.reason.message || event.reason}`);
            }
        });

        // Handle global errors
        window.addEventListener('error', (event) => {
            console.error('🚨 Global error:', event.error);
            if (this.config.debug) {
                alert(`Error: ${event.message}`);
            }
        });

    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        if (this.config.rudeMode && typeof console !== 'undefined' && console.log) {
            console.log(`
╔══════════════════════════════════════════════╗
║              WELCOME TO TWATAIR              ║
║                                              ║
║   Fly cheaper than O'Leary's dignity! 🚀     ║
║                                              ║
║   Warning: Our website contains strong       ║
║   language and satirical content. If you're  ║
║   offended, try Ryanair - they'll charge     ║
║   you for the privilege.                     ║
╚══════════════════════════════════════════════╝
            `);
        }
    }

    /**
     * Show error message when initialization fails
     */
    showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #FF0000;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
            z-index: 9999;
        `;
        errorDiv.innerHTML = `
            <h2>💥 TWATAIR CRASHED!</h2>
            <p>Something went wrong loading our website.</p>
            <p>Try refreshing the page, you cheap bastard.</p>
            <button onclick="location.reload()" style="
                background: #FFCC00;
                color: #003087;
                border: none;
                padding: 10px 20px;
                margin-top: 10px;
                cursor: pointer;
                font-weight: bold;
            ">RETRY</button>
        `;
        document.body.appendChild(errorDiv);
    }

    /**
     * Get module by name
     * @param {string} name - Module name
     * @returns {*} Module instance or null
     */
    getModule(name) {
        return this.modules.get(name) || null;
    }

    /**
     * Get app configuration
     * @returns {object} App config
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Update app configuration
     * @param {object} newConfig - New config options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Create and initialize the app
const app = new TwatAirApp();

// Prevent browser from restoring scroll position - causes "jumping"
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Reset scroll position on page load
window.scrollTo(0, 0);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init().catch(error => {
            console.error('Failed to initialize TwatAir app:', error);
        });
    });
} else {
    app.init().catch(error => {
        console.error('Failed to initialize TwatAir app:', error);
    });
}

// Export for debugging/console access
window.TwatAir = app;
window.toast = toast;
