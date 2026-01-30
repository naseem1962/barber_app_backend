/**
 * Test that the built Express app responds to GET /health.
 * Does not start the full server (no MongoDB). Run after: npm run build
 * Usage: node scripts/test-health.js
 */
const http = require('http');

const app = require('../dist/app').default;
const server = http.createServer(app);

server.listen(0, () => {
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/health`;

  http
    .get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        server.close();
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 && json.status === 'OK') {
            console.log('✅ Backend health check passed:', json);
            process.exit(0);
          }
        } catch (e) {
          console.error('❌ Invalid health response:', data);
          process.exit(1);
        }
        console.error('❌ Health check failed:', res.statusCode, data);
        process.exit(1);
      });
    })
    .on('error', (err) => {
      server.close();
      console.error('❌ Request error:', err.message);
      process.exit(1);
    });
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});
