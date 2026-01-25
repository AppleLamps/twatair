/**
 * TwatAir Contact Module
 * Handles contact form with rude auto-responses
 */

import { dom, validate, random } from './utils.js';

export class Contact {
    constructor() {
        this.responseDelay = 2000; // 2 seconds
        this.formData = {};
    }

    /**
     * Initialize contact page
     */
    async init() {
        await this.createContactForm();
        this.bindEvents();
    }

    /**
     * Create contact form HTML
     */
    async createContactForm() {
        const container = dom.get('#contact-form');
        if (!container) return;

        const contactForm = dom.create('div', { className: 'contact-form-container' });

        // Header
        const header = dom.create('div', { className: 'contact-header' });
        header.innerHTML = `
            <h3>CONTACT TWATAIR</h3>
            <p>We love hearing from our passengers... said no airline ever.</p>
            <div class="warning">
                ⚠️ WARNING: Response time varies. We might reply. Or not. Don't hold your breath.
            </div>
        `;

        // Contact form
        const form = dom.create('form', { className: 'contact-form card', id: 'contactForm' });

        form.innerHTML = `
            <div class="form-section">
                <h4>YOUR DETAILS</h4>

                <div class="form-row">
                    <div class="form-group">
                        <label for="contactFirstName">FIRST NAME *</label>
                        <input type="text" id="contactFirstName" name="firstName" required>
                    </div>

                    <div class="form-group">
                        <label for="contactLastName">LAST NAME *</label>
                        <input type="text" id="contactLastName" name="lastName" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="contactEmail">EMAIL *</label>
                    <input type="email" id="contactEmail" name="email" required>
                </div>

                <div class="form-group">
                    <label for="contactPhone">PHONE</label>
                    <input type="tel" id="contactPhone" name="phone">
                </div>
            </div>

            <div class="form-section">
                <h4>YOUR MESSAGE</h4>

                <div class="form-group">
                    <label for="contactSubject">SUBJECT *</label>
                    <select id="contactSubject" name="subject" required>
                        <option value="">Select a subject</option>
                        <option value="complaint">Flight Complaint</option>
                        <option value="delay">Flight Delay</option>
                        <option value="refund">Refund Request</option>
                        <option value="lost-luggage">Lost Luggage</option>
                        <option value="booking-issue">Booking Issue</option>
                        <option value="fee-question">Fee Question</option>
                        <option value="elon-musk">Elon Musk Related</option>
                        <option value="michael-oleary">Michael O'Leary Roast</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="contactMessage">MESSAGE *</label>
                    <textarea id="contactMessage" name="message" rows="6" required
                        placeholder="Tell us what's on your mind..."></textarea>
                </div>
            </div>

            <div class="form-section">
                <h4>HOW DID YOU HEAR ABOUT US?</h4>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="referral" value="elon-twitter"> Elon Musk's Twitter
                    </label>
                    <label>
                        <input type="checkbox" name="referral" value="ryanair-comparison"> Ryanair Comparison
                    </label>
                    <label>
                        <input type="checkbox" name="referral" value="meme-coin"> $TWATAIR Meme Coin
                    </label>
                    <label>
                        <input type="checkbox" name="referral" value="word-of-mouth"> Word of Mouth (probably complaining)
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary" id="submitContact">
                    SEND MESSAGE (GOOD LUCK)
                </button>
                <button type="button" class="btn" id="resetContact">
                    START OVER
                </button>
            </div>
        `;

        // Response area
        const responseArea = dom.create('div', {
            className: 'contact-response',
            id: 'contactResponse'
        });

        // Contact info
        const contactInfo = dom.create('div', { className: 'contact-info card' });
        contactInfo.innerHTML = `
            <h4>OTHER WAYS TO REACH US</h4>
            <div class="contact-methods">
                <div class="contact-method">
                    <strong>📧 EMAIL:</strong><br>
                    complaints@twatair.com<br>
                    <small>(We read them... sometimes)</small>
                </div>

                <div class="contact-method">
                    <strong>📞 PHONE:</strong><br>
                    1-800-FUCK-RYAN<br>
                    <small>(Lines are always busy)</small>
                </div>

                <div class="contact-method">
                    <strong>🐦 TWITTER:</strong><br>
                    @TwatAir_Official<br>
                    <small>(We roast Michael O'Leary daily)</small>
                </div>

                <div class="contact-method">
                    <strong>💰 CRYPTO:</strong><br>
                    $TWATAIR on all exchanges<br>
                    <small>(Buy now before it crashes)</small>
                </div>
            </div>
        `;

        // Assemble contact form container
        contactForm.appendChild(header);
        contactForm.appendChild(form);
        contactForm.appendChild(responseArea);
        contactForm.appendChild(contactInfo);

        container.appendChild(contactForm);

        this.contactForm = contactForm;
        this.form = form;
        this.responseArea = responseArea;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Form submission
        dom.on(this.form, 'submit', (e) => this.handleSubmit(e));

        // Reset button
        const resetBtn = dom.get('#resetContact');
        dom.on(resetBtn, 'click', () => this.resetForm());

        // Dynamic subject-based message hints
        const subjectSelect = dom.get('#contactSubject');
        dom.on(subjectSelect, 'change', () => this.onSubjectChange());

        // Real-time validation
        dom.on(this.form, 'input', (e) => this.validateField(e.target));
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        if (!this.validateForm()) {
            return;
        }

        // Collect form data
        this.collectFormData();

        // Disable form
        this.setFormDisabled(true);

        // Show processing message
        this.showResponse('processing');

        // Simulate processing delay
        setTimeout(() => {
            this.generateResponse();
        }, this.responseDelay);
    }

    /**
     * Validate entire form
     * @returns {boolean} Is form valid
     */
    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate individual field
     * @param {Element} field - Form field element
     * @returns {boolean} Is field valid
     */
    validateField(field) {
        const value = field.value.trim();

        // Clear previous errors
        validate.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !validate.required(value)) {
            validate.showError(field, this.getFieldErrorMessage(field.name));
            return false;
        }

        // Email validation
        if (field.type === 'email' && value && !validate.email(value)) {
            validate.showError(field, "That's not a real email address, you twat!");
            return false;
        }

        return true;
    }

    /**
     * Get error message for field
     * @param {string} fieldName - Field name
     * @returns {string} Error message
     */
    getFieldErrorMessage(fieldName) {
        const messages = {
            firstName: "We need your first name for our spam database!",
            lastName: "Surname too, unless you're famous.",
            email: "Email required. We'll send you our special offers!",
            subject: "Pick a subject, or we'll assume it's a complaint.",
            message: "You forgot to actually write a message!"
        };

        return messages[fieldName] || "This field is required, apparently.";
    }

    /**
     * Handle subject change
     */
    onSubjectChange() {
        const subject = dom.get('#contactSubject').value;
        const messageTextarea = dom.get('#contactMessage');
        const placeholder = this.getSubjectPlaceholder(subject);

        if (placeholder) {
            messageTextarea.placeholder = placeholder;
        }
    }

    /**
     * Get placeholder text based on subject
     * @param {string} subject - Selected subject
     * @returns {string} Placeholder text
     */
    getSubjectPlaceholder(subject) {
        const placeholders = {
            complaint: "Tell us how we ruined your day...",
            delay: "Which flight were you supposed to be on? Not that we care.",
            refund: "Good luck with that. Explain why you think you deserve money back.",
            'lost-luggage': "What did you lose? Your dignity? Your faith in humanity?",
            'booking-issue': "What went wrong? Besides choosing to fly with us.",
            'fee-question': "Which fee confused you? We have so many to choose from!",
            'elon-musk': "Elon-related questions go straight to Michael O'Leary's lawyers.",
            'michael-oleary': "Roasting Michael O'Leary is our specialty. What's your best burn?",
            other: "Tell us what's on your mind. We'll pretend to care."
        };

        return placeholders[subject] || "Tell us what's on your mind...";
    }

    /**
     * Collect form data
     */
    collectFormData() {
        const formData = new FormData(this.form);
        this.formData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            referrals: formData.getAll('referral'),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Generate rude auto-response
     */
    generateResponse() {
        const subject = this.formData.subject;
        const response = this.getSubjectResponse(subject);

        this.showResponse('success', response);
        this.setFormDisabled(false);
    }

    /**
     * Get response based on subject
     * @param {string} subject - Contact subject
     * @returns {string} Response message
     */
    getSubjectResponse(subject) {
        const responses = {
            complaint: [
                "Your complaint has been forwarded to Michael O'Leary. Good luck getting a response from that twat.",
                "Thanks for the complaint! We've added it to our 'Things We Don't Give A Fuck About' collection.",
                "Complaint received. Our AI customer service bot is currently busy insulting other passengers.",
                "Your feedback is important to us. We've filed it under 'G' for 'Get Lost'."
            ],
            delay: [
                "Delays are our specialty! Your complaint has been added to the queue, behind 500 others.",
                "Sorry about the delay. Blame air traffic control, weather, or Michael O'Leary's ego.",
                "Flight delayed? Welcome to aviation! We've sent you a voucher for €2.50 off your next flight.",
                "Delays happen. Our pilots are probably just having a cup of tea. Or twelve."
            ],
            refund: [
                "Refund request received. Processing will take 6-8 weeks. Or never. Whichever comes first.",
                "Refunds are processed by our special 'Fat Chance' department. You'll hear from them eventually.",
                "We appreciate your refund request. It joins the other 10,000 we receive daily.",
                "Refund approved! You'll receive €0.00 back in 3-5 business days."
            ],
            'lost-luggage': [
                "Lost luggage? That's what insurance is for. Hope you bought travel insurance!",
                "Your bag is probably still at the airport. Or in Michael O'Leary's mansion.",
                "Lost luggage claim filed. We'll search for it... when we feel like it.",
                "Bad news: Your luggage eloped with someone else's bag. They're very happy together."
            ],
            'booking-issue': [
                "Booking issues are our favorite! They give us an excuse to charge more fees.",
                "Your booking issue has been escalated to our 'We Give Zero Fucks' team.",
                "Booking problem? Try canceling and rebooking. We'll charge you again!",
                "Booking issue resolved! We've added an extra €50 'Processing Fee' to your account."
            ],
            'fee-question': [
                "Fee questions are like our children - we love them all equally and charge for everything.",
                "That fee is there because Ryanair charges it too, but we charge more.",
                "Fees pay for our luxury: Cheap seats, rude staff, and delayed flights.",
                "Our fee structure is designed by Michael O'Leary himself. Questions go to him."
            ],
            'elon-musk': [
                "Elon-related inquiries are forwarded directly to Michael O'Leary's legal team.",
                "Elon Musk questions get special priority... right to the bottom of the pile.",
                "Elon would probably buy Ryanair and fire everyone. We're just preparing you.",
                "Your Elon Musk question has been tweeted at him. Hope he responds!"
            ],
            'michael-oleary': [
                "Roasting Michael O'Leary is our passion. What's your favorite insult?",
                "O'Leary questions go to our CEO, who is currently hiding from Elon Musk.",
                "Michael O'Leary is unavailable. He's probably counting his money somewhere.",
                "O'Leary-related questions: He's a twat. Anything else we can help with?"
            ],
            other: [
                "Your message has been received and promptly ignored. Thanks for reaching out!",
                "Thanks for contacting us! Your message joins the other spam in our inbox.",
                "Message received. Our response time is measured in geological eras.",
                "We appreciate your message. It will be reviewed by our team of highly trained monkeys."
            ]
        };

        return random.pick(responses[subject] || responses.other);
    }

    /**
     * Show response message
     * @param {string} type - Response type (processing, success, error)
     * @param {string} message - Response message
     */
    showResponse(type, message = '') {
        this.responseArea.innerHTML = '';

        let responseClass = 'alert';
        let responseContent = '';

        switch (type) {
            case 'processing':
                responseClass += ' alert-info';
                responseContent = `
                    <div class="response-processing">
                        <div class="spinner">⏳</div>
                        <p>Processing your message... (this might take a while)</p>
                    </div>
                `;
                break;

            case 'success':
                responseClass += ' success';
                responseContent = `
                    <h4>MESSAGE SENT!</h4>
                    <p>${message}</p>
                    <p><em>Don't hold your breath waiting for a proper response.</em></p>
                `;
                break;

            case 'error':
                responseClass += ' warning';
                responseContent = `
                    <h4>ERROR!</h4>
                    <p>${message}</p>
                    <p><em>Try again, or give up. Your choice.</em></p>
                `;
                break;
        }

        const responseDiv = dom.create('div', { className: responseClass });
        responseDiv.innerHTML = responseContent;

        this.responseArea.appendChild(responseDiv);
    }

    /**
     * Set form disabled state
     * @param {boolean} disabled - Whether form should be disabled
     */
    setFormDisabled(disabled) {
        const inputs = this.form.querySelectorAll('input, select, textarea, button');
        const submitBtn = dom.get('#submitContact');

        inputs.forEach(input => {
            input.disabled = disabled;
        });

        if (disabled) {
            submitBtn.textContent = 'SENDING...';
        } else {
            submitBtn.textContent = 'SEND MESSAGE (GOOD LUCK)';
        }
    }

    /**
     * Reset contact form
     */
    resetForm() {
        this.form.reset();
        this.responseArea.innerHTML = '';
        validate.clearError(this.form);
    }

    /**
     * Get form data
     * @returns {object} Collected form data
     */
    getFormData() {
        return { ...this.formData };
    }
}

// Export singleton instance
export const contact = new Contact();