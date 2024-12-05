const request = require('supertest');
const { expect } = require('chai');
const { app, initPromise } = require('../app');

describe('Currency Exchange API', () => {
    // Wait for initialization before running tests
    before(async () => {
        await initPromise;
    });

    describe('GET /api/exchange-rates', () => {
        it('should return exchange rates', async () => {
            const res = await request(app)
                .get('/api/exchange-rates');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('rates');
            expect(res.body).to.have.property('timestamp');
            expect(res.body.rates).to.be.an('object');
        });
    });

    describe('GET /api/convert', () => {
        it('should convert USD to EUR', async () => {
            const res = await request(app)
                .get('/api/convert')
                .query({
                    amount: 100,
                    from: 'USD',
                    to: 'EUR'
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('result');
            expect(res.body.from).to.equal('USD');
            expect(res.body.to).to.equal('EUR');
            expect(res.body.amount).to.equal(100);
        });

        it('should handle invalid currency codes', async () => {
            const res = await request(app)
                .get('/api/convert')
                .query({
                    amount: 100,
                    from: 'INVALID',
                    to: 'EUR'
                });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
        });

        it('should handle missing parameters', async () => {
            const res = await request(app)
                .get('/api/convert')
                .query({
                    amount: 100,
                    from: 'USD'
                    // missing 'to' parameter
                });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
        });
    });
});