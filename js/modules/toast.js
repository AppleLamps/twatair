/**
 * TwatAir Toast Notification System
 * Slide-in notifications that replace browser alerts
 */

import { dom } from './utils.js';

/**
 * Toast notification types and their configurations
 */
const TOAST_TYPES = {
    success: {
        icon: '\u2714',
        title: 'Success',
        className: 'toast--success'
    },
    error: {
        icon: '\u2716',
        title: 'Error',
        className: 'toast--error'
    },
    warning: {
        icon: '\u26A0',
        title: 'Warning',
        className: 'toast--warning'
    },
    info: {
        icon: '\u2139',
        title: 'Info',
        className: 'toast--info'
    }
};

/**
 * Toast Manager Class
 * Handles creating, displaying, and removing toast notifications
 */
export class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.toastId = 0;
        this.defaultDuration = 4000;
    }

    /**
     * Initialize the toast system
     */
    init() {
        if (this.container) return;

        // Create toast container
        this.container = dom.create('div', { className: 'toast-container' });
        this.container.setAttribute('role', 'alert');
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Toast type (success, error, warning, info)
     * @param {Object} options - Additional options
     * @returns {number} Toast ID for manual dismissal
     */
    show(message, type = 'info', options = {}) {
        // Ensure container exists
        if (!this.container) {
            this.init();
        }

        const config = TOAST_TYPES[type] || TOAST_TYPES.info;
        const id = ++this.toastId;
        const duration = options.duration ?? this.defaultDuration;

        // Create toast element
        const toast = dom.create('div', {
            className: `toast ${config.className}`
        });
        toast.setAttribute('data-toast-id', id);

        toast.innerHTML = `
            <span class="toast__icon">${config.icon}</span>
            <div class="toast__content">
                <div class="toast__title">${options.title || config.title}</div>
                <div class="toast__message">${message}</div>
            </div>
            <button class="toast__close" aria-label="Close notification">\u00D7</button>
            ${duration > 0 ? '<div class="toast__progress"></div>' : ''}
        `;

        // Bind close button
        const closeBtn = toast.querySelector('.toast__close');
        dom.on(closeBtn, 'click', () => this.dismiss(id));

        // Add to container
        this.container.appendChild(toast);
        this.toasts.set(id, toast);

        // Auto-dismiss after duration (if duration > 0)
        if (duration > 0) {
            const progressBar = toast.querySelector('.toast__progress');
            if (progressBar) {
                progressBar.style.animationDuration = `${duration}ms`;
            }

            setTimeout(() => {
                this.dismiss(id);
            }, duration);
        }

        return id;
    }

    /**
     * Dismiss a toast notification
     * @param {number} id - Toast ID to dismiss
     */
    dismiss(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;

        // Add exit animation
        toast.classList.add('toast--exiting');

        // Remove after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(id);
        }, 300);
    }

    /**
     * Dismiss all toasts
     */
    dismissAll() {
        this.toasts.forEach((_, id) => this.dismiss(id));
    }

    /**
     * Show a success toast
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {number} Toast ID
     */
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    /**
     * Show an error toast
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {number} Toast ID
     */
    error(message, options = {}) {
        return this.show(message, 'error', options);
    }

    /**
     * Show a warning toast
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {number} Toast ID
     */
    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    /**
     * Show an info toast
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {number} Toast ID
     */
    info(message, options = {}) {
        return this.show(message, 'info', options);
    }
}

// Export singleton instance
export const toast = new ToastManager();
