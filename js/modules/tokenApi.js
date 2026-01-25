/**
 * TwatAir Token API Service
 * Fetches $TWATAIR token data from the backend API
 */

// Token configuration
export const TOKEN_CONFIG = {
    address: '5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS',
    bagsUrl: 'https://bags.fm/5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS',
    symbol: '$TWATAIR',
    name: 'TwatAir Coin'
};

// API configuration
const API_BASE = '/api';
const FALLBACK_DATA = {
    success: true,
    mock: true,
    token: {
        address: TOKEN_CONFIG.address,
        symbol: TOKEN_CONFIG.symbol,
        name: TOKEN_CONFIG.name,
        tradingUrl: TOKEN_CONFIG.bagsUrl,
        price: 0.0000420,
        priceChange24h: 5.2,
        marketCap: 420690,
        volume24h: 69420,
        totalSupply: 1000000000,
        circulatingSupply: 690000000,
        holders: 1337,
        lifetimeFees: 0
    },
    timestamp: Date.now()
};

// Cache for token data
let tokenCache = {
    data: null,
    timestamp: 0
};
const CACHE_TTL = 30 * 1000; // 30 seconds client-side cache

/**
 * Fetch token data from API
 * @returns {Promise<Object>} Token data
 */
export async function fetchTokenData() {
    // Check cache first
    const now = Date.now();
    if (tokenCache.data && (now - tokenCache.timestamp) < CACHE_TTL) {
        return tokenCache.data;
    }
    
    try {
        const response = await fetch(`${API_BASE}/token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.warn('API request failed, using fallback data');
            return getFallbackData();
        }
        
        const data = await response.json();
        
        // Update cache
        tokenCache = {
            data,
            timestamp: now
        };
        
        return data;
    } catch (error) {
        console.warn('Failed to fetch token data:', error);
        return getFallbackData();
    }
}

/**
 * Get fallback data with randomized values
 * @returns {Object} Fallback token data
 */
function getFallbackData() {
    const randomChange = (Math.random() - 0.5) * 20; // -10% to +10%
    const basePrice = 0.0000420;
    const randomPrice = basePrice * (1 + randomChange / 100);
    
    return {
        ...FALLBACK_DATA,
        token: {
            ...FALLBACK_DATA.token,
            price: randomPrice,
            priceChange24h: randomChange,
            marketCap: Math.floor(randomPrice * 1000000000),
            volume24h: Math.floor(Math.random() * 100000) + 50000
        },
        timestamp: Date.now()
    };
}

/**
 * Check if API is available
 * @returns {Promise<boolean>} True if API is healthy
 */
export async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            return false;
        }
        
        const data = await response.json();
        return data.status === 'ok';
    } catch (error) {
        console.warn('API health check failed:', error);
        return false;
    }
}

/**
 * Subscribe to token updates
 * @param {Function} callback - Callback function to receive updates
 * @param {number} interval - Update interval in ms (default 30s)
 * @returns {Function} Unsubscribe function
 */
export function subscribeToTokenUpdates(callback, interval = 30000) {
    // Initial fetch
    fetchTokenData().then(callback);
    
    // Set up interval
    const intervalId = setInterval(async () => {
        const data = await fetchTokenData();
        callback(data);
    }, interval);
    
    // Return unsubscribe function
    return () => clearInterval(intervalId);
}

/**
 * Get token trading URL
 * @returns {string} Bags.fm trading URL
 */
export function getTradingUrl() {
    return TOKEN_CONFIG.bagsUrl;
}

/**
 * Get token address
 * @returns {string} Token address
 */
export function getTokenAddress() {
    return TOKEN_CONFIG.address;
}
