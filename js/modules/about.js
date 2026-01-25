/**
 * TwatAir About Module
 * Displays satirical company history and Elon/O'Leary feud timeline
 */

import { dom, random } from './utils.js';

export class About {
    constructor() {
        this.timeline = [
            {
                year: '2023',
                title: 'The Birth of TwatAir',
                description: 'Founded in response to Michael O\'Leary calling Elon Musk a "retarded twat" on Twitter. Our mission: To create an airline that makes Ryanair look expensive while roasting their CEO daily.',
                image: '🚀',
                elon_quote: '"I\'m going to buy Ryanair and fire that twat." - Elon Musk'
            },
            {
                year: '2024',
                title: 'First Flight (Sort Of)',
                description: 'Our inaugural flight was delayed by 3 days due to a "slight disagreement" with air traffic control. We blamed Michael O\'Leary. Passengers got free beer while waiting.',
                image: '✈️',
                elon_quote: '"That special needs chimp has no idea how airplanes fly." - Elon Musk'
            },
            {
                year: '2024',
                title: '$TWATAIR Coin Launch',
                description: 'Introduced our meme coin to fund the acquisition of Ryanair. It\'s gone to the moon faster than our planes. Michael O\'Leary called it "financial idiocy." We called it genius.',
                image: '🪙',
                elon_quote: '"I\'m not a financial advisor, but..." - Elon Musk (before every tweet)'
            },
            {
                year: '2024',
                title: 'The Great Feud Escalates',
                description: 'O\'Leary threatens to sue Elon for defamation. Elon responds by tweeting Ryanair\'s stock price. We launch "Avoid O\'Leary Rant" as a premium service.',
                image: '⚖️',
                elon_quote: '"He\'s a clueless accountant who couldn\'t run a lemonade stand." - Elon Musk'
            },
            {
                year: '2025',
                title: 'Expansion Plans',
                description: 'Opening routes to Mars via SpaceX partnership. Ryanair responds by adding more hidden fees. We respond by adding "Elon Musk Endorsement" fee.',
                image: '🪐',
                elon_quote: '"Ryanair will be mine. That twat is finished." - Elon Musk'
            },
            {
                year: '2025',
                title: 'The Future',
                description: 'Our goal: Acquire Ryanair, fire Michael O\'Leary, and make flying affordable again. Or at least more entertaining. Elon approves this message.',
                image: '🔮',
                elon_quote: '"Innovation distinguishes between a leader and a follower." - Steve Jobs (quoted by Elon)'
            }
        ];

        this.stats = [
            { label: 'Flights Delayed', value: '99.9%', description: 'Better than Ryanair!' },
            { label: 'Customer Complaints', value: '100%', description: 'We listen... sometimes' },
            { label: 'Meme Coin Hype', value: '∞', description: 'To the moon! 🚀' },
            { label: 'O\'Leary Roasts', value: 'Daily', description: 'Elon\'s favorite pastime' },
            { label: 'Hidden Fees', value: 'Countless', description: 'More than Ryanair!' },
            { label: 'Elon Endorsements', value: 'Pending', description: 'He\'ll come around' }
        ];
    }

    /**
     * Initialize about page
     */
    async init() {
        await this.createAboutContent();
        this.bindEvents();
    }

    /**
     * Create about page HTML structure
     */
    async createAboutContent() {
        const container = dom.get('#about-content');
        if (!container) return;

        const aboutContent = dom.create('div', { className: 'about-content' });

        // Hero section
        const hero = dom.create('div', { className: 'about-hero' });
        hero.innerHTML = `
            <h2>WELCOME TO TWATAIR</h2>
            <p class="about-tagline">The airline born from the greatest feud in aviation history</p>
            <div class="about-intro">
                <p>When Michael O'Leary called Elon Musk a "retarded twat" on Twitter, the internet exploded.
                We saw an opportunity. Why not create an airline that roasts Ryanair's CEO daily while
                charging even more ridiculous fees?</p>
                <p><strong>Our mission:</strong> Make Ryanair look affordable, entertain passengers with
                Elon/O'Leary feud updates, and hopefully buy Ryanair with our meme coin before Elon does.</p>
            </div>
        `;

        // Stats section
        const stats = dom.create('div', { className: 'about-stats' });
        stats.innerHTML = `
            <h3>TWATAIR BY THE NUMBERS</h3>
            <div class="stats-grid">
                ${this.stats.map(stat => `
                    <div class="stat-card">
                        <div class="stat-value">${stat.value}</div>
                        <div class="stat-label">${stat.label}</div>
                        <div class="stat-desc">${stat.description}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Timeline section
        const timeline = dom.create('div', { className: 'about-timeline' });
        timeline.innerHTML = `
            <h3>OUR (SHORT) HISTORY</h3>
            <div class="timeline-container">
                ${this.timeline.map((event, index) => `
                    <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                        <div class="timeline-content card">
                            <div class="timeline-year">${event.year}</div>
                            <div class="timeline-image">${event.image}</div>
                            <h4>${event.title}</h4>
                            <p>${event.description}</p>
                            <blockquote class="elon-quote">"${event.elon_quote}"</blockquote>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Mission section
        const mission = dom.create('div', { className: 'about-mission' });
        mission.innerHTML = `
            <h3>OUR MISSION</h3>
            <div class="mission-content">
                <div class="mission-text">
                    <p><strong>Phase 1: Entertain</strong><br>
                    Roast Michael O'Leary daily, make passengers laugh while they wait for delayed flights.</p>

                    <p><strong>Phase 2: Dominate</strong><br>
                    Use $TWATAIR coin to buy Ryanair, fire the twat, and restore sanity to aviation.</p>

                    <p><strong>Phase 3: Innovate</strong><br>
                    Partner with SpaceX for flights to Mars. Because why stop at Earth when you can go interplanetary?</p>
                </div>
                <div class="mission-image">
                    🚀🪙✈️
                </div>
            </div>
        `;

        // Call to action
        const cta = dom.create('div', { className: 'about-cta' });
        cta.innerHTML = `
            <h3>READY TO FLY WITH THE FUTURE?</h3>
            <p>Join the revolution. Book a flight, buy our coin, or just laugh at Michael O'Leary with us.</p>
            <div class="cta-buttons">
                <a href="book.html" class="btn">BOOK A FLIGHT</a>
                <a href="coin.html" class="btn btn-success">BUY $TWATAIR</a>
            </div>
        `;

        // Assemble content
        aboutContent.appendChild(hero);
        aboutContent.appendChild(stats);
        aboutContent.appendChild(timeline);
        aboutContent.appendChild(mission);
        aboutContent.appendChild(cta);

        container.appendChild(aboutContent);

        this.aboutContent = aboutContent;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Timeline item clicks
        dom.on(this.aboutContent, 'click', (e) => {
            if (e.target.closest('.timeline-item')) {
                this.onTimelineClick(e.target.closest('.timeline-item'));
            }
        });

        // Elon quote clicks
        dom.on(this.aboutContent, 'click', (e) => {
            if (e.target.closest('.elon-quote')) {
                this.onQuoteClick(e.target.closest('.elon-quote'));
            }
        });

        // Stat card hovers
        dom.on(this.aboutContent, 'mouseenter', (e) => {
            if (e.target.closest('.stat-card')) {
                this.onStatHover(e.target.closest('.stat-card'), true);
            }
        });

        dom.on(this.aboutContent, 'mouseleave', (e) => {
            if (e.target.closest('.stat-card')) {
                this.onStatHover(e.target.closest('.stat-card'), false);
            }
        });
    }

    /**
     * Handle timeline item click
     * @param {Element} item - Timeline item element
     */
    onTimelineClick(item) {
        const year = item.querySelector('.timeline-year')?.textContent;
        const title = item.querySelector('h4')?.textContent;

        const reactions = [
            `Ah, ${year} - when ${title} changed everything!`,
            `Remember ${year}? ${title} was legendary.`,
            `The ${year} ${title} incident still haunts Michael O'Leary.`,
            `${year}: The year we proved Ryanair could be roasted AND expensive.`,
            `Back in ${year}, ${title} started the revolution.`
        ];

        alert(random.pick(reactions));
    }

    /**
     * Handle Elon quote click
     * @param {Element} quote - Quote element
     */
    onQuoteClick(quote) {
        const reactions = [
            "Elon said it best! 🔥",
            "Michael O'Leary's lawyers are working overtime on this one.",
            "This quote broke the internet. Twice.",
            "Ryanair's PR team is still recovering from this.",
            "Elon vs O'Leary: The feud that launched a thousand memes."
        ];

        alert(random.pick(reactions));
    }

    /**
     * Handle stat card hover
     * @param {Element} card - Stat card element
     * @param {boolean} isHovering - Whether mouse is hovering
     */
    onStatHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }

    /**
     * Get timeline data
     * @returns {Array} Timeline events
     */
    getTimeline() {
        return [...this.timeline];
    }

    /**
     * Get company stats
     * @returns {Array} Company statistics
     */
    getStats() {
        return [...this.stats];
    }

    /**
     * Add timeline event
     * @param {object} event - New timeline event
     */
    addTimelineEvent(event) {
        this.timeline.push(event);

        // Re-render timeline if it exists
        const timelineContainer = this.aboutContent?.querySelector('.timeline-container');
        if (timelineContainer) {
            const newItem = dom.create('div', {
                className: `timeline-item ${this.timeline.length % 2 === 0 ? 'left' : 'right'}`
            });

            newItem.innerHTML = `
                <div class="timeline-content card">
                    <div class="timeline-year">${event.year}</div>
                    <div class="timeline-image">${event.image}</div>
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                    <blockquote class="elon-quote">"${event.elon_quote}"</blockquote>
                </div>
            `;

            timelineContainer.appendChild(newItem);
        }
    }
}

// Export singleton instance
export const about = new About();