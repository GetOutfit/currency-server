const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Add initialization state
let isInitialized = false;

// In-memory cache for exchange rates
let ratesCache = {
    timestamp: 0,
    rates: {}
};

// Store interval reference so we can clear it if needed
let updateInterval;

// Export cleanup function for tests
function cleanup() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
}

// Function to start the update interval
function startUpdateInterval() {
    // Clear any existing interval
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Set new interval - run at midnight UTC
    updateInterval = setInterval(async () => {
        try {
            await updateExchangeRates();
        } catch (error) {
            console.error('Failed to update exchange rates:', error);
        }
    }, 24 * 60 * 60 * 1000);

    // Make interval available for cleanup
    return updateInterval;
}

// Function to fetch and cache new rates
async function updateExchangeRates() {
    try {
        const response = await axios.get('https://open.er-api.com/v6/latest');
        ratesCache = {
            timestamp: Date.now(),
            rates: response.data.rates
        };
        isInitialized = true;
        console.log('Exchange rates updated successfully');
    } catch (error) {
        console.error('Error updating exchange rates:', error.message);
        throw error;
    }
}

// Initialize rates
const initPromise = updateExchangeRates();

// Schedule daily updates
setInterval(updateExchangeRates, 24 * 60 * 60 * 1000);

// Endpoint to get latest rates
app.get('/api/exchange-rates', async (req, res) => {
    if (!isInitialized) {
        return res.status(503).json({ error: 'Service initializing' });
    }
    res.json(ratesCache);
});

// Endpoint to convert amount
app.get('/api/convert', async (req, res) => {
    if (!isInitialized) {
        return res.status(503).json({ error: 'Service initializing' });
    }

    const { amount, from, to } = req.query;

    if (!amount || !from || !to) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const rates = ratesCache.rates;
    if (!rates[from] || !rates[to]) {
        return res.status(400).json({ error: 'Invalid currency code' });
    }

    const convertedAmount = (amount * rates[to]) / rates[from];

    res.json({
        from,
        to,
        amount: Number(amount),
        result: convertedAmount
    });
});

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 32118;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Start interval only if running as main app (not in tests)
if (require.main === module) {
    startUpdateInterval();
}

// Update exports
module.exports = { app, initPromise, cleanup };