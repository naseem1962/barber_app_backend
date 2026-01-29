const mongoose = require('mongoose');

// Connect to MongoDB (Vercel serverless - connection is cached per invocation)
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI).catch((err) => console.error('MongoDB connect error:', err.message));
}

// Load the built Express app (built by npm run build -> dist/app.js)
const app = require('../dist/app').default;

module.exports = app;
