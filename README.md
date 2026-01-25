# TwatAir

A satirical airline parody website featuring the $TWATAIR meme coin integration on Solana via [Bags.fm](https://bags.fm).

## Live Demo

Visit: [Your Vercel URL here]

## Features

- Multi-page static site with dynamic JavaScript modules
- $TWATAIR meme coin integration via Bags.fm
- Real-time crypto price ticker
- Flight booking parody with absurd fees
- Responsive design with custom SVG icons
- Vercel serverless API for token data

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, ES Modules
- **Backend**: Vercel Serverless Functions (Node.js)
- **Crypto**: Solana token via Bags.fm API
- **Fonts**: Google Fonts (Montserrat)

## Project Structure

```
twatair/
├── api/                    # Vercel serverless functions
│   ├── token.js           # Token data endpoint
│   └── health.js          # Health check endpoint
├── css/
│   └── styles.css         # Main stylesheet
├── js/modules/
│   ├── app.js             # Main app entry point
│   ├── header.js          # Header component
│   ├── footer.js          # Footer component
│   ├── hero.js            # Homepage hero section
│   ├── nav.js             # Navigation component
│   ├── coin.js            # Coin page module
│   ├── cryptoTicker.js    # Crypto price ticker
│   ├── tokenApi.js        # Token API service
│   ├── icons.js           # SVG icon definitions
│   └── utils.js           # Shared utilities
├── *.html                  # Page templates
├── vercel.json            # Vercel configuration
├── package.json           # Project metadata
└── .env.example           # Environment template
```

## $TWATAIR Token

- **Address**: `5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS`
- **Trade**: [bags.fm/5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS](https://bags.fm/5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS)
- **Network**: Solana

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd twatair
   ```

2. **Start local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js (with Vercel CLI for API)
   npm install -g vercel
   vercel dev
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Set environment variables**
   
   In your Vercel project dashboard, add:
   - `BAGS_API_KEY` - Your Bags.fm API key from [dev.bags.fm](https://dev.bags.fm)

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BAGS_API_KEY` | Bags.fm API key for token data | Optional* |

*If not set, the API returns mock data.

## API Endpoints

### GET /api/token

Returns $TWATAIR token information.

**Response:**
```json
{
  "success": true,
  "token": {
    "address": "5rRs4RckuE19GQ3CtN3Ju4CTRtAahTHuuEuQYqhfBAGS",
    "symbol": "$TWATAIR",
    "name": "TwatAir Coin",
    "tradingUrl": "https://bags.fm/...",
    "price": 0.0000420,
    "marketCap": 420690,
    "volume24h": 69420
  },
  "timestamp": 1706123456789
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1706123456789,
  "version": "1.0.0"
}
```

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage with hero and booking preview |
| `book.html` | Flight booking parody |
| `destinations.html` | Destination listings |
| `fees.html` | Absurd fee calculator |
| `coin.html` | $TWATAIR coin page |
| `about.html` | About page |
| `contact.html` | Contact form |

## Disclaimer

This is a satirical parody website. $TWATAIR is a meme coin with no intrinsic value. Not affiliated with Ryanair, Michael O'Leary, or Elon Musk. Invest at your own risk. This is not financial advice.

## License

MIT
