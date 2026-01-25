/**
 * Vercel Serverless Function - Health Check
 */

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).json({
        status: 'ok',
        timestamp: Date.now(),
        version: '1.0.0',
        endpoints: {
            token: '/api/token',
            health: '/api/health'
        }
    });
}
