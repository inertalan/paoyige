const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
  };
}

function proxyRequest(req, res, apiUrl, headers) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const parsed = new URL(apiUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
    };
    const proxyReq = https.request(options, proxyRes => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        });
        res.end(data);
      });
    });
    proxyReq.on('error', e => {
      res.writeHead(500, corsHeaders());
      res.end(JSON.stringify({ error: e.message }));
    });
    proxyReq.write(body);
    proxyReq.end();
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders());
    return res.end();
  }

  // API proxy
  if (parsed.pathname === '/api/proxy') {
    const target = parsed.query.target;
    if (target === 'claude') {
      proxyRequest(req, res, 'https://api.anthropic.com/v1/messages', {
        'Content-Type': 'application/json',
        'x-api-key': req.headers['x-api-key'],
        'anthropic-version': '2023-06-01',
      });
    } else {
      proxyRequest(req, res, 'https://api.moonshot.cn/v1/chat/completions', {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization'],
      });
    }
    return;
  }

  // Serve static files
  let filePath = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
  filePath = path.join(__dirname, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Paoyige running on port ${PORT}`));
