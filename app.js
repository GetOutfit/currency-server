// Required dependencies
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory cache for exchange rates
let ratesCache = {
    timestamp: 0,
    rates: {}
};

// Function to fetch and cache new rates
async function updateExchangeRates() {
    try {
        const response = await axios.get('https://open.er-api.com/v6/latest');
        ratesCache = {
            timestamp: Date.now(),
            rates: response.data.rates
        };
        console.log('Exchange rates updated successfully');
    } catch (error) {
        console.error('Error updating exchange rates:', error.message);
    }
}

// Update rates once when server starts
updateExchangeRates();

// Schedule daily updates
setInterval(updateExchangeRates, 24 * 60 * 60 * 1000);

// Endpoint to get latest rates
app.get('/api/exchange-rates', (req, res) => {
    res.json(ratesCache);
});

// Endpoint to convert amount
app.get('/api/convert', (req, res) => {
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

const PORT = process.env.PORT || 32118;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});