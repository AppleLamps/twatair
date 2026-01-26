/**
 * TwatAir Crypto Ticker Module
 * Displays live $TWATAIR coin prices and market data
 */

import { dom, format, random } from './utils.js';

// Constants
const UPDATE_INTERVAL_MS = 3000;
const PUMP_CHANCE_THRESHOLD = 0.1;
const DUMP_CHANCE_THRESHOLD = 0.3;

export class CryptoTicker {
    constructor() {
        this.tickerData = [
            { symbol: '$TWATAIR', price: 0.0000420, change: 0 },
            { symbol: '$RYANAIR', price: 0.0000001, change: 0 },
            { symbol: '$OLEARY', price: 0.0000001, change: 0 }, // Small non-zero to avoid division issues
            { symbol: '$ELON', price: 420.69, change: 0 },
            { symbol: '$DOGE', price: 0.420, change: 0 }
        ];

        this.updateInterval = null;
        this.isRunning = false;
        this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
    }

    /**
     * Initialize crypto ticker
     */
    init() {
        this.createTicker();
        this.startUpdates();
    }

    /**
     * Create ticker HTML structure
     */
    createTicker() {
        const tickerContainer = dom.get('#crypto-ticker');
        if (!tickerContainer) {
            console.warn('Crypto ticker container not found');
            return;
        }

        const ticker = dom.create('div', { className: 'crypto-ticker' });
        const content = dom.create('div', { className: 'ticker-content' });

        // Initial ticker items
        this.updateTickerContent(content);

        ticker.appendChild(content);
        tickerContainer.appendChild(ticker);

        this.ticker = ticker;
        this.content = content;
    }

    /**
     * Update ticker content with current data
     * @param {Element} content - Ticker content element
     */
    updateTickerContent(content) {
        content.innerHTML = '';

        this.tickerData.forEach(coin => {
            const item = dom.create('div', { className: 'ticker-item' });

            // Determine if positive/negative change
            const changeClass = coin.change > 0 ? 'positive' :
                              coin.change < 0 ? 'negative' : '';

            item.className += changeClass ? ` ${changeClass}` : '';

            // Format price and change
            const priceFormatted = coin.symbol === '$TWATAIR' ?
                format.currency(coin.price, '$') :
                `$${coin.price.toFixed(coin.price < 1 ? 6 : 2)}`;

            const changeFormatted = coin.change > 0 ? `+${coin.change.toFixed(2)}%` :
                                  coin.change < 0 ? `${coin.change.toFixed(2)}%` :
                                  '0.00%';

            item.innerHTML = `
                <span class="symbol">${coin.symbol}</span>
                <span class="price">${priceFormatted}</span>
                <span class="change">(${changeFormatted})</span>
            `;

            content.appendChild(item);
        });
    }

    /**
     * Start price updates
     */
    startUpdates() {
        if (this.isRunning) return;

        this.isRunning = true;

        // Initial update
        this.updatePrices();

        // Update at configured interval
        this.updateInterval = setInterval(() => {
            this.updatePrices();
        }, UPDATE_INTERVAL_MS);

        // Add visibility change listener to pause when tab is hidden
        document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    }

    /**
     * Handle page visibility change to save resources
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopUpdates();
        } else {
            this.startUpdates();
        }
    }

    /**
     * Stop price updates
     */
    stopUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isRunning = false;
    }

    /**
     * Update all coin prices with random fluctuations
     */
    updatePrices() {
        this.tickerData.forEach(coin => {
            const oldPrice = coin.price;
            let newPrice;
            let changePercent;

            // Special handling for different coins
            switch (coin.symbol) {
                case '$TWATAIR':
                    // If we have real data from API, don't override with random
                    if (coin.isReal) {
                        return; // Keep the real price
                    }
                    // Volatile meme coin - big pumps and dumps
                    const pumpChance = Math.random();
                    if (pumpChance < PUMP_CHANCE_THRESHOLD) {
                        // 10% chance of massive pump
                        newPrice = oldPrice * (1 + random.between(50, 200) / 100);
                        changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
                        this.triggerPumpAnimation();
                    } else if (pumpChance < DUMP_CHANCE_THRESHOLD) {
                        // 20% chance of dump
                        newPrice = oldPrice * (1 - random.between(10, 50) / 100);
                        changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
                    } else {
                        // Normal fluctuation
                        newPrice = random.cryptoFluctuate(oldPrice, 0.05);
                        changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
                    }
                    break;

                case '$RYANAIR':
                    // Always going down
                    newPrice = Math.max(0.0000001, oldPrice * (1 - random.between(1, 5) / 100));
                    changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
                    break;

                case '$OLEARY':
                    // Nearly worthless but non-zero to avoid division issues
                    newPrice = 0.0000001;
                    changePercent = -99.99;
                    break;

                case '$ELON':
                    // Stable but volatile
                    newPrice = random.cryptoFluctuate(oldPrice, 0.02);
                    changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
                    break;

                case '$DOGE':
                    // Follows Elon
                    const elonCoin = this.tickerData.find(c => c.symbol === '$ELON');
                    const elonChange = elonCoin ? elonCoin.change : 0;
                    newPrice = oldPrice * (1 + elonChange / 100);
                    changePercent = elonChange;
                    break;

                default:
                    newPrice = random.cryptoFluctuate(oldPrice, 0.01);
                    changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
            }

            coin.price = Math.max(0, newPrice);
            coin.change = changePercent;
        });

        // Update display
        if (this.content) {
            this.updateTickerContent(this.content);
        }
    }

    /**
     * Trigger pump animation for TWATAIR
     */
    triggerPumpAnimation() {
        // Find TWATAIR in ticker
        const twatAirItems = document.querySelectorAll('.ticker-item');
        twatAirItems.forEach(item => {
            if (item.textContent.includes('$TWATAIR')) {
                format.pumpPrice(item);
            }
        });

        // Also trigger on any visible TWATAIR prices
        const twatAirPrices = document.querySelectorAll('.price');
        twatAirPrices.forEach(price => {
            if (price.textContent.includes('$TWATAIR') ||
                price.closest('.card')?.textContent.includes('TWATAIR')) {
                format.pumpPrice(price);
            }
        });
    }

    /**
     * Get current TWATAIR price
     * @returns {number} Current price
     */
    getTwatAirPrice() {
        const twatAir = this.tickerData.find(coin => coin.symbol === '$TWATAIR');
        return twatAir ? twatAir.price : 0;
    }
    
    /**
     * Set TWATAIR price from API (real data)
     * @param {number} price - Real price from API
     * @param {number} change - Price change percentage
     */
    setTwatAirPrice(price, change = 0) {
        const twatAir = this.tickerData.find(coin => coin.symbol === '$TWATAIR');
        if (twatAir && price > 0) {
            twatAir.price = price;
            twatAir.change = change;
            twatAir.isReal = true; // Flag to prevent random updates
            
            // Update display
            if (this.content) {
                this.updateTickerContent(this.content);
            }
        }
    }

    /**
     * Get all ticker data
     * @returns {Array} Ticker data array
     */
    getTickerData() {
        return [...this.tickerData];
    }

    /**
     * Manually trigger price update
     */
    forceUpdate() {
        this.updatePrices();
    }

    /**
     * Resume updates (after page visibility change)
     */
    resume() {
        if (!this.isRunning) {
            this.startUpdates();
        }
    }

    /**
     * Destroy ticker and clean up
     */
    destroy() {
        this.stopUpdates();
        document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
        if (this.ticker && this.ticker.parentNode) {
            this.ticker.parentNode.removeChild(this.ticker);
        }
    }
}

// Export singleton instance for shared pricing across the site
export const cryptoTicker = new CryptoTicker();
