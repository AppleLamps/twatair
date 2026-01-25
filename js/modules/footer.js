/**
 * TwatAir Footer Module
 * Creates and manages the site footer with crypto ticker and links
 */

import { dom, format, random } from './utils.js';
import { cryptoTicker } from './cryptoTicker.js';
import { icons } from './icons.js';
import { TOKEN_CONFIG } from './tokenApi.js';

export class Footer {
    constructor() {
        this.cryptoTicker = cryptoTicker;
    }

    /**
     * Initialize footer
     */
    async init() {
        await this.createFooter();
        this.cryptoTicker.init();
    }

    /**
     * Create footer HTML structure
     */
    async createFooter() {
        const footerContainer = dom.get('#footer-container');
        if (!footerContainer) return;

        const footer = dom.create('footer', { className: 'footer' });

        // Crypto ticker (will be populated by CryptoTicker)
        const ticker = dom.create('div', { id: 'crypto-ticker' });
        footer.appendChild(ticker);

        // Main footer content
        const footerContent = dom.create('div', { className: 'footer-content container' });

        // Company info section
        const companySection = dom.create('div', { className: 'footer-section' });
        const companyTitle = dom.create('h3', { textContent: 'TWATAIR' });
        const companyDesc = dom.create('p', {
            textContent: 'The airline that makes Ryanair look like a charity. Fly cheaper than O\'Leary\'s dignity!'
        });
        companySection.appendChild(companyTitle);
        companySection.appendChild(companyDesc);

        // Quick links section
        const linksSection = dom.create('div', { className: 'footer-section' });
        const linksTitle = dom.create('h3', { textContent: 'QUICK LINKS' });
        const linksList = dom.create('ul');

        const links = [
            { href: 'index.html', text: 'Home' },
            { href: 'book.html', text: 'Book Flights' },
            { href: 'destinations.html', text: 'Destinations' },
            { href: 'fees.html', text: 'Fees & Charges' },
            { href: 'coin.html', text: 'TWATAIR Coin' },
            { href: 'about.html', text: 'About Us' },
            { href: 'contact.html', text: 'Contact' }
        ];

        links.forEach(link => {
            const li = dom.create('li');
            const a = dom.create('a', {
                href: link.href,
                textContent: link.text
            });
            li.appendChild(a);
            linksList.appendChild(li);
        });

        linksSection.appendChild(linksTitle);
        linksSection.appendChild(linksList);

        // Social/Contact section
        const contactSection = dom.create('div', { className: 'footer-section' });
        const contactTitle = dom.create('h3', { textContent: 'CONNECT WITH US' });
        const contactList = dom.create('ul');

        const contactLinks = [
            { text: 'Complaints@TwatAir.com', icon: 'email', action: () => this.showComplaintResponse() },
            { text: '1-800-FUCK-RYAN', icon: 'phone', action: () => this.showPhoneResponse() },
            { text: '@TwatAir_Official', icon: 'twitter', href: '#' },
            { text: 'Buy $TWATAIR Coin', icon: 'coinStack', href: TOKEN_CONFIG.bagsUrl, external: true }
        ];

        contactLinks.forEach(item => {
            const li = dom.create('li');
            const link = dom.create('a', { href: item.href || '#' });
            
            // Add external link attributes
            if (item.external) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener');
            }
            
            // Add icon
            const iconSpan = dom.create('span', { className: 'footer-icon' });
            iconSpan.innerHTML = icons[item.icon] || '';
            link.appendChild(iconSpan);
            
            // Add text
            const textNode = document.createTextNode(item.text);
            link.appendChild(textNode);

            if (item.action) {
                dom.on(link, 'click', (e) => {
                    e.preventDefault();
                    item.action();
                });
            }

            li.appendChild(link);
            contactList.appendChild(li);
        });

        contactSection.appendChild(contactTitle);
        contactSection.appendChild(contactList);

        // Assemble footer content
        footerContent.appendChild(companySection);
        footerContent.appendChild(linksSection);
        footerContent.appendChild(contactSection);

        // Footer bottom
        const footerBottom = dom.create('div', { className: 'footer-bottom' });
        const copyright = dom.create('p', {
            innerHTML: `&copy; 2026 TwatAir. All rights reserved. <br>
            <small>Not affiliated with that other airline that rhymes with "Fryan Air".<br>
            Prices may vary. Dignity not included. Elon Musk approved.</small>`
        });
        footerBottom.appendChild(copyright);

        // Assemble complete footer
        footer.appendChild(footerContent);
        footer.appendChild(footerBottom);

        footerContainer.appendChild(footer);

        this.footer = footer;
    }

    /**
     * Show rude complaint response
     */
    showComplaintResponse() {
        const responses = [
            "Your complaint has been forwarded to Michael O'Leary. Good luck getting a response from that twat.",
            "Complaints processed by our AI trained on Ryanair's customer service. Expect similar results.",
            "Thank you for your feedback. We've added it to our 'Things We Don't Give A Fuck About' pile.",
            "Your complaint has been escalated to the 'Special Needs Chimp' department.",
            "We're sorry you're unhappy. Here's a voucher for €5 off your next flight. Just kidding!"
        ];

        alert(random.pick(responses));
    }

    /**
     * Show phone response
     */
    showPhoneResponse() {
        alert("All our operators are currently busy insulting passengers. Please hold... or better yet, hang up and book with someone who gives a shit.");
    }
}

// Export singleton instance
export const footer = new Footer();
