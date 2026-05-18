/**
 * ── BetaZenX Website Integration Config ──────────────────────────────
 * Edit these configurations to deploy the static website completely independently
 * on another server (Vercel, Netlify, cPanel, GitHub Pages, etc.)!
 */
const BETAZENX_CONFIG = {
    // 1. Google Gemini API Key for client-side chatbot (Fully standalone!)
    geminiApiKey: "AIzaSyABjBNGIt17pQbTc0mHFi9gUix4XCW0ZQQ",

    // 2. School metadata & integration settings
    slug: "cobschool",                           // Unique slug of the school
    apiKey: "betazenx_api_nba_2026_xZ9q",        // Public client integration API Key
    
    // 3. Environment & Deployment URLs
    deployMode: true,                            // Set to true for live server, false for local development
    prodBaseUrl: "https://betazenx.online",       // Production ERP domain
    localBaseUrl: "http://localhost:3000",        // Local Next.js port
    
    prodApiUrl: "https://betazenx.online/api",    // Production API domain
    localApiUrl: "http://localhost:5000/api",     // Local backend API port
};
