#!/bin/bash
# tests/curl-tests.sh

# Text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Running curl tests for Currency Exchange API..."
echo "---------------------------------------------"

# Test 1: Get exchange rates
echo -e "\nTest 1: Getting exchange rates"
response=$(curl -s "http://localhost:32118/api/exchange-rates")
if [[ $response == *"rates"* ]]; then
    echo -e "${GREEN}✓ Exchange rates endpoint working${NC}"
else
    echo -e "${RED}✗ Exchange rates endpoint failed${NC}"
fi

# Test 2: Convert USD to EUR
echo -e "\nTest 2: Converting USD to EUR"
response=$(curl -s "http://localhost:32118/api/convert?amount=100&from=USD&to=EUR")
if [[ $response == *"result"* ]]; then
    echo -e "${GREEN}✓ USD to EUR conversion working${NC}"
else
    echo -e "${RED}✗ USD to EUR conversion failed${NC}"
fi

# Test 3: Test invalid currency
echo -e "\nTest 3: Testing invalid currency"
response=$(curl -s "http://localhost:32118/api/convert?amount=100&from=INVALID&to=EUR")
if [[ $response == *"error"* ]]; then
    echo -e "${GREEN}✓ Invalid currency handled correctly${NC}"
else
    echo -e "${RED}✗ Invalid currency test failed${NC}"
fi

# Test 4: Test missing parameters
echo -e "\nTest 4: Testing missing parameters"
response=$(curl -s "http://localhost:32118/api/convert?amount=100&from=USD")
if [[ $response == *"error"* ]]; then
    echo -e "${GREEN}✓ Missing parameters handled correctly${NC}"
else
    echo -e "${RED}✗ Missing parameters test failed${NC}"
fi

echo -e "\n---------------------------------------------"
echo "Curl tests completed"
