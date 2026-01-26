/**
 * TwatAir Utility Functions
 * Shared utilities for DOM manipulation, formatting, and common operations
 */

// DOM manipulation utilities
export const dom = {
    /**
     * Create an element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {object} attrs - Object of attributes to set
     * @param {string|Element} content - Text content or child element
     * @returns {Element} The created element
     */
    create: (tag, attrs = {}, content = '') => {
        const element = document.createElement(tag);

        // Set attributes
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        // Add content
        if (content && typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof Element) {
            element.appendChild(content);
        }

        return element;
    },

    /**
     * Get element by selector (wrapper for querySelector)
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (defaults to document)
     * @returns {Element|null} The found element
     */
    get: (selector, context = document) => {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn(`Failed to find element: ${selector}`, e);
            return null;
        }
    },

    /**
     * Get all elements by selector (wrapper for querySelectorAll)
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (defaults to document)
     * @returns {NodeList} The found elements
     */
    getAll: (selector, context = document) => context.querySelectorAll(selector),

    /**
     * Add event listener with automatic cleanup tracking
     * @param {Element} element - Target element
     * @param {string} event - Event type
     * @param {function} handler - Event handler
     * @param {object} options - Event listener options
     */
    on: (element, event, handler, options = {}) => {
        element.addEventListener(event, handler, options);
    },

    /**
     * Add CSS class to element
     * @param {Element} element - Target element
     * @param {string} className - Class to add
     */
    addClass: (element, className) => {
        element.classList.add(className);
    },

    /**
     * Remove CSS class from element
     * @param {Element} element - Target element
     * @param {string} className - Class to remove
     */
    removeClass: (element, className) => {
        element.classList.remove(className);
    },

    /**
     * Toggle CSS class on element
     * @param {Element} element - Target element
     * @param {string} className - Class to toggle
     */
    toggleClass: (element, className) => {
        element.classList.toggle(className);
    }
};

// Currency and number formatting utilities
export const format = {
    /**
     * Format currency amount
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency symbol (default: €)
     * @returns {string} Formatted currency string
     */
    currency: (amount, currency = '€') => {
        if (amount === 0 || amount === null || amount === undefined) {
            return `${currency}0.00`;
        }
        
        // Handle very small crypto prices
        if (amount < 0.01 && amount > 0) {
            // Find the first significant digit
            const absAmount = Math.abs(amount);
            const exponent = Math.floor(Math.log10(absAmount));
            const decimals = Math.min(Math.max(-exponent + 2, 2), 12);
            return `${currency}${amount.toFixed(decimals)}`;
        }
        
        // Handle large numbers (millions+)
        if (amount >= 1000000) {
            return `${currency}${(amount / 1000000).toFixed(2)}M`;
        }
        
        // Handle thousands
        if (amount >= 1000) {
            return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        
        return `${currency}${amount.toFixed(2)}`;
    },

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    number: (num) => {
        return num.toLocaleString();
    },

    /**
     * Add fee explosion animation to element
     * @param {Element} element - Target element
     */
    explodeFee: (element) => {
        dom.addClass(element, 'fee-explosion');
        setTimeout(() => dom.removeClass(element, 'fee-explosion'), 500);
    },

    /**
     * Add price pump animation to element
     * @param {Element} element - Target element
     */
    pumpPrice: (element) => {
        dom.addClass(element, 'price-pump');
        setTimeout(() => dom.removeClass(element, 'price-pump'), 800);
    }
};

// Random utilities for satirical content
export const random = {
    /**
     * Get random item from array
     * @param {Array} array - Array to pick from
     * @returns {*} Random item
     */
    pick: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Generate random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    between: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Generate random price fluctuation for crypto
     * @param {number} basePrice - Base price
     * @param {number} volatility - Volatility percentage
     * @returns {number} New price
     */
    cryptoFluctuate: (basePrice, volatility = 0.1) => {
        const change = (Math.random() - 0.5) * 2 * volatility;
        return basePrice * (1 + change);
    }
};

// Animation utilities
export const animate = {
    /**
     * Fade in element
     * @param {Element} element - Element to fade in
     * @param {number} duration - Animation duration in ms
     */
    fadeIn: (element, duration = 600) => {
        element.style.opacity = '0';
        element.style.display = 'block';

        const start = performance.now();

        const fade = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;

            element.style.opacity = Math.min(progress, 1);

            if (progress < 1) {
                requestAnimationFrame(fade);
            }
        };

        requestAnimationFrame(fade);
    },

    /**
     * Slide in element from bottom
     * @param {Element} element - Element to slide in
     * @param {number} duration - Animation duration in ms
     */
    slideIn: (element, duration = 600) => {
        const originalTransform = element.style.transform;
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
        element.style.display = 'block';

        const start = performance.now();

        const slide = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;

            element.style.opacity = Math.min(progress, 1);
            element.style.transform = `translateY(${20 * (1 - Math.min(progress, 1))}px)`;

            if (progress < 1) {
                requestAnimationFrame(slide);
            } else {
                element.style.transform = originalTransform;
            }
        };

        requestAnimationFrame(slide);
    }
};

// Validation utilities
export const validate = {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate required field
     * @param {string} value - Value to check
     * @returns {boolean} Is not empty
     */
    required: (value) => {
        return value && value.trim().length > 0;
    },

    /**
     * Show validation error with rude message
     * Errors persist until dismissed or field is corrected
     * @param {Element} input - Input element
     * @param {string} message - Error message
     */
    showError: (input, message) => {
        // Remove existing error first
        validate.clearError(input);

        // Create error element with close button
        const errorEl = dom.create('div', {
            className: 'form-error'
        });
        errorEl.innerHTML = `
            <span class="form-error__message">${message}</span>
            <button type="button" class="form-error__close" aria-label="Dismiss error">\u00D7</button>
        `;

        // Bind close button
        const closeBtn = errorEl.querySelector('.form-error__close');
        closeBtn.addEventListener('click', () => {
            validate.clearError(input);
        });

        // Add error to DOM
        input.parentNode.insertBefore(errorEl, input.nextSibling);
        dom.addClass(input, 'error');

        // Clear error when user starts typing
        const clearOnInput = () => {
            validate.clearError(input);
            input.removeEventListener('input', clearOnInput);
            input.removeEventListener('change', clearOnInput);
        };
        input.addEventListener('input', clearOnInput);
        input.addEventListener('change', clearOnInput);
    },

    /**
     * Clear validation errors
     * @param {Element} input - Input element
     */
    clearError: (input) => {
        const error = input.parentNode.querySelector('.form-error');
        if (error) error.remove();
        // Also check for old .alert class for backwards compatibility
        const oldError = input.parentNode.querySelector('.alert');
        if (oldError) oldError.remove();
        dom.removeClass(input, 'error');
    }
};

// Debug logging utility - only logs in development
export const logger = {
    /**
     * Check if debug mode is enabled
     * @returns {boolean} True if debug mode is active
     */
    isDebug: () => {
        return window.TwatAir?.config?.debug || 
               window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    },

    /**
     * Log warning (always shown for important issues)
     * @param {string} message - Warning message
     * @param {...*} args - Additional arguments
     */
    warn: (message, ...args) => {
        console.warn(message, ...args);
    },

    /**
     * Log error (always shown)
     * @param {string} message - Error message
     * @param {...*} args - Additional arguments
     */
    error: (message, ...args) => {
        console.error(message, ...args);
    },

    /**
     * Debug log (only in development)
     * @param {string} message - Debug message
     * @param {...*} args - Additional arguments
     */
    debug: (message, ...args) => {
        if (logger.isDebug()) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    }
};

// Local storage utilities for persistence
export const storage = {
    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage not available:', e);
        }
    },

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Retrieved value or default
     */
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage not available:', e);
        }
    }
};