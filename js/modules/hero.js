/**
 * TwatAir Hero Module
 * Creates the main hero section with slogans, CTAs, and booking widget
 */

import { dom, format, random, animate } from './utils.js';
import { icons } from './icons.js';
import { TOKEN_CONFIG } from './tokenApi.js';

export class Hero {
    constructor() {
        this.tokenConfig = TOKEN_CONFIG;
        this.headlines = [
            "FLY CHEAPER THAN O'LEARY'S DIGNITY",
            "THE AIRLINE THAT MAKES RYANAIR LOOK EXPENSIVE",
            "ELON WOULD FLY US – YOU SHOULD TOO",
            "FUCK RYANAIR – FLY TWATAIR",
            "CHEAPER THAN A PROSTITUTE IN AMSTERDAM",
            "WE'LL GET YOU THERE... EVENTUALLY",
            "LOW FARES, HIGH BLOOD PRESSURE",
            "THE ONLY AIRLINE WITH A MEME COIN"
        ];

        this.subheadlines = [
            "Because who needs comfort when you can save €0.01?",
            "Ryanair called – they want their business model back",
            "Elon's favorite airline (he hasn't sued us yet)",
            "Michael O'Leary's worst nightmare",
            "Fly to anywhere. Arrive somewhere else.",
            "More delays than Ryanair, fewer apologies",
            "We'll charge you for breathing next",
            "$TWATAIR: The coin that will buy Ryanair"
        ];

        this.currentHeadlineIndex = 0;
    }

    /**
     * Initialize hero section
     */
    async init() {
        await this.createHero();
        this.startHeadlineRotation();
        this.addScrollAnimations();
    }

    /**
     * Create hero HTML structure
     */
    async createHero() {
        const mainContent = dom.get('#main-content');
        if (!mainContent) {
            console.warn('Main content container not found for hero');
            return;
        }

        const heroSection = dom.create('section', { className: 'hero' });

        // Hero container
        const heroContainer = dom.create('div', { className: 'hero-container container' });

        // Hero content
        const heroContent = dom.create('div', { className: 'hero-content' });

        // Headline
        const headline = dom.create('h1', {
            className: 'hero-headline',
            textContent: this.headlines[0]
        });

        // Subheadline
        const subheadline = dom.create('p', {
            className: 'hero-subheadline',
            textContent: this.subheadlines[0]
        });

        // CTA buttons
        const ctaContainer = dom.create('div', { className: 'hero-ctas' });

        const bookBtn = dom.create('a', {
            href: 'book.html',
            className: 'btn hero-btn-primary',
            textContent: 'BOOK NOW - REGRET LATER'
        });

        const coinBtn = dom.create('a', {
            href: this.tokenConfig.bagsUrl,
            className: 'btn hero-btn-secondary',
            textContent: 'BUY $TWATAIR COIN',
            target: '_blank',
            rel: 'noopener'
        });

        ctaContainer.appendChild(bookBtn);
        ctaContainer.appendChild(coinBtn);

        // Warning banner
        const warningBanner = dom.create('div', { className: 'warning hero-warning' });
        warningBanner.innerHTML = `${icons.warning} <strong>WARNING:</strong> Our flights are so cheap, your dignity will pay the difference!`;

        // Assemble hero content
        heroContent.appendChild(headline);
        heroContent.appendChild(subheadline);
        heroContent.appendChild(ctaContainer);
        heroContent.appendChild(warningBanner);

        // Hero visual/booking widget area
        const heroVisual = dom.create('div', { className: 'hero-visual' });

        // Fake booking preview
        const bookingPreview = dom.create('div', { className: 'booking-preview card' });
        const previewHeader = dom.create('div', {
            className: 'card-header',
            textContent: 'SAMPLE FLIGHT PRICE'
        });

        const flightInfo = dom.create('div', { className: 'flight-info' });
        flightInfo.innerHTML = `
            <div class="route">DUB → LON</div>
            <div class="date">Tomorrow</div>
            <div class="price" id="hero-price">${format.currency(9.99)}</div>
        `;

        const feesList = dom.create('div', { className: 'fees-preview' });
        feesList.innerHTML = `
            <div class="fee-item">
                <span>Base Fare</span>
                <span>${format.currency(9.99)}</span>
            </div>
            <div class="fee-item">
                <span>Breathing Tax</span>
                <span>${format.currency(25.00)}</span>
            </div>
            <div class="fee-item">
                <span>O'Leary Ego Fee</span>
                <span>${format.currency(666.00)}</span>
            </div>
            <div class="fee-item total">
                <span>TOTAL</span>
                <span id="hero-total">${format.currency(700.99)}</span>
            </div>
        `;

        const payWithCoin = dom.create('div', { className: 'pay-with-coin' });
        payWithCoin.innerHTML = `
            <p>Or pay with $TWATAIR coin for 50% off!</p>
            <a href="${this.tokenConfig.bagsUrl}" target="_blank" rel="noopener" class="btn btn-success" id="coin-payment-btn">
                ${icons.rocket} PAY WITH $TWATAIR
            </a>
        `;

        bookingPreview.appendChild(previewHeader);
        bookingPreview.appendChild(flightInfo);
        bookingPreview.appendChild(feesList);
        bookingPreview.appendChild(payWithCoin);

        heroVisual.appendChild(bookingPreview);

        // Assemble hero container
        heroContainer.appendChild(heroContent);
        heroContainer.appendChild(heroVisual);

        heroSection.appendChild(heroContainer);

        // Insert at beginning of main content
        mainContent.insertBefore(heroSection, mainContent.firstChild);

        // Store references
        this.heroSection = heroSection;
        this.headline = headline;
        this.subheadline = subheadline;
        this.heroPrice = dom.get('#hero-price');
        this.heroTotal = dom.get('#hero-total');

        // Bind events
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Random price updates
        setInterval(() => this.updateRandomPrices(), 5000);
    }

    /**
     * Start headline rotation
     */
    startHeadlineRotation() {
        setInterval(() => {
            this.rotateHeadline();
        }, 8000); // Change every 8 seconds
    }

    /**
     * Rotate to next headline
     */
    rotateHeadline() {
        // Fade out current
        this.headline.style.opacity = '0';
        this.subheadline.style.opacity = '0';

        setTimeout(() => {
            // Update to next
            this.currentHeadlineIndex = (this.currentHeadlineIndex + 1) % this.headlines.length;

            this.headline.textContent = this.headlines[this.currentHeadlineIndex];
            this.subheadline.textContent = this.subheadlines[this.currentHeadlineIndex];

            // Fade in new
            this.headline.style.opacity = '1';
            this.subheadline.style.opacity = '1';
        }, 500);
    }

    /**
     * Update random prices for demo effect
     */
    updateRandomPrices() {
        const baseFare = random.between(5, 15);
        const breathingTax = random.between(20, 40);
        const egoFee = random.between(500, 800);

        const total = baseFare + breathingTax + egoFee;

        if (this.heroPrice) {
            this.heroPrice.textContent = format.currency(baseFare);
        }

        if (this.heroTotal) {
            format.explodeFee(this.heroTotal);
            this.heroTotal.textContent = format.currency(total);
        }
    }

    /**
     * Add scroll animations
     */
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate.fadeIn(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe hero elements
        if (this.heroSection) {
            observer.observe(this.heroSection);
        }
    }

    /**
     * Get current headline
     * @returns {string} Current headline text
     */
    getCurrentHeadline() {
        return this.headline.textContent;
    }

    /**
     * Set custom headline
     * @param {string} headline - New headline
     * @param {string} subheadline - New subheadline
     */
    setHeadline(headline, subheadline = '') {
        this.headline.style.opacity = '0';
        this.subheadline.style.opacity = '0';

        setTimeout(() => {
            this.headline.textContent = headline;
            if (subheadline) {
                this.subheadline.textContent = subheadline;
            }
            this.headline.style.opacity = '1';
            this.subheadline.style.opacity = '1';
        }, 500);
    }
}

// Export singleton instance
export const hero = new Hero();