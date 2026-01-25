/**
 * TwatAir Fee Calculator Module
 * Interactive calculator showing how fees escalate with extras
 */

import { dom, format, random } from './utils.js';

export class FeeCalculator {
    constructor() {
        this.basePrice = 19.99;
        this.fees = {
            breathing: { name: 'Breathing Tax', amount: 25.00, checked: true },
            existing: { name: 'Existing Customer Fee', amount: 35.00, checked: true },
            olearyEgo: { name: "O'Leary Ego Fee", amount: 666.00, checked: true },
            seatSelection: { name: 'Seat Selection', amount: 45.00, checked: false },
            luggage: { name: 'Carry-on Luggage', amount: 55.00, checked: false },
            food: { name: 'Food & Drink', amount: 15.00, checked: false },
            wifi: { name: 'WiFi Access', amount: 20.00, checked: false },
            insurance: { name: 'Travel Insurance', amount: 30.00, checked: false },
            notDelayed: { name: 'No Delay Guarantee', amount: 75.00, checked: false },
            avoidOLearyRant: { name: "Avoid O'Leary Rant", amount: 100.00, checked: false },
            specialNeedsChimp: { name: 'Special Needs Chimp Fee', amount: 200.00, checked: false },
            elonEndorsement: { name: 'Elon Musk Endorsement', amount: 420.00, checked: false },
            carbonOffset: { name: 'Carbon Offset (for our private jets)', amount: 150.00, checked: false },
            fuelSurcharge: { name: 'Fuel Surcharge (planes run on dreams)', amount: 80.00, checked: false },
            governmentTax: { name: 'Government Tax (we pay it, you pay us)', amount: 60.00, checked: false }
        };

        this.tooltips = {
            breathing: "Because oxygen isn't free, apparently.",
            existing: "You're welcome for remembering you exist.",
            olearyEgo: "Michael O'Leary needs his ego stroked. With your money.",
            seatSelection: "Choose where you sit. We don't care, but you'll pay for the privilege.",
            luggage: "Bring your own bag. We'll charge you for having one.",
            food: "Don't starve to death. We'll charge you for that too.",
            wifi: "Slow internet that costs more than high-speed.",
            insurance: "Against our chronic incompetence.",
            notDelayed: "We'll try not to be late. No promises.",
            avoidOLearyRant: "Michael might call you personally. Avoid that horror.",
            specialNeedsChimp: "Elon's favorite insult. Now a premium service.",
            elonEndorsement: "Elon might tweet about your flight. Or not.",
            carbonOffset: "We fly private jets. You pay for the environment.",
            fuelSurcharge: "Planes run on fairy dust and your tears.",
            governmentTax: "Taxes are for peasants. We collect them for the government."
        };

        this.defaultFees = JSON.parse(JSON.stringify(this.fees));
    }

    /**
     * Initialize fee calculator
     */
    async init() {
        await this.createCalculator();
        this.bindEvents();
        this.updateTotal();
    }

    /**
     * Create calculator HTML structure
     */
    async createCalculator() {
        const container = dom.get('#fee-calculator');
        if (!container) return;

        const calculator = dom.create('div', { className: 'fee-calculator' });

        // Header
        const header = dom.create('div', { className: 'calculator-header' });
        header.innerHTML = `
            <h3>INTERACTIVE FEE CALCULATOR</h3>
            <p>Watch your ticket price skyrocket as you add "optional" extras!</p>
            <div class="warning">
                💡 PRO TIP: The cheapest option is to walk. But you won't.
            </div>
        `;

        // Base price display
        const basePrice = dom.create('div', { className: 'base-price' });
        basePrice.innerHTML = `
            <div class="price-display">
                <span class="label">BASE FARE:</span>
                <span class="amount" id="base-amount">${format.currency(this.basePrice)}</span>
            </div>
        `;

        // Fee toggles
        const feeGrid = dom.create('div', { className: 'fee-grid' });

        Object.entries(this.fees).forEach(([key, fee]) => {
            const feeItem = dom.create('div', { className: 'fee-item' });

            const checkbox = dom.create('input', {
                type: 'checkbox',
                id: `fee-${key}`,
                'data-fee': key,
                checked: fee.checked
            });

            const label = dom.create('label', {
                for: `fee-${key}`,
                innerHTML: `
                    <strong>${fee.name}</strong><br>
                    <span class="fee-amount">${format.currency(fee.amount)}</span>
                `
            });

            // Add tooltip if available
            if (this.tooltips[key]) {
                label.title = this.tooltips[key];
            }

            feeItem.appendChild(checkbox);
            feeItem.appendChild(label);
            feeGrid.appendChild(feeItem);
        });

        // Total display
        const totalDisplay = dom.create('div', { className: 'total-display card' });
        totalDisplay.innerHTML = `
            <div class="total-header">TOTAL COST</div>
            <div class="total-amount" id="total-amount">${format.currency(0)}</div>
            <div class="total-breakdown" id="total-breakdown"></div>
            <div class="total-comparison">
                <small>Ryanair would charge: <span id="ryanair-comparison">${format.currency(0)}</span></small>
            </div>
        `;

        // Action buttons
        const actions = dom.create('div', { className: 'calculator-actions' });

        const resetBtn = dom.create('button', {
            className: 'btn',
            id: 'reset-calculator',
            textContent: 'RESET'
        });

        const coinBtn = dom.create('a', {
            href: 'coin.html',
            className: 'btn btn-success',
            textContent: 'PAY WITH $TWATAIR COIN (50% OFF)'
        });

        const donateBtn = dom.create('button', {
            className: 'btn btn-danger',
            id: 'fire-twatair',
            textContent: 'FIRE THE TWAT (DONATE TO $TWATAIR)'
        });

        actions.appendChild(resetBtn);
        actions.appendChild(coinBtn);
        actions.appendChild(donateBtn);

        // Disclaimer
        const disclaimer = dom.create('div', { className: 'disclaimer alert' });
        disclaimer.innerHTML = `
            <strong>DISCLAIMER:</strong> All fees are mandatory. "Optional" means you'll pay more if you don't choose them.
            Prices may change without notice. Your money goes to making Michael O'Leary even richer.
        `;

        // Assemble calculator
        calculator.appendChild(header);
        calculator.appendChild(basePrice);
        calculator.appendChild(feeGrid);
        calculator.appendChild(totalDisplay);
        calculator.appendChild(actions);
        calculator.appendChild(disclaimer);

        container.appendChild(calculator);

        this.calculator = calculator;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Fee checkboxes
        dom.on(this.calculator, 'change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.fee) {
                this.toggleFee(e.target.dataset.fee, e.target.checked);
                this.updateTotal();
            }
        });

        // Reset button
        const resetBtn = dom.get('#reset-calculator');
        dom.on(resetBtn, 'click', () => this.resetCalculator());

        // Fire the twat button
        const fireBtn = dom.get('#fire-twatair');
        dom.on(fireBtn, 'click', () => this.fireTheTwat());

        // Add hover effects for tooltips
        dom.on(this.calculator, 'mouseover', (e) => {
            if (e.target.closest('.fee-item label')) {
                this.showTooltip(e.target.closest('.fee-item'));
            }
        });

        dom.on(this.calculator, 'mouseout', (e) => {
            if (e.target.closest('.fee-item')) {
                this.hideTooltip();
            }
        });
    }

    /**
     * Toggle a fee on/off
     * @param {string} feeKey - Fee identifier
     * @param {boolean} checked - Whether fee is selected
     */
    toggleFee(feeKey, checked) {
        if (this.fees[feeKey]) {
            this.fees[feeKey].checked = checked;

            // Special handling for certain fees
            if (feeKey === 'elonEndorsement' && checked) {
                setTimeout(() => {
                    alert("🚀 Elon Musk has endorsed your booking! (Not really, but thanks for the extra €420)");
                }, 500);
            }

            if (feeKey === 'specialNeedsChimp' && checked) {
                setTimeout(() => {
                    alert("🐒 Special assistance chimp has been assigned to your flight. Hope you're not afraid of monkeys.");
                }, 500);
            }
        }
    }

    /**
     * Update total calculation
     */
    updateTotal() {
        let total = this.basePrice;
        const breakdown = [];

        // Add selected fees
        Object.entries(this.fees).forEach(([key, fee]) => {
            if (fee.checked) {
                total += fee.amount;
                breakdown.push(`${fee.name}: ${format.currency(fee.amount)}`);
            }
        });

        // Update displays
        const totalAmount = dom.get('#total-amount');
        const totalBreakdown = dom.get('#total-breakdown');
        const ryanairComparison = dom.get('#ryanair-comparison');

        // Animate price change
        const oldTotal = parseFloat(totalAmount.textContent.replace('€', '')) || 0;
        if (total !== oldTotal) {
            totalAmount.style.transform = 'scale(1.1)';
            totalAmount.style.color = total > oldTotal ? '#FF0000' : '#00AA00';

            setTimeout(() => {
                totalAmount.style.transform = 'scale(1)';
                totalAmount.style.color = '';
            }, 300);
        }

        totalAmount.textContent = format.currency(total);
        totalBreakdown.innerHTML = breakdown.map(item => `<div>${item}</div>`).join('');

        // Ryanair comparison (always cheaper, but not by much)
        const ryanairPrice = Math.max(5, total - random.between(50, 150));
        ryanairComparison.textContent = format.currency(ryanairPrice);

        // Show warning if total gets ridiculous
        if (total > 1000) {
            this.showExpensiveWarning(total);
        }
    }

    /**
     * Show warning for expensive totals
     * @param {number} total - Total price
     */
    showExpensiveWarning(total) {
        const warnings = [
            `€${total}? You could buy a car for that! But no, you chose us.`,
            `Holy shit, €${total}? That's more than a SpaceX ticket!`,
            `€${total} for a flight? Michael O'Leary is laughing at you right now.`,
            `You could fly first class on Emirates for €${total}. But you're flying with us.`,
            `€${total}? That's the GDP of a small country. Enjoy your flight.`
        ];

        // Only show warning if not already showing
        if (!this.calculator.querySelector('.expensive-warning')) {
            const warning = dom.create('div', {
                className: 'warning expensive-warning',
                textContent: random.pick(warnings)
            });

            const totalDisplay = this.calculator.querySelector('.total-display');
            totalDisplay.appendChild(warning);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                }
            }, 5000);
        }
    }

    /**
     * Reset calculator to defaults
     */
    resetCalculator() {
        this.fees = JSON.parse(JSON.stringify(this.defaultFees));
        this.updateFeeGrid();
        this.updateTotal();

        // Show reset message
        const message = dom.create('div', {
            className: 'alert',
            textContent: 'Calculator reset! Prices are still ridiculous though.'
        });

        const actions = this.calculator.querySelector('.calculator-actions');
        actions.insertBefore(message, actions.firstChild);

        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    /**
     * Handle "Fire the Twat" donation
     */
    fireTheTwat() {
        const messages = [
            "Thank you for your donation! €50 has been added to the 'Fire Michael O\'Leary' fund.",
            "Donation received! We're one step closer to buying Ryanair and firing that twat.",
            "$TWATAIR coin price increased by 5% thanks to your generosity!",
            "Your donation will be used to hire lawyers to sue Michael O'Leary for being a twat.",
            "Elon Musk has been notified of your donation. He approves."
        ];

        alert(random.pick(messages));

        // Add a small donation fee to the total
        setTimeout(() => {
            this.fees.donation = {
                name: 'Fire the Twat Donation',
                amount: 50.00,
                checked: true
            };

            // Re-render the fee grid to include donation
            this.updateFeeGrid();
            this.updateTotal();
        }, 1000);
    }

    /**
     * Update fee grid (for dynamic fees like donation)
     */
    updateFeeGrid() {
        const feeGrid = this.calculator.querySelector('.fee-grid');
        if (!feeGrid) return;

        // Clear existing
        feeGrid.innerHTML = '';

        // Re-render all fees
        Object.entries(this.fees).forEach(([key, fee]) => {
            const feeItem = dom.create('div', { className: 'fee-item' });

            const checkbox = dom.create('input', {
                type: 'checkbox',
                id: `fee-${key}`,
                'data-fee': key,
                checked: fee.checked
            });

            const label = dom.create('label', {
                for: `fee-${key}`,
                innerHTML: `
                    <strong>${fee.name}</strong><br>
                    <span class="fee-amount">${format.currency(fee.amount)}</span>
                `
            });

            if (this.tooltips[key]) {
                label.title = this.tooltips[key];
            }

            feeItem.appendChild(checkbox);
            feeItem.appendChild(label);
            feeGrid.appendChild(feeItem);
        });
    }

    /**
     * Show tooltip for fee item
     * @param {Element} feeItem - Fee item element
     */
    showTooltip(feeItem) {
        // Remove existing tooltips
        this.hideTooltip();

        const checkbox = feeItem.querySelector('input');
        if (!checkbox || !checkbox.dataset.fee) return;

        const feeKey = checkbox.dataset.fee;
        const tooltip = this.tooltips[feeKey];

        if (tooltip) {
            const tooltipEl = dom.create('div', {
                className: 'fee-tooltip',
                textContent: tooltip
            });

            tooltipEl.style.cssText = `
                position: absolute;
                background: #003087;
                color: #FFCC00;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.9rem;
                z-index: 1000;
                max-width: 200px;
                pointer-events: none;
            `;

            feeItem.appendChild(tooltipEl);
            feeItem.style.position = 'relative';
        }
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltips = this.calculator.querySelectorAll('.fee-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    /**
     * Get current total
     * @returns {number} Current total price
     */
    getTotal() {
        let total = this.basePrice;
        Object.values(this.fees).forEach(fee => {
            if (fee.checked) {
                total += fee.amount;
            }
        });
        return total;
    }

    /**
     * Get selected fees
     * @returns {Array} Array of selected fee keys
     */
    getSelectedFees() {
        return Object.entries(this.fees)
            .filter(([key, fee]) => fee.checked)
            .map(([key]) => key);
    }
}

// Export singleton instance
export const feeCalculator = new FeeCalculator();
