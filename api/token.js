/**
 * Vercel Serverless Function - Token Information API
 * Uses the DexScreener API to fetch live token market data
 */

// Token configuration
const TOKEN_ADDRESS = 'J7gpq8G5L9VzHF7FZzL679Miw1KQ1HHmCgxavCEqpump';
const TRADING_URL = `https://pump.fun/coin/${TOKEN_ADDRESS}`;
const DEXSCREENER_TOKEN_PAIRS_URL = `https://api.dexscreener.com/token-pairs/v1/solana/${TOKEN_ADDRESS}`;

// Total supply (1 billion tokens)
const TOTAL_SUPPLY = 1_000_000_000;

// Simple in-memory cache (resets on cold start)
let cache = {
    data: null,
    timestamp: 0
};
const CACHE_TTL = 60 * 1000; // 1 minute cache

/**
 * Safely parse numeric values from APIs that may return strings or numbers.
 * @param {number|string|null|undefined} value
 * @returns {number}
 */
function toNumber(value) {
    const parsed = typeof value === 'number' ? value : Number.parseFloat(value || '0');
    return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Select the most relevant pair for the token.
 * Prefer Pump.fun while on curve, otherwise use the pair with the deepest liquidity.
 * @param {Array} pairs
 * @returns {Object|null}
 */
function selectBestPair(pairs) {
    if (!Array.isArray(pairs) || pairs.length === 0) {
        return null;
    }

    const relevantPairs = pairs.filter((pair) => {
        const baseAddress = pair?.baseToken?.address;
        const quoteAddress = pair?.quoteToken?.address;

        return baseAddress === TOKEN_ADDRESS || quoteAddress === TOKEN_ADDRESS;
    });

    if (relevantPairs.length === 0) {
        return null;
    }

    return relevantPairs.sort((left, right) => {
        const leftPumpScore = left?.dexId === 'pumpfun' ? 1 : 0;
        const rightPumpScore = right?.dexId === 'pumpfun' ? 1 : 0;
        if (rightPumpScore !== leftPumpScore) {
            return rightPumpScore - leftPumpScore;
        }

        const leftLiquidity = toNumber(left?.liquidity?.usd);
        const rightLiquidity = toNumber(right?.liquidity?.usd);
        if (rightLiquidity !== leftLiquidity) {
            return rightLiquidity - leftLiquidity;
        }

        const leftVolume = toNumber(left?.volume?.h24);
        const rightVolume = toNumber(right?.volume?.h24);
        if (rightVolume !== leftVolume) {
            return rightVolume - leftVolume;
        }

        return toNumber(right?.pairCreatedAt) - toNumber(left?.pairCreatedAt);
    })[0];
}

/**
 * Fetch token data using DexScreener public market data.
 */
async function fetchTokenData() {
    try {
        const response = await fetch(DEXSCREENER_TOKEN_PAIRS_URL, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`DexScreener request failed with status ${response.status}`);
        }

        const pairs = await response.json();
        const pair = selectBestPair(pairs);

        if (!pair) {
            throw new Error('No DexScreener pair data found for token');
        }

        const price = toNumber(pair.priceUsd);
        const priceInSol = toNumber(pair.priceNative);
        const marketCap = toNumber(pair.marketCap) || toNumber(pair.fdv) || (price * TOTAL_SUPPLY);
        const volume24h = toNumber(pair?.volume?.h24);
        const priceChange24h = toNumber(pair?.priceChange?.h24);
        const liquidityUsd = toNumber(pair?.liquidity?.usd);
        const derivedSolPrice = priceInSol > 0 ? price / priceInSol : 0;

        return {
            success: true,
            token: {
                address: TOKEN_ADDRESS,
                symbol: '$TWATAIR',
                name: 'TwatAir Coin',
                tradingUrl: TRADING_URL,
                price,
                priceInSol,
                priceChange24h,
                marketCap,
                volume24h,
                totalSupply: TOTAL_SUPPLY,
                circulatingSupply: TOTAL_SUPPLY,
                holders: null,
                liquidityUsd,
                dexId: pair.dexId || 'pumpfun',
                pairAddress: pair.pairAddress || null,
                dexScreenerUrl: pair.url || null,
                imageUrl: pair?.info?.imageUrl || null,
                solPrice: derivedSolPrice,
                source: 'dexscreener'
            },
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Failed to fetch from DexScreener:', error);
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
            tradingUrl: TRADING_URL,
            price: 0.0000420,
            priceChange24h: Math.random() * 20 - 10, // Random -10% to +10%
            marketCap: 420690,
            volume24h: 69420,
            totalSupply: 1000000000,
            circulatingSupply: 1000000000,
            holders: 1337,
            liquidityUsd: 2500,
            dexId: 'pumpfun',
            pairAddress: null,
            dexScreenerUrl: null,
            imageUrl: null,
            solPrice: 0,
            source: 'mock'
        },
        timestamp: Date.now()
    };
}

/**
 * Vercel serverless handler
 */
export default async function handler(req, res) {
    // CORS headers
    // TODO: In production, replace '*' with your actual domain(s):
    // res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
    const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
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
