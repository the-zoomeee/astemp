const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/client1') {
        // Serve the static HTML file
        fs.readFile('client1.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading client1.html');
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    else if (req.url === '/') {
        // Serve the static HTML file
        res.end('<h1> Home - secure chat page</h1> <p>please visit /client1 and /client2 or usage</p>');
    } 
    else if (req.url === '/client2') {
        // Serve the static HTML file
        fs.readFile('client2.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading client2.html');
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    else 
    {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // Broadcast the received message to all clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString()); // Convert the message to string before sending
            }
        });
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
