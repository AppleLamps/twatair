/**
 * TwatAir Coin Module
 * Displays $TWATAIR meme coin information, fake chart, and wallet integration
 */

import { dom, format, random } from './utils.js';
import { cryptoTicker } from './cryptoTicker.js';
import { TOKEN_CONFIG, fetchTokenData, subscribeToTokenUpdates } from './tokenApi.js';
import { toast } from './toast.js';

export class Coin {
    constructor() {
        this.cryptoTicker = cryptoTicker;
        this.priceHistory = this.generatePriceHistory();
        
        // $TWATAIR token information from centralized config
        this.tokenAddress = TOKEN_CONFIG.address;
        this.bagsUrl = TOKEN_CONFIG.bagsUrl;
        
        // API data
        this.tokenData = null;
        this.unsubscribe = null;
    }

    /**
     * Initialize coin page
     */
    async init() {
        await this.createCoinContent();
        this.bindEvents();
        
        // Subscribe to token API updates (primary data source)
        this.unsubscribe = subscribeToTokenUpdates((data) => {
            this.tokenData = data;
            this.updateFromApi(data);
        }, 30000);
        
        // Only use crypto ticker for the ticker bar, not for main price display
        this.cryptoTicker.startUpdates();
    }
    
    /**
     * Update display from API data
     * @param {Object} data - Token data from API
     */
    updateFromApi(data) {
        if (!data || !data.token) return;
        
        const token = data.token;
        
        // Update price display
        const priceValue = dom.get('#priceValue');
        const priceChange = dom.get('#priceChange');
        
        if (priceValue) {
            if (token.price && token.price > 0) {
                priceValue.textContent = format.currency(token.price, '$');
            } else if (token.priceInSol && token.priceInSol > 0) {
                // Show SOL price if USD not available
                priceValue.textContent = `${token.priceInSol.toFixed(10)} SOL`;
            }
        }
        
        if (priceChange && typeof token.priceChange24h === 'number') {
            const change = token.priceChange24h;
            priceChange.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
            priceChange.className = 'price-change';
            priceChange.classList.add(change >= 0 ? 'positive' : 'negative');
        }
        
        // Update stats
        const marketCap = dom.get('#marketCap');
        if (marketCap && token.marketCap) {
            marketCap.textContent = format.currency(token.marketCap, '$');
        }
        
        const volume = dom.get('#volume');
        if (volume && token.volume24h) {
            volume.textContent = format.currency(token.volume24h, '$');
        }
        
        const circulating = dom.get('#circulating');
        if (circulating && token.circulatingSupply) {
            circulating.textContent = token.circulatingSupply.toLocaleString();
        }
        
        // Update total supply if available
        const totalSupply = dom.get('#totalSupply');
        if (totalSupply && token.totalSupply) {
            totalSupply.textContent = token.totalSupply.toLocaleString();
        }
        
        // Show API status indicator
        const apiStatus = dom.get('#apiStatus');
        if (apiStatus) {
            apiStatus.textContent = data.mock ? 'DEMO MODE' : 'LIVE';
            apiStatus.className = `api-status ${data.mock ? 'demo' : 'live'}`;
        }
        
        // Store current price for crypto ticker sync
        if (token.price && token.price > 0) {
            this.cryptoTicker.setTwatAirPrice(token.price, token.priceChange24h || 0);
        }
    }

    /**
     * Create coin page HTML structure
     */
    async createCoinContent() {
        const container = dom.get('#crypto-content');
        if (!container) return;

        const coinContent = dom.create('div', { className: 'coin-content' });

        // Hero section
        const hero = dom.create('div', { className: 'coin-hero' });
        hero.innerHTML = `
            <div class="coin-header">
                <div class="coin-logo">🪙</div>
                <h2>$TWATAIR COIN</h2>
                <p class="coin-tagline">The meme coin that will buy Ryanair and fire Michael O'Leary</p>
            </div>

            <div class="coin-price-display">
                <div class="current-price" id="currentPrice">
                    <span class="price-label">CURRENT PRICE</span>
                    <span class="price-value" id="priceValue">$0.0000420</span>
                    <span class="price-change" id="priceChange">+5.2%</span>
                </div>
            </div>

            <div class="coin-actions">
                <a href="${this.bagsUrl}" target="_blank" rel="noopener" class="btn btn-success" id="buyCoinBtn">
                    BUY $TWATAIR ON BAGS.FM
                </a>
            </div>
            
            <div class="token-address">
                <span class="address-label">CONTRACT:</span>
                <code class="address-value" id="tokenAddress">${this.tokenAddress}</code>
                <button class="copy-btn" id="copyAddressBtn" title="Copy address">COPY</button>
            </div>
        `;

        // Chart section
        const chart = dom.create('div', { className: 'coin-chart card' });
        chart.innerHTML = `
            <div class="chart-header">
                <h3>PRICE CHART (LAST 24H)</h3>
                <div class="chart-controls">
                    <button class="chart-btn active" data-period="24h">24H</button>
                    <button class="chart-btn" data-period="7d">7D</button>
                    <button class="chart-btn" data-period="30d">30D</button>
                </div>
            </div>
            <div class="chart-canvas" id="priceChart">
                ${this.renderPriceChart()}
            </div>
        `;

        // Stats section
        const stats = dom.create('div', { className: 'coin-stats' });
        stats.innerHTML = `
            <h3>TOKENOMICS</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">MARKET CAP</div>
                    <div class="stat-value" id="marketCap">$420,690</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">24H VOLUME</div>
                    <div class="stat-value" id="volume">$69,420</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">TOTAL SUPPLY</div>
                    <div class="stat-value">1,000,000,000</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">CIRCULATING</div>
                    <div class="stat-value" id="circulating">690,000,000</div>
                </div>
            </div>
        `;

        // About section
        const about = dom.create('div', { className: 'coin-about card' });
        about.innerHTML = `
            <h3>ABOUT $TWATAIR</h3>
            <div class="coin-description">
                <p><strong>$TWATAIR</strong> is the revolutionary meme coin that will acquire Ryanair
                and finally fire that insufferable twat Michael O'Leary. Inspired by Elon Musk's legendary
                roasts and our shared hatred of hidden fees, $TWATAIR combines the best of dog coins
                and aviation chaos.</p>

                <p><strong>Our mission:</strong> Pump the coin to the moon, buy Ryanair, install Elon
                as CEO, and make flying affordable again. Or at least more entertaining.</p>

                <div class="coin-features">
                    <div class="feature">
                        <div class="feature-icon">🚀</div>
                        <div class="feature-text">
                            <strong>To The Moon</strong><br>
                            Elon-approved price target: $420
                        </div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔥</div>
                        <div class="feature-text">
                            <strong>Burn Mechanism</strong><br>
                            1% of every transaction burns supply
                        </div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🛫</div>
                        <div class="feature-text">
                            <strong>Flight Discounts</strong><br>
                            50% off tickets when paid with $TWATAIR
                        </div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">👑</div>
                        <div class="feature-text">
                            <strong>Community Driven</strong><br>
                            Elon Musk is our biggest holder
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Roadmap section
        const roadmap = dom.create('div', { className: 'coin-roadmap card' });
        roadmap.innerHTML = `
            <h3>ROADMAP TO DOMINATION</h3>
            <div class="roadmap-timeline">
                <div class="roadmap-item completed">
                    <div class="roadmap-phase">Phase 1: Launch</div>
                    <div class="roadmap-desc">Coin deployed, community growing, Elon tweets about us</div>
                </div>
                <div class="roadmap-item active">
                    <div class="roadmap-phase">Phase 2: Hype</div>
                    <div class="roadmap-desc">Massive marketing campaign, celebrity endorsements, price pump</div>
                </div>
                <div class="roadmap-item">
                    <div class="roadmap-phase">Phase 3: Acquisition</div>
                    <div class="roadmap-desc">Buy Ryanair shares, gain board seats, prepare for hostile takeover</div>
                </div>
                <div class="roadmap-item">
                    <div class="roadmap-phase">Phase 4: Revolution</div>
                    <div class="roadmap-desc">Fire Michael O'Leary, install Elon as CEO, free flights for all</div>
                </div>
                <div class="roadmap-item">
                    <div class="roadmap-phase">Phase 5: Moon Mission</div>
                    <div class="roadmap-desc">SpaceX partnership, flights to Mars, become first interplanetary airline</div>
                </div>
            </div>
        `;

        // Community section
        const community = dom.create('div', { className: 'coin-community card' });
        community.innerHTML = `
            <h3>JOIN THE REVOLUTION</h3>
            <div class="community-links">
                <a href="${this.bagsUrl}" target="_blank" rel="noopener" class="community-link community-link-primary">
                    <span class="community-icon">BAGS</span>
                    <span>Trade on Bags.fm</span>
                </a>
                <a href="#" class="community-link">
                    <span class="community-icon">X</span>
                    <span>Twitter: @TwatAirCoin</span>
                </a>
                <a href="#" class="community-link">
                    <span class="community-icon">DC</span>
                    <span>Discord: TwatAir Official</span>
                </a>
                <a href="#" class="community-link">
                    <span class="community-icon">TG</span>
                    <span>Telegram: TwatAir TG</span>
                </a>
            </div>

            <div class="community-stats">
                <div class="community-stat">
                    <span class="stat-number">420K</span>
                    <span class="stat-label">Twitter Followers</span>
                </div>
                <div class="community-stat">
                    <span class="stat-number">69K</span>
                    <span class="stat-label">Discord Members</span>
                </div>
                <div class="community-stat">
                    <span class="stat-number">1M+</span>
                    <span class="stat-label">Total Holders</span>
                </div>
            </div>
        `;

        // Disclaimer
        const disclaimer = dom.create('div', { className: 'coin-disclaimer alert' });
        disclaimer.innerHTML = `
            <strong>🚨 CRYPTO DISCLAIMER:</strong> $TWATAIR is a meme coin. It's probably going to zero.
            Elon Musk might sue us. Michael O'Leary definitely will. Invest at your own risk.
            This is not financial advice. We're just trying to buy an airline and fire a twat.
        `;

        // Assemble content
        coinContent.appendChild(hero);
        coinContent.appendChild(chart);
        coinContent.appendChild(stats);
        coinContent.appendChild(about);
        coinContent.appendChild(roadmap);
        coinContent.appendChild(community);
        coinContent.appendChild(disclaimer);

        container.appendChild(coinContent);

        this.coinContent = coinContent;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Copy address button
        const copyBtn = dom.get('#copyAddressBtn');
        if (copyBtn) {
            dom.on(copyBtn, 'click', () => this.copyTokenAddress());
        }

        // Chart period buttons
        dom.on(this.coinContent, 'click', (e) => {
            if (e.target.classList.contains('chart-btn')) {
                this.changeChartPeriod(e.target.dataset.period);
            }
        });

        // Feature hovers
        dom.on(this.coinContent, 'mouseenter', (e) => {
            if (e.target.closest('.feature')) {
                this.onFeatureHover(e.target.closest('.feature'), true);
            }
        });

        dom.on(this.coinContent, 'mouseleave', (e) => {
            if (e.target.closest('.feature')) {
                this.onFeatureHover(e.target.closest('.feature'), false);
            }
        });
    }

    /**
     * Generate fake price history
     * @returns {Array} Price history data points
     */
    generatePriceHistory() {
        const history = [];
        let price = 0.000001; // Starting price

        for (let i = 0; i < 24; i++) {
            // Random price movement
            const change = (Math.random() - 0.5) * 0.00001;
            price = Math.max(0.0000001, price + change);
            history.push({
                time: `${i}:00`,
                price: price,
                volume: random.between(1000, 10000)
            });
        }

        return history;
    }

    /**
     * Render ASCII price chart
     * @returns {string} HTML string for chart
     */
    renderPriceChart() {
        // Simple ASCII-style chart
        const maxPrice = Math.max(...this.priceHistory.map(h => h.price));
        const minPrice = Math.min(...this.priceHistory.map(h => h.price));
        const range = maxPrice - minPrice;

        let chart = '<div class="ascii-chart">';

        // Price bars
        this.priceHistory.forEach((point, index) => {
            const height = range > 0 ? ((point.price - minPrice) / range) * 100 : 50;
            const barHeight = Math.max(10, Math.min(100, height));

            chart += `
                <div class="chart-bar" style="height: ${barHeight}%">
                    <div class="bar-value">$${point.price.toFixed(7)}</div>
                </div>
            `;
        });

        chart += '</div>';

        // Time labels
        chart += '<div class="chart-labels">';
        for (let i = 0; i < this.priceHistory.length; i += 4) {
            chart += `<span>${this.priceHistory[i].time}</span>`;
        }
        chart += '</div>';

        return chart;
    }

    /**
     * Start price updates
     */
    startPriceUpdates() {
        // Update price every 5 seconds
        setInterval(() => {
            this.updatePriceDisplay();
        }, 5000);
    }

    /**
     * Update price display with animation
     */
    updatePriceDisplay() {
        const currentPrice = this.cryptoTicker.getTwatAirPrice();
        const priceValue = dom.get('#priceValue');
        const priceChange = dom.get('#priceChange');

        if (priceValue && currentPrice) {
            // Animate price change
            const oldPrice = parseFloat(priceValue.textContent.replace('$', ''));
            const changePercent = ((currentPrice - oldPrice) / oldPrice) * 100;

            priceValue.textContent = format.currency(currentPrice, '$');
            priceChange.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;

            // Color based on change
            priceChange.className = 'price-change';
            if (changePercent > 0) {
                priceChange.classList.add('positive');
            } else if (changePercent < 0) {
                priceChange.classList.add('negative');
            }

            // Update market cap and volume
            this.updateStats(currentPrice);
        }
    }

    /**
     * Update statistics
     * @param {number} price - Current price
     */
    updateStats(price) {
        const marketCap = dom.get('#marketCap');
        const volume = dom.get('#volume');
        const circulating = dom.get('#circulating');

        if (marketCap) {
            const mc = price * 1000000000; // 1 billion supply
            marketCap.textContent = format.currency(mc, '$');
        }

        if (volume) {
            const vol = random.between(50000, 200000);
            volume.textContent = format.currency(vol, '$');
        }

        if (circulating) {
            const circ = random.between(680000000, 720000000);
            circulating.textContent = circ.toLocaleString();
        }
    }

    /**
     * Copy token address to clipboard
     */
    copyTokenAddress() {
        navigator.clipboard.writeText(this.tokenAddress).then(() => {
            const copyBtn = dom.get('#copyAddressBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'COPIED!';
            copyBtn.classList.add('copied');

            toast.success('Token address copied to clipboard!');

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            toast.info(`Token Address: ${this.tokenAddress}`, {
                title: 'Copy Failed',
                duration: 8000
            });
        });
    }

    /**
     * Change chart period
     * @param {string} period - Chart period (24h, 7d, 30d)
     */
    changeChartPeriod(period) {
        // Update active button
        const buttons = this.coinContent.querySelectorAll('.chart-btn');
        buttons.forEach(btn => btn.classList.remove('active'));

        const activeBtn = this.coinContent.querySelector(`[data-period="${period}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // In a real app, this would fetch different data
        toast.info(`${period} chart data loaded! (Actually just the same fake data)`, {
            title: 'Chart Updated'
        });
    }

    /**
     * Handle feature hover
     * @param {Element} feature - Feature element
     * @param {boolean} isHovering - Whether mouse is hovering
     */
    onFeatureHover(feature, isHovering) {
        if (isHovering) {
            feature.style.transform = 'translateY(-5px)';
            feature.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        } else {
            feature.style.transform = '';
            feature.style.boxShadow = '';
        }
    }

    /**
     * Get current TWATAIR price
     * @returns {number} Current price
     */
    getCurrentPrice() {
        return this.cryptoTicker.getTwatAirPrice();
    }

    /**
     * Simulate price pump
     */
    pumpPrice() {
        // Trigger pump animation
        const priceValue = dom.get('#priceValue');
        if (priceValue) {
            format.pumpPrice(priceValue);
        }

        // Update stats immediately
        this.updatePriceDisplay();
    }
}

// Export singleton instance
export const coin = new Coin();
