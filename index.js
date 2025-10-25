const express = require('express');
const app = express();
const PORT = 3000;

// -----------------------------------------------------------------
// Task 1: Logging Middleware
// -----------------------------------------------------------------
// This middleware logs the method, URL, and timestamp for EVERY request.
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`[${timestamp}] ${method} ${url}`);
  
  // Call next() to pass control to the next middleware or route handler
  next();
};

// -----------------------------------------------------------------
// Task 2: Bearer Token Authentication Middleware
// -----------------------------------------------------------------
// This middleware checks for a valid Bearer token.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const secretToken = 'mysecrettoken';

  // 1. Check if the Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing or incorrect' });
  }

  // 2. Check if the header is in the format "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Authorization header missing or incorrect' });
  }

  // 3. Check if the token is correct
  const token = parts[1];
  if (token === secretToken) {
    // Token is valid! Pass control to the next handler
    next();
  } else {
    // Token is invalid
    return res.status(401).json({ message: 'Authorization header missing or incorrect' });
  }
};

// -----------------------------------------------------------------
// Applying Middleware & Routes
// -----------------------------------------------------------------

// Apply the logging middleware globally to ALL routes
app.use(loggerMiddleware);

// Route 1: Public Route
// This route does NOT use the authMiddleware.
app.get('/public', (req, res) => {
  res.status(200).send('This is a public route. No authentication required.');
});

// Route 2: Protected Route
// This route FIRST runs the authMiddleware.
// If authMiddleware calls next(), the route handler (req, res) => {...} will run.
// If it doesn't, the request will be ended by the middleware with a 401.
app.get('/protected', authMiddleware, (req, res) => {
  res.status(200).send('You have accessed a protected route with a valid Bearer token!');
});

// -----------------------------------------------------------------
// Start the Server
// -----------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
