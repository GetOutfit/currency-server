# Currency Server

A lightweight and efficient currency exchange rate API service for [GetOutfit](https://github.com/GetOutfit). This server provides up-to-date currency exchange rates and conversion capabilities.

## Features

- Fetch latest exchange rates from a reliable source ([open.er-api.com](https://open.er-api.com/))
- Convert amounts between different currencies
- Daily automatic updates of exchange rates
- In-memory caching for fast responses
- Docker support for easy deployment
- CORS enabled for cross-origin access

## API Endpoints

### Get Exchange Rates

Retrieves the latest exchange rates for all available currencies.

```
GET /api/exchange-rates
```

**Response Example:**

```json
{
  "timestamp": 1743404619895,
  "rates": {
    "USD": 1,
    "EUR": 0.924209,
    "GBP": 0.773276,
    ...
  }
}
```

### Convert Currency

Converts an amount from one currency to another.

```
GET /api/convert?amount={amount}&from={fromCurrency}&to={toCurrency}
```

**Parameters:**
- `amount`: The amount to convert (numeric)
- `from`: Source currency code (e.g., USD)
- `to`: Target currency code (e.g., EUR)

**Response Example:**

```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "result": 92.42089999999999
}
```

## Setup and Installation

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Docker and Docker Compose (optional, for containerized deployment)

### Standard Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GetOutfit/currency-server.git
   cd currency-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=32118
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Docker Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GetOutfit/currency-server.git
   cd currency-server
   ```

2. Create a `.env` file in the root directory:
   ```
   PORT=32118
   ```

3. Build and start the Docker container:
   ```bash
   docker-compose up -d
   ```

## Development

### Running Tests

```bash
npm test
```

For continuous testing during development:
```bash
npm run test:watch
```

### Manual API Testing

You can use curl to test the API:

```bash
# Get exchange rates
curl "http://localhost:32118/api/exchange-rates" | jq

# Convert 100 USD to EUR
curl "http://localhost:32118/api/convert?amount=100&from=USD&to=EUR" | jq
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Missing or invalid parameters
- `503 Service Unavailable`: Server is initializing or exchange rates are not available

## License

ISC

## Author

Denis Bystruev (dbystruev@me.com)