import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// allow origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173", // for dev
].filter(Boolean);


const PORT = process.env.PORT || 3000;
const app = express();

// Rate limiter storage: IP -> Array of timestamps
const ipRequests = new Map();

// Periodic cleanup of stale IP records every minute
setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of ipRequests.entries()) {
        const active = timestamps.filter(t => now - t < 60000);
        if (active.length === 0) {
            ipRequests.delete(ip);
        } else {
            ipRequests.set(ip, active);
        }
    }
}, 60000);

const RATE_LIMIT = 10;   // Max 10 searches per minute
const WINDOW_MS = 60000; // 1 minute window

// Rate limiting middleware
function rateLimiter(req, res, next) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(ip)) {
        ipRequests.set(ip, []);
    }

    // Filter to keep only requests made within the last minute
    const timestamps = ipRequests.get(ip).filter(t => now - t < WINDOW_MS);

    const remaining = Math.max(0, RATE_LIMIT - timestamps.length);
    const oldestTimestamp = timestamps[0] || now;
    const resetMs = oldestTimestamp + WINDOW_MS - now;
    const resetSeconds = Math.ceil(resetMs / 1000);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    req.rateLimit = {
        limit: RATE_LIMIT,
        remaining,
        resetSeconds
    };

    // If limit is exceeded, return 429 Too Many Requests
    if (timestamps.length >= RATE_LIMIT) {
        return res.status(429).json({
            status: 429,
            message: `Too many requests. You can perform ${RATE_LIMIT} searches per minute. Please try again in ${resetSeconds} seconds.`,
            rateLimit: {
                limit: RATE_LIMIT,
                remaining: 0,
                resetSeconds
            }
        });
    }

    // Record request timestamp
    timestamps.push(now);
    ipRequests.set(ip, timestamps);

    // Update remaining requests
    req.rateLimit.remaining = RATE_LIMIT - timestamps.length;
    res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining);

    next();
}

// Enable CORS for allowed origins
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Serve frontend SPA from static dist folder
app.use(express.static('dist'));

// API Routes
app.get('/health', (req, res) => res.json({
    status: 200,
    data: "api is working well updated via jenkins."
}));

app.get('/weather', rateLimiter, async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) {
            return res.status(400).json({
                status: 400,
                message: "City query parameter is required. Example: /weather?city=London",
                rateLimit: req.rateLimit
            });
        }

        // Call the free wttr.in weather API with JSON format (j1)
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);

        // If it's a non-500 HTTP error, throw to let the catch block handle it
        if (!response.ok && response.status !== 500) {
            throw new Error(`Weather service returned status ${response.status}`);
        }

        const text = await response.text();

        // Handle case where wttr.in returns 500 for not found locations
        if (response.status === 500 || text.trim().startsWith("location not found") || text.trim() === "") {
            if (text.toLowerCase().includes("location not found")) {
                return res.status(404).json({
                    status: 404,
                    message: `City "${city}" not found. Please check spelling or try a different location.`,
                    rateLimit: req.rateLimit
                });
            }
            throw new Error(`Weather service failed with status ${response.status}: ${text}`);
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(404).json({
                status: 404,
                message: `Unable to parse weather data for "${city}".`,
                rateLimit: req.rateLimit
            });
        }

        // If wttr.in payload lacks critical arrays
        if (!data.current_condition || !data.current_condition[0] || !data.nearest_area || !data.nearest_area[0]) {
            return res.status(404).json({
                status: 404,
                message: `City "${city}" not found. Please try a different location.`,
                rateLimit: req.rateLimit
            });
        }

        const current = data.current_condition[0];
        const location = data.nearest_area[0];

        // Format and return clean payload to frontend
        const formattedData = {
            city: location.areaName?.[0]?.value || city,
            country: location.country?.[0]?.value || '',
            region: location.region?.[0]?.value || '',
            current: {
                temp_C: current.temp_C,
                temp_F: current.temp_F,
                FeelsLikeC: current.FeelsLikeC,
                FeelsLikeF: current.FeelsLikeF,
                humidity: current.humidity,
                windspeedKmph: current.windspeedKmph,
                winddir16Point: current.winddir16Point,
                winddirDegree: current.winddirDegree,
                visibility: current.visibility,
                weatherDesc: current.weatherDesc?.[0]?.value?.trim() || 'Unknown',
                weatherIconUrl: current.weatherIconUrl?.[0]?.value || ''
            },
            rateLimit: req.rateLimit
        };

        return res.json(formattedData);

    } catch (error) {
        console.error('Error in /weather endpoint:', error);
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching the weather. Please try again later.",
            rateLimit: req.rateLimit
        });
    }
});

// Start server
app.listen(PORT, () => console.log(
    `Nimbus Weather App is running on port ${PORT} (http://localhost:${PORT})`
));