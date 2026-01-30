/**
 * Test that the built backend app responds to GET /health (no MongoDB required).
 * Run from backend: node scripts/test-health.js
 */
const http = require('http');

const app = require('../dist/app').default;
const server = http.createServer(app);

server.listen(0, () => {
  const port = server.address().port;
  const url = `http://localhost:${port}/health`;

  const req = http.get(url, (res) => {
    let data = '';
    res.on('data', (ch) => (data += ch));
    res.on('end', () => {
      clearTimeout(t);
      server.close();
      try {
        const json = JSON.parse(data);
        if (res.statusCode === 200 && json.status === 'OK') {
          console.log('✅ Backend health check passed:', json);
          process.exit(0);
        }
      } catch (e) {
        console.error('❌ Invalid JSON response:', data);
        process.exit(1);
      }
      console.error('❌ Health check failed:', res.statusCode, data);
      process.exit(1);
    });
  });
  const t = setTimeout(() => {
    req.destroy();
    server.close();
    console.error('❌ Health check timed out');
    process.exit(1);
  }, 5000);
  req.on('error', (err) => {
    clearTimeout(t);
    server.close();
    console.error('❌ Request failed:', err.message);
    process.exit(1);
  });
});
