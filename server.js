// server.js

const express = require('express');
const https = require('https');
const fs = require('fs');
const next = require('next');

// Set the environment variable for Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Read the self-signed certificate and key
  const privateKey = fs.readFileSync('server.key', 'utf8');
  const certificate = fs.readFileSync('server.cert', 'utf8');
  const ca = fs.readFileSync('server.cert', 'utf8');  // You may need the certificate as a CA for the browser

  const credentials = { key: privateKey, cert: certificate, ca: ca };

  // Serve Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Create an HTTPS server with the credentials
  https.createServer(credentials, server).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Server listening on https://localhost:3000');
  });
});
