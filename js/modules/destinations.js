/**
 * TwatAir Destinations Module
 * Displays satirical destination cards with Ryanair-style remote airports
 */

import { dom, format, random } from './utils.js';

export class Destinations {
    constructor() {
        this.destinations = [
            {
                code: 'DUB',
                name: 'Dublin',
                airport: 'Dublin Airport (DUB)',
                description: 'The only airport in Ireland that doesn\'t smell like potatoes.',
                price: random.between(15, 35),
                satire: 'Ryanair\'s home base. Michael O\'Leary personally inspects every delay.',
                image: '🏰',
                insults: ['O\'Leary\'s throne room', 'Guinness capital of the world', 'Where dreams go to die']
            },
            {
                code: 'LON',
                name: 'London',
                airport: 'Stansted Airport (STN) - At 4AM',
                description: 'The airport that makes you question your life choices.',
                price: random.between(20, 45),
                satire: 'Stansted at 4AM: Where dreams go to die and luggage gets lost forever.',
                image: '🌆',
                insults: ['Stansted at stupid o\'clock', 'London\'s bastard child', 'Gateway to Brexit']
            },
            {
                code: 'PAR',
                name: 'Paris',
                airport: 'Charles de Gaulle (CDG) - Because fuck Orly',
                description: 'The city of love. Our flights arrive with hate.',
                price: random.between(25, 55),
                satire: 'Charles de Gaulle: So big, you\'ll need a taxi just to find your gate.',
                image: '🗼',
                insults: ['French surrender monument', 'Eiffel Tower visible from runway', 'Snail-paced security']
            },
            {
                code: 'AMS',
                name: 'Amsterdam',
                airport: 'Schiphol (AMS) - Not the red light district',
                description: 'Tulips, canals, and flights that might actually depart on time.',
                price: random.between(30, 60),
                satire: 'Schiphol: The only airport bigger than Michael O\'Leary\'s ego.',
                image: '🌷',
                insults: ['Bicycle parking lot', 'Legal weed airport', 'Dutch surrender coordinates']
            },
            {
                code: 'BCN',
                name: 'Barcelona',
                airport: 'El Prat (BCN) - Ryanair\'s Spanish vacation home',
                description: 'Gaudi architecture and flights delayed by siesta.',
                price: random.between(35, 65),
                satire: 'El Prat: Where Ryanair parks its planes and dreams of being an airline.',
                image: '🏖️',
                insults: ['Sagrada Familia from afar', 'Paella-scented terminals', 'Catalan independence hub']
            },
            {
                code: 'BER',
                name: 'Berlin',
                airport: 'Brandenburg (BER) - Built by communists',
                description: 'History, culture, and airports designed by bureaucracy.',
                price: random.between(40, 70),
                satire: 'BER: Took longer to build than the Berlin Wall. Still not finished.',
                image: '🏛️',
                insults: ['Communist architecture', 'Wall reunion point', 'Cheap beer destination']
            },
            {
                code: 'MAD',
                name: 'Madrid',
                airport: 'Barajas (MAD) - Not as mad as our prices',
                description: 'The heart of Spain. Our flights arrive at the outskirts.',
                price: random.between(35, 65),
                satire: 'Barajas: Four terminals, three of which are Ryanair-exclusive purgatory.',
                image: '🏟️',
                insults: ['Real Madrid flights', 'Tapas-scented baggage claim', 'Spanish Inquisition revival']
            },
            {
                code: 'FCO',
                name: 'Rome',
                airport: 'Fiumicino (FCO) - Ancient ruins included',
                description: 'Eternal city. Our flights make you feel eternal too (waiting).',
                price: random.between(45, 75),
                satire: 'FCO: Ancient ruins in terminal 3. Colosseum visible from economy.',
                image: '🏛️',
                insults: ['Vatican smoke signals', 'Pizza delivery hub', 'Roman emperor parking']
            }
        ];
    }

    /**
     * Initialize destinations display
     */
    async init() {
        await this.createDestinationsGrid();
        this.bindEvents();
    }

    /**
     * Create destinations grid HTML
     */
    async createDestinationsGrid() {
        const container = dom.get('#destinations-grid');
        if (!container) return;

        const grid = dom.create('div', { className: 'destinations-grid' });

        this.destinations.forEach(destination => {
            const card = this.createDestinationCard(destination);
            grid.appendChild(card);
        });

        container.appendChild(grid);

        this.grid = grid;
    }

    /**
     * Create destination card
     * @param {object} dest - Destination data
     * @returns {Element} Destination card element
     */
    createDestinationCard(dest) {
        const card = dom.create('div', { className: 'destination-card card' });

        const header = dom.create('div', {
            className: 'card-header',
            textContent: `${dest.image} ${dest.name} (${dest.code})`
        });

        const content = dom.create('div', { className: 'card-content' });

        const airport = dom.create('div', {
            className: 'airport-name',
            textContent: dest.airport
        });

        const description = dom.create('p', {
            className: 'destination-description',
            textContent: dest.description
        });

        const satire = dom.create('p', {
            className: 'destination-satire warning',
            textContent: dest.satire
        });

        const price = dom.create('div', {
            className: 'destination-price',
            innerHTML: `
                <span class="price-label">FROM</span>
                <span class="price-amount">${format.currency(dest.price)}</span>
                <span class="price-note">+ fees & dignity</span>
            `
        });

        const insults = dom.create('div', {
            className: 'destination-insults',
            innerHTML: dest.insults.map(insult =>
                `<span class="insult-tag">${insult}</span>`
            ).join('')
        });

        const bookBtn = dom.create('a', {
            href: `book.html?from=DUB&to=${dest.code}`,
            className: 'btn',
            textContent: 'BOOK THIS SHITSHOW'
        });

        // Assemble content
        content.appendChild(airport);
        content.appendChild(description);
        content.appendChild(satire);
        content.appendChild(price);
        content.appendChild(insults);
        content.appendChild(bookBtn);

        card.appendChild(header);
        card.appendChild(content);

        return card;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Hover effects
        dom.on(this.grid, 'mouseenter', (e) => {
            if (e.target.closest('.destination-card')) {
                this.onCardHover(e.target.closest('.destination-card'), true);
            }
        }, true);

        dom.on(this.grid, 'mouseleave', (e) => {
            if (e.target.closest('.destination-card')) {
                this.onCardHover(e.target.closest('.destination-card'), false);
            }
        }, true);

        // Click effects
        dom.on(this.grid, 'click', (e) => {
            if (e.target.closest('.destination-card')) {
                this.onCardClick(e.target.closest('.destination-card'));
            }
        });
    }

    /**
     * Handle card hover
     * @param {Element} card - Destination card element
     * @param {boolean} isHovering - Whether mouse is hovering
     */
    onCardHover(card, isHovering) {
        if (isHovering) {
            // Random insult on hover
            const insults = card.querySelectorAll('.insult-tag');
            if (insults.length > 0) {
                const randomInsult = insults[Math.floor(Math.random() * insults.length)];
                randomInsult.style.backgroundColor = '#FF0000';
                randomInsult.style.color = '#FFF';
            }
        } else {
            // Reset insult colors
            const insults = card.querySelectorAll('.insult-tag');
            insults.forEach(insult => {
                insult.style.backgroundColor = '';
                insult.style.color = '';
            });
        }
    }

    /**
     * Handle card click
     * @param {Element} card - Destination card element
     */
    onCardClick(card) {
        // Add click animation
        card.style.transform = 'scale(0.95)';

        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Show random destination fact
        const destination = this.getDestinationFromCard(card);
        if (destination) {
            this.showDestinationFact(destination);
        }
    }

    /**
     * Get destination data from card element
     * @param {Element} card - Destination card element
     * @returns {object|null} Destination data or null
     */
    getDestinationFromCard(card) {
        const header = card.querySelector('.card-header');
        if (!header) return null;

        const code = header.textContent.match(/\(([A-Z]{3})\)/)?.[1];
        if (!code) return null;

        return this.destinations.find(dest => dest.code === code) || null;
    }

    /**
     * Show random fact about destination
     * @param {object} destination - Destination data
     */
    showDestinationFact(destination) {
        const facts = [
            `${destination.name} has the worst Ryanair customer service in Europe.`,
            `Michael O'Leary once got stuck in ${destination.name} for 3 days.`,
            `${destination.airport} was designed by someone who hates travelers.`,
            `The food in ${destination.name} is better than our in-flight snacks.`,
            `Elon Musk has never been to ${destination.name}. Yet.`,
            `${destination.name} has more history than our refund policy.`,
            `Ryanair saves money by not landing in ${destination.name} properly.`,
            `${destination.name} is closer than you think. Our flight takes longer though.`
        ];

        alert(random.pick(facts));
    }

    /**
     * Get all destinations
     * @returns {Array} Array of destination objects
     */
    getDestinations() {
        return [...this.destinations];
    }

    /**
     * Get destination by code
     * @param {string} code - Destination code
     * @returns {object|null} Destination data or null
     */
    getDestination(code) {
        return this.destinations.find(dest => dest.code === code) || null;
    }

    /**
     * Add new destination (for dynamic content)
     * @param {object} destination - New destination data
     */
    addDestination(destination) {
        this.destinations.push(destination);

        // Re-render grid if it exists
        if (this.grid) {
            const card = this.createDestinationCard(destination);
            this.grid.appendChild(card);
        }
    }

    /**
     * Update destination prices randomly
     */
    updatePrices() {
        this.destinations.forEach(dest => {
            // Random price fluctuation
            const change = (Math.random() - 0.5) * 10; // +/- €5
            dest.price = Math.max(5, dest.price + change);

            // Update display if card exists
            const cards = this.grid?.querySelectorAll('.destination-card') || [];
            cards.forEach(card => {
                const destData = this.getDestinationFromCard(card);
                if (destData && destData.code === dest.code) {
                    const priceAmount = card.querySelector('.price-amount');
                    if (priceAmount) {
                        priceAmount.textContent = format.currency(dest.price);
                    }
                }
            });
        });
    }
}

// Export singleton instance
export const destinations = new Destinations();