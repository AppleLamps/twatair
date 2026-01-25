/**
 * TwatAir Header Module
 * Creates and manages the site header with logo, navigation, and branding
 */

import { dom, random } from './utils.js';
import { navigation } from './nav.js';
import { icons } from './icons.js';

export class Header {
    constructor() {
        this.slogans = [
            "FLYING CHEAPER THAN O'LEARY'S DIGNITY",
            "THE AIRLINE THAT MAKES RYAN AIR LOOK EXPENSIVE",
            "ELON WOULD FLY US – YOU SHOULD TOO",
            "FUCK RYAN AIR – FLY TWATAIR",
            "CHEAPER THAN A PROSTITUTE IN AMSTERDAM",
            "WE'LL GET YOU THERE... EVENTUALLY",
            "LOW FARES, HIGH BLOOD PRESSURE",
            "THE ONLY AIRLINE WITH A MEME COIN"
        ];
    }

    /**
     * Initialize header
     */
    async init() {
        await this.createHeader();
        navigation.init();
        this.addDynamicSlogan();
    }

    /**
     * Create header HTML structure
     */
    async createHeader() {
        const headerContainer = dom.get('#header-container');
        if (!headerContainer) return;

        const header = dom.create('header', { className: 'header' });

        // Top bar with slogan
        const topBar = dom.create('div', { className: 'top-bar' });
        const slogan = dom.create('div', {
            className: 'slogan',
            textContent: random.pick(this.slogans)
        });
        topBar.appendChild(slogan);

        // Main header content
        const headerMain = dom.create('div', { className: 'header-main container' });

        // Logo section
        const logoSection = dom.create('div', { className: 'logo-section' });
        const logo = dom.create('a', {
            href: 'index.html',
            className: 'logo'
        });

        // Create logo with text and plane icon
        const logoText = dom.create('span', {
            className: 'logo-text',
            textContent: 'TWATAIR'
        });
        const logoIcon = dom.create('span', { className: 'logo-icon' });
        logoIcon.innerHTML = icons.planeTilted;

        logo.appendChild(logoText);
        logo.appendChild(logoIcon);
        logoSection.appendChild(logo);

        // Navigation container
        const navContainer = dom.create('div', { id: 'nav-container' });

        // Assemble header
        headerMain.appendChild(logoSection);
        headerMain.appendChild(navContainer);

        header.appendChild(topBar);
        header.appendChild(headerMain);

        headerContainer.appendChild(header);

        this.header = header;
        this.slogan = slogan;
    }

    /**
     * Add dynamic slogan rotation
     */
    addDynamicSlogan() {
        // Change slogan every 10 seconds
        setInterval(() => {
            // Fade out
            this.slogan.style.opacity = '0';

            setTimeout(() => {
                // Change text and fade in
                this.slogan.textContent = random.pick(this.slogans);
                this.slogan.style.opacity = '1';
            }, 500);
        }, 10000);
    }

    /**
     * Update slogan manually
     * @param {string} newSlogan - New slogan text
     */
    setSlogan(newSlogan) {
        this.slogan.style.opacity = '0';

        setTimeout(() => {
            this.slogan.textContent = newSlogan;
            this.slogan.style.opacity = '1';
        }, 500);
    }

    /**
     * Get current slogan
     * @returns {string} Current slogan text
     */
    getCurrentSlogan() {
        return this.slogan.textContent;
    }
}

// Export singleton instance
export const header = new Header();