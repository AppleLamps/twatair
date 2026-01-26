/**
 * Vercel Serverless Function - Token Information API
 * Uses the official Bags SDK to fetch token data
 */

import { BagsSDK } from '@bagsfm/bags-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

// Token configuration
const TOKEN_ADDRESS = '5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS';
const BAGS_TOKEN_URL = `https://bags.fm/${TOKEN_ADDRESS}`;
const WRAPPED_SOL_MINT = 'So11111111111111111111111111111111111111112';

// Token decimals
const SOL_DECIMALS = 9;
const TOKEN_DECIMALS = 6; // Most SPL tokens use 6 decimals

// Total supply (1 billion tokens)
const TOTAL_SUPPLY = 1_000_000_000;

// Simple in-memory cache (resets on cold start)
let cache = {
    data: null,
    timestamp: 0
};
const CACHE_TTL = 60 * 1000; // 1 minute cache

// Previous price for calculating 24h change
let previousPrice = null;

// SDK instance (lazy initialized)
let sdk = null;

/**
 * Initialize or get the Bags SDK instance
 */
function getSDK() {
    if (sdk) return sdk;
    
    const apiKey = process.env.BAGS_API_KEY;
    if (!apiKey) return null;
    
    // Use configured RPC or fall back to public endpoint
    // For production, use Helius or another reliable RPC provider
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');
    sdk = new BagsSDK(apiKey, connection, 'confirmed');
    
    return sdk;
}

/**
 * Get current SOL price in USD from CoinGecko
 */
async function getSolPrice() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
            { headers: { 'Accept': 'application/json' } }
        );
        if (!response.ok) return 150; // Fallback SOL price
        const data = await response.json();
        return data.solana?.usd || 150;
    } catch (error) {
        console.warn('Failed to fetch SOL price:', error);
        return 150; // Fallback
    }
}

/**
 * Fetch token data using Bags SDK
 */
async function fetchTokenData() {
    const bagsSDK = getSDK();
    
    if (!bagsSDK) {
        console.warn('BAGS_API_KEY not configured, returning mock data');
        return getMockData();
    }
    
    try {
        const tokenMint = new PublicKey(TOKEN_ADDRESS);
        const solMint = new PublicKey(WRAPPED_SOL_MINT);
        
        // Fetch data in parallel
        const [lifetimeFees, creators, quote, solPrice] = await Promise.all([
            bagsSDK.state.getTokenLifetimeFees(tokenMint).catch(() => 0),
            bagsSDK.state.getTokenCreators(tokenMint).catch(() => []),
            // Get quote for 1 SOL -> Token to derive price
            bagsSDK.trade.getQuote({
                inputMint: solMint,
                outputMint: tokenMint,
                amount: 1_000_000_000, // 1 SOL in lamports
                slippageMode: 'auto'
            }).catch((err) => {
                console.warn('Quote failed:', err.message);
                return null;
            }),
            getSolPrice()
        ]);
        
        // Calculate price from quote
        let price = 0;
        let priceInSol = 0;
        
        if (quote && quote.outAmount) {
            // outAmount is the number of tokens we get for 1 SOL
            const tokensPerSol = parseInt(quote.outAmount) / Math.pow(10, TOKEN_DECIMALS);
            if (tokensPerSol > 0) {
                priceInSol = 1 / tokensPerSol; // Price in SOL per token
                price = priceInSol * solPrice; // Price in USD
            }
        }
        
        // Calculate 24h change (approximate - based on previous fetch)
        let priceChange24h = 0;
        if (previousPrice && previousPrice > 0 && price > 0) {
            priceChange24h = ((price - previousPrice) / previousPrice) * 100;
        }
        previousPrice = price || previousPrice;
        
        // Calculate market cap
        const marketCap = price * TOTAL_SUPPLY;
        
        // Estimate 24h volume from lifetime fees (rough approximation)
        // Fees are typically 1% of volume, and lifetime / days active
        const lifetimeFeesInSol = lifetimeFees / 1_000_000_000;
        const volume24h = (lifetimeFeesInSol * solPrice) * 100 / 30; // Rough estimate
        
        return {
            success: true,
            token: {
                address: TOKEN_ADDRESS,
                symbol: '$TWATAIR',
                name: 'TwatAir Coin',
                tradingUrl: BAGS_TOKEN_URL,
                price: price,
                priceInSol: priceInSol,
                priceChange24h: priceChange24h,
                marketCap: marketCap,
                volume24h: volume24h,
                totalSupply: TOTAL_SUPPLY,
                circulatingSupply: Math.floor(TOTAL_SUPPLY * 0.69), // Estimate
                lifetimeFees: lifetimeFees || 0,
                lifetimeFeesUsd: (lifetimeFees / 1_000_000_000) * solPrice,
                creators: creators.length,
                solPrice: solPrice
            },
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Failed to fetch from Bags SDK:', error);
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
