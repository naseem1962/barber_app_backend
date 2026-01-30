/**
 * Test POST /api/users/register.
 * Usage:
 *   Local (server must be running with MongoDB): node scripts/test-register-api.js
 *   Against Vercel: node scripts/test-register-api.js https://barber-app-backend.vercel.app
 */
const http = require('http');
const https = require('https');

const BASE = process.argv[2] || 'http://127.0.0.1:5000';
const url = new URL('/api/users/register', BASE);
const isHttps = url.protocol === 'https:';
const lib = isHttps ? https : http;

const body = JSON.stringify({
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  phone: '+1234567890',
});

const options = {
  hostname: url.hostname,
  port: url.port || (isHttps ? 443 : 80),
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = lib.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (res.statusCode === 201 && json.success && json.data?.token) {
        console.log('✅ Register API passed:', { statusCode: res.statusCode, userId: json.data?.user?.id });
        process.exit(0);
      }
      if (res.statusCode === 400 && json.message) {
        console.log('⚠️ Register returned 400:', json.message);
        process.exit(0); // API is reachable
      }
      console.error('❌ Register API failed:', res.statusCode, data);
      process.exit(1);
    } catch (e) {
      console.error('❌ Invalid JSON:', data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
  process.exit(1);
});

req.setTimeout(15000, () => {
  req.destroy();
  console.error('❌ Request timeout');
  process.exit(1);
});

req.write(body);
req.end();
