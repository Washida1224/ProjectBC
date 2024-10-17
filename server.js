const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 10000 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // メッセージをすべてのクライアントに中継
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
});
