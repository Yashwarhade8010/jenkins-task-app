const request = require('supertest');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

test('GET / returns welcome message', async () => {
    const response = await request(app).get('/');

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      message: "Welcome to Jenkins Task App! testing",
      version: "1.0.0",
    });
});

test('GET /health returns healthy status', async () => {
    const response = await request(app).get('/health');

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
        status: 'healthy'
    });
});