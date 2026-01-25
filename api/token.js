/**
 * Vercel Serverless Function - Token Information API
 * Proxies requests to Bags.fm API and caches responses
 */

// Token configuration
const TOKEN_ADDRESS = '5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS';
const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';
const BAGS_TOKEN_URL = `https://bags.fm/${TOKEN_ADDRESS}`;

// Simple in-memory cache (resets on cold start)
let cache = {
    data: null,
    timestamp: 0
};
const CACHE_TTL = 60 * 1000; // 1 minute cache

/**
 * Fetch token data from Bags.fm API
 */
async function fetchTokenData() {
    const apiKey = process.env.BAGS_API_KEY;
    
    if (!apiKey) {
        console.warn('BAGS_API_KEY not configured, returning mock data');
        return getMockData();
    }
    
    try {
        // Fetch lifetime fees
        const feesResponse = await fetch(
            `${BAGS_API_BASE}/token-launch/lifetime-fees?mint=${TOKEN_ADDRESS}`,
            {
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!feesResponse.ok) {
            console.error('Bags API error:', feesResponse.status);
            return getMockData();
        }
        
        const feesData = await feesResponse.json();
        
        return {
            success: true,
            token: {
                address: TOKEN_ADDRESS,
                symbol: '$TWATAIR',
                name: 'TwatAir Coin',
                tradingUrl: BAGS_TOKEN_URL,
                lifetimeFees: feesData.lifetimeFees || 0,
                // Add more fields as available from API
            },
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Failed to fetch from Bags API:', error);
        return getMockData();
    }
}

/**
 * Get mock data when API is unavailable
 */
function getMockData() {
    return {
        success: true,
        mock: true,
        token: {
            address: TOKEN_ADDRESS,
            symbol: '$TWATAIR',
            name: 'TwatAir Coin',
            tradingUrl: BAGS_TOKEN_URL,
            price: 0.0000420,
            priceChange24h: Math.random() * 20 - 10, // Random -10% to +10%
            marketCap: 420690,
            volume24h: 69420,
            totalSupply: 1000000000,
            circulatingSupply: 690000000,
            holders: 1337,
            lifetimeFees: 0
        },
        timestamp: Date.now()
    };
}

/**
 * Vercel serverless handler
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Check cache
        const now = Date.now();
        if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
            return res.status(200).json({
                ...cache.data,
                cached: true
            });
        }
        
        // Fetch fresh data
        const data = await fetchTokenData();
        
        // Update cache
        cache = {
            data,
            timestamp: now
        };
        
        return res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
