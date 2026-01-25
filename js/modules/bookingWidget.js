/**
 * TwatAir Booking Widget Module
 * Multi-step booking form with escalating fees and rude validation
 */

import { dom, format, random, validate, animate } from './utils.js';

export class BookingWidget {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.bookingData = {
            from: '',
            to: '',
            date: '',
            passengers: 1,
            extras: [],
            basePrice: 0,
            fees: {},
            total: 0
        };

        this.fees = {
            breathing: 25.00,
            existing: 35.00,
            olearyEgo: 666.00,
            seatSelection: 45.00,
            luggage: 55.00,
            food: 15.00,
            wifi: 20.00,
            insurance: 30.00,
            notDelayed: 75.00,
            avoidOLearyRant: 100.00,
            specialNeedsChimp: 200.00
        };
    }

    /**
     * Initialize booking widget
     */
    async init() {
        try {
            await this.createWidget();
            this.bindEvents();
        } catch (e) {
            console.error('Failed to initialize booking widget:', e);
        }
    }

    /**
     * Create booking widget HTML
     */
    async createWidget() {
        const container = dom.get('#booking-widget');
        if (!container) {
            console.warn('Booking widget container not found');
            return;
        }

        const widget = dom.create('div', { className: 'booking-widget card' });

        // Progress indicator
        const progress = this.createProgressIndicator();
        widget.appendChild(progress);

        // Steps container
        const stepsContainer = dom.create('div', { className: 'steps-container' });

        // Step 1: Flight Selection
        const step1 = this.createStep1();
        stepsContainer.appendChild(step1);

        // Step 2: Passenger Details
        const step2 = this.createStep2();
        stepsContainer.appendChild(step2);

        // Step 3: Extras & Fees
        const step3 = this.createStep3();
        stepsContainer.appendChild(step3);

        // Step 4: Payment
        const step4 = this.createStep4();
        stepsContainer.appendChild(step4);

        widget.appendChild(stepsContainer);

        // Navigation buttons
        const navButtons = this.createNavButtons();
        widget.appendChild(navButtons);

        container.appendChild(widget);

        // Store references
        this.widget = widget;
        this.stepsContainer = stepsContainer;
        this.navButtons = navButtons;

        // Show first step
        this.showStep(1);
    }

    /**
     * Create progress indicator
     * @returns {Element} Progress indicator element
     */
    createProgressIndicator() {
        const progress = dom.create('div', { className: 'progress-indicator' });

        for (let i = 1; i <= this.totalSteps; i++) {
            const step = dom.create('div', {
                className: `progress-step ${i === 1 ? 'active' : ''}`,
                textContent: i
            });
            progress.appendChild(step);
        }

        return progress;
    }

    /**
     * Create step 1: Flight selection
     * @returns {Element} Step 1 element
     */
    createStep1() {
        const step = dom.create('div', { className: 'booking-step', 'data-step': '1' });
        const now = new Date();
        const minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];

        step.innerHTML = `
            <h3>SELECT YOUR FLIGHT</h3>
            <p>Choose your route and date. We'll handle the disappointment.</p>

            <div class="form-row">
                <div class="form-group">
                    <label for="from">FROM</label>
                    <select id="from" required>
                        <option value="">Select departure</option>
                        <option value="DUB">Dublin (DUB) - Normal People Airport</option>
                        <option value="LON">London (LON) - Stansted at 4AM</option>
                        <option value="PAR">Paris (PAR) - Charles de Gaulle, because fuck Orly</option>
                        <option value="AMS">Amsterdam (AMS) - Schiphol, not the red light district</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="to">TO</label>
                    <select id="to" required>
                        <option value="">Select destination</option>
                        <option value="LON">London (LON) - Stansted at 4AM</option>
                        <option value="DUB">Dublin (DUB) - Normal People Airport</option>
                        <option value="PAR">Paris (PAR) - Charles de Gaulle, because fuck Orly</option>
                        <option value="AMS">Amsterdam (AMS) - Schiphol, not the red light district</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="date">DEPARTURE DATE</label>
                <input type="date" id="date" required min="${minDate}">
            </div>

            <div class="form-group">
                <label for="passengers">PASSENGERS</label>
                <select id="passengers">
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                </select>
            </div>

            <div class="warning">
                ⚠️ WARNING: All our airports are remote. Bring walking shoes and a sense of regret.
            </div>
        `;

        return step;
    }

    /**
     * Create step 2: Passenger details
     * @returns {Element} Step 2 element
     */
    createStep2() {
        const step = dom.create('div', { className: 'booking-step', 'data-step': '2' });

        step.innerHTML = `
            <h3>PASSENGER DETAILS</h3>
            <p>We'll sell this data to the highest bidder. Privacy? What's that?</p>

            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">FIRST NAME</label>
                    <input type="text" id="firstName" required placeholder="Enter your first name">
                </div>

                <div class="form-group">
                    <label for="lastName">LAST NAME</label>
                    <input type="text" id="lastName" required placeholder="Enter your last name">
                </div>
            </div>

            <div class="form-group">
                <label for="email">EMAIL</label>
                <input type="email" id="email" required placeholder="we@spam.you">
            </div>

            <div class="form-group">
                <label for="phone">PHONE</label>
                <input type="tel" id="phone" required placeholder="+353 WE CHARGE FOR THIS">
            </div>

            <div class="alert">
                💡 PRO TIP: Use a fake name. We don't actually verify anything.
            </div>
        `;

        return step;
    }

    /**
     * Create step 3: Extras and fees
     * @returns {Element} Step 3 element
     */
    createStep3() {
        const step = dom.create('div', { className: 'booking-step', 'data-step': '3' });

        step.innerHTML = `
            <h3>EXTRAS & FEES</h3>
            <p>Everything costs extra. Freedom isn't free, neither is sitting.</p>

            <div class="extras-grid">
                <div class="extra-item">
                    <input type="checkbox" id="seat" value="seatSelection">
                    <label for="seat">
                        <strong>Seat Selection</strong><br>
                        Choose where you sit (€${this.fees.seatSelection})
                    </label>
                </div>

                <div class="extra-item">
                    <input type="checkbox" id="luggage" value="luggage">
                    <label for="luggage">
                        <strong>Carry-on Luggage</strong><br>
                        Bring your own bag (€${this.fees.luggage})
                    </label>
                </div>

                <div class="extra-item">
                    <input type="checkbox" id="food" value="food">
                    <label for="food">
                        <strong>Food & Drink</strong><br>
                        Don't starve (€${this.fees.food})
                    </label>
                </div>

                <div class="extra-item">
                    <input type="checkbox" id="wifi" value="wifi">
                    <label for="wifi">
                        <strong>WiFi</strong><br>
                        Browse the web slowly (€${this.fees.wifi})
                    </label>
                </div>

                <div class="extra-item">
                    <input type="checkbox" id="insurance" value="insurance">
                    <label for="insurance">
                        <strong>Travel Insurance</strong><br>
                        Against our incompetence (€${this.fees.insurance})
                    </label>
                </div>

                <div class="extra-item">
                    <input type="checkbox" id="notDelayed" value="notDelayed">
                    <label for="notDelayed">
                        <strong>No Delay Guarantee</strong><br>
                        We'll try not to be late (€${this.fees.notDelayed})
                    </label>
                </div>
            </div>

            <div class="price-summary" id="price-summary">
                <div class="summary-row">
                    <span>Base Fare:</span>
                    <span id="summary-base">€0.00</span>
                </div>
                <div class="summary-row">
                    <span>Extras:</span>
                    <span id="summary-extras">€0.00</span>
                </div>
                <div class="summary-row total">
                    <span>TOTAL:</span>
                    <span id="summary-total">€0.00</span>
                </div>
            </div>
        `;

        return step;
    }

    /**
     * Create step 4: Payment
     * @returns {Element} Step 4 element
     */
    createStep4() {
        const step = dom.create('div', { className: 'booking-step', 'data-step': '4' });

        step.innerHTML = `
            <h3>PAYMENT</h3>
            <p>Choose your payment method. Regret is free.</p>

            <div class="payment-options">
                <div class="payment-option">
                    <input type="radio" id="card" name="payment" value="card" checked>
                    <label for="card">
                        💳 Credit Card<br>
                        <small>We'll charge extra processing fees</small>
                    </label>
                </div>

                <div class="payment-option">
                    <input type="radio" id="paypal" name="payment" value="paypal">
                    <label for="paypal">
                        🅿️ PayPal<br>
                        <small>They'll charge us, we'll charge you</small>
                    </label>
                </div>

                <div class="payment-option">
                    <input type="radio" id="twatair" name="payment" value="twatair">
                    <label for="twatair">
                        🪙 $TWATAIR Coin<br>
                        <small>50% discount! (if the price doesn't crash first)</small>
                    </label>
                </div>
            </div>

            <div class="final-price" id="final-price">
                <h4>FINAL TOTAL: <span id="final-amount">€0.00</span></h4>
                <p class="text-center">This price includes all the fees we could think of.</p>
            </div>

            <div class="warning">
                ⚠️ By booking with TwatAir, you agree that Michael O'Leary is a twat and Elon Musk is a genius.
            </div>
        `;

        return step;
    }

    /**
     * Create navigation buttons
     * @returns {Element} Navigation buttons container
     */
    createNavButtons() {
        const nav = dom.create('div', { className: 'booking-nav' });

        const prevBtn = dom.create('button', {
            className: 'btn',
            id: 'prev-btn',
            textContent: '← PREVIOUS',
            type: 'button'
        });

        const nextBtn = dom.create('button', {
            className: 'btn',
            id: 'next-btn',
            textContent: 'NEXT →',
            type: 'button'
        });

        const bookBtn = dom.create('button', {
            className: 'btn btn-success',
            id: 'book-btn',
            textContent: 'CONFIRM BOOKING',
            type: 'button'
        });

        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);
        nav.appendChild(bookBtn);

        return nav;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation buttons
        const prevBtn = dom.get('#prev-btn');
        const nextBtn = dom.get('#next-btn');
        const bookBtn = dom.get('#book-btn');

        dom.on(prevBtn, 'click', () => this.previousStep());
        dom.on(nextBtn, 'click', () => this.nextStep());
        dom.on(bookBtn, 'click', () => this.confirmBooking());

        // Form inputs
        this.bindFormEvents();

        // Update price when extras change
        dom.on(this.widget, 'change', (e) => {
            if (e.target.type === 'checkbox') {
                this.updatePrice();
            }
        });
    }

    /**
     * Bind form input events
     */
    bindFormEvents() {
        // Step 1 validation
        const fromSelect = dom.get('#from');
        const toSelect = dom.get('#to');

        dom.on(fromSelect, 'change', () => this.validateRoute());
        dom.on(toSelect, 'change', () => this.validateRoute());
    }

    /**
     * Validate route selection (prevent same from/to)
     */
    validateRoute() {
        const from = dom.get('#from').value;
        const to = dom.get('#to').value;

        if (from && to && from === to) {
            validate.showError(dom.get('#to'), "You can't fly to the same place you start, you absolute donut!");
            dom.get('#to').value = '';
        } else {
            validate.clearError(dom.get('#to'));
        }
    }

    /**
     * Show specific step
     * @param {number} stepNumber - Step to show
     */
    showStep(stepNumber) {
        // Hide all steps
        dom.getAll('.booking-step').forEach(step => {
            step.style.display = 'none';
        });

        // Show target step
        const targetStep = dom.get(`[data-step="${stepNumber}"]`);
        if (targetStep) {
            targetStep.style.display = 'block';
            animate.fadeIn(targetStep);
        }

        // Update progress
        this.updateProgress(stepNumber);

        // Update navigation
        this.updateNavigation(stepNumber);

        this.currentStep = stepNumber;
    }

    /**
     * Update progress indicator
     * @param {number} activeStep - Currently active step
     */
    updateProgress(activeStep) {
        dom.getAll('.progress-step').forEach((step, index) => {
            const stepNum = index + 1;
            dom.removeClass(step, 'active');
            dom.removeClass(step, 'completed');

            if (stepNum === activeStep) {
                dom.addClass(step, 'active');
            } else if (stepNum < activeStep) {
                dom.addClass(step, 'completed');
            }
        });
    }

    /**
     * Update navigation buttons
     * @param {number} currentStep - Current step number
     */
    updateNavigation(currentStep) {
        const prevBtn = dom.get('#prev-btn');
        const nextBtn = dom.get('#next-btn');
        const bookBtn = dom.get('#book-btn');

        // Show/hide buttons based on step
        prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
        nextBtn.style.display = currentStep < this.totalSteps ? 'inline-block' : 'none';
        bookBtn.style.display = currentStep === this.totalSteps ? 'inline-block' : 'none';

        // Update next button text for final step
        if (currentStep === this.totalSteps - 1) {
            nextBtn.textContent = 'REVIEW →';
        } else {
            nextBtn.textContent = 'NEXT →';
        }
    }

    /**
     * Go to next step
     */
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep === 1) {
                this.processFlightSelection();
            }

            this.showStep(this.currentStep + 1);
        }
    }

    /**
     * Go to previous step
     */
    previousStep() {
        this.showStep(this.currentStep - 1);
    }

    /**
     * Validate current step
     * @returns {boolean} Is step valid
     */
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            case 3:
                return this.validateStep3();
            default:
                return true;
        }
    }

    /**
     * Validate step 1
     * @returns {boolean} Is step 1 valid
     */
    validateStep1() {
        const from = dom.get('#from').value;
        const to = dom.get('#to').value;
        const date = dom.get('#date').value;

        if (!validate.required(from)) {
            validate.showError(dom.get('#from'), "Pick a fucking departure airport!");
            return false;
        }

        if (!validate.required(to)) {
            validate.showError(dom.get('#to'), "Pick a destination, or are you just browsing?");
            return false;
        }

        if (!validate.required(date)) {
            validate.showError(dom.get('#date'), "When do you want to fly? Tomorrow? Next week? Sometime?");
            return false;
        }

        return true;
    }

    /**
     * Validate step 2
     * @returns {boolean} Is step 2 valid
     */
    validateStep2() {
        const firstName = dom.get('#firstName').value;
        const lastName = dom.get('#lastName').value;
        const email = dom.get('#email').value;
        const phone = dom.get('#phone').value;

        if (!validate.required(firstName)) {
            validate.showError(dom.get('#firstName'), "We need your name for our spam list!");
            return false;
        }

        if (!validate.required(lastName)) {
            validate.showError(dom.get('#lastName'), "Surname too, unless you're famous.");
            return false;
        }

        if (!validate.email(email)) {
            validate.showError(dom.get('#email'), "That's not a real email address, you twat!");
            return false;
        }

        if (!validate.required(phone)) {
            validate.showError(dom.get('#phone'), "Phone number, so we can call you about delays!");
            return false;
        }

        return true;
    }

    /**
     * Validate step 3
     * @returns {boolean} Is step 3 valid
     */
    validateStep3() {
        // Step 3 is optional extras, always valid
        return true;
    }

    /**
     * Process flight selection and calculate base price
     */
    processFlightSelection() {
        const from = dom.get('#from').value;
        const to = dom.get('#to').value;
        const passengers = parseInt(dom.get('#passengers').value);

        // Calculate ridiculous base price
        let basePrice = random.between(5, 25); // €5-25 base fare

        // Add fees
        this.bookingData.basePrice = basePrice;
        this.bookingData.passengers = passengers;
        this.bookingData.fees = {
            breathing: this.fees.breathing,
            existing: this.fees.existing,
            olearyEgo: this.fees.olearyEgo
        };

        // Calculate initial total
        this.updatePrice();
    }

    /**
     * Update price calculation
     */
    updatePrice() {
        let extrasTotal = 0;
        const checkedExtras = dom.getAll('input[type="checkbox"]:checked');

        checkedExtras.forEach(checkbox => {
            const feeKey = checkbox.value;
            if (this.fees[feeKey]) {
                extrasTotal += this.fees[feeKey];
            }
        });

        const basePrice = this.bookingData.basePrice || 0;
        const mandatoryFees = Object.values(this.bookingData.fees).reduce((sum, fee) => sum + fee, 0);
        const total = (basePrice + mandatoryFees + extrasTotal) * this.bookingData.passengers;

        // Update summary if on step 3
        if (this.currentStep >= 3) {
            dom.get('#summary-base').textContent = format.currency(basePrice);
            dom.get('#summary-extras').textContent = format.currency(extrasTotal);
            dom.get('#summary-total').textContent = format.currency(total);
        }

        // Update final price if on step 4
        if (this.currentStep >= 4) {
            const finalAmount = dom.get('#final-amount');
            format.explodeFee(finalAmount);
            finalAmount.textContent = format.currency(total);
        }

        this.bookingData.total = total;
    }

    /**
     * Confirm booking
     */
    confirmBooking() {
        const paymentMethod = dom.get('input[name="payment"]:checked').value;

        let message = `Booking confirmed! Total: ${format.currency(this.bookingData.total)}\n\n`;

        if (paymentMethod === 'twatair') {
            message += "Redirecting to crypto wallet... (just kidding, we don't accept crypto)\n\n";
            message += "Your booking has been cancelled. Try again with real money.";
        } else {
            message += "Thank you for choosing TwatAir!\n\n";
            message += "Your flight will probably be delayed. We'll text you... maybe.\n\n";
            message += "Remember: Ryanair charges less, but we're more honest about being shit.";
        }

        alert(message);

        // Reset form
        this.resetBooking();
    }

    /**
     * Reset booking widget
     */
    resetBooking() {
        this.currentStep = 1;
        this.bookingData = {
            from: '', to: '', date: '', passengers: 1,
            extras: [], basePrice: 0, fees: {}, total: 0
        };

        // Reset form
        const form = this.widget.querySelector('form');
        if (form && typeof form.reset === 'function') {
            form.reset();
        } else {
            this.widget.querySelectorAll('input, select, textarea').forEach((input) => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = input.defaultChecked;
                } else if (input.tagName === 'SELECT') {
                    const options = Array.from(input.options);
                    const defaultIndex = options.findIndex(option => option.defaultSelected);
                    input.selectedIndex = defaultIndex >= 0 ? defaultIndex : 0;
                } else {
                    input.value = input.defaultValue || '';
                }
            });
        }

        // Show first step
        this.showStep(1);
    }
}

// Export singleton instance
export const bookingWidget = new BookingWidget();
