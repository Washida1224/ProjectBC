const WebSocket = require('ws');
const http = require('http');

// HTTPサーバーを作成
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    ws.on('message', (message) => {
        // 受け取ったメッセージを他の全クライアントにブロードキャスト
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index > -1) {
            clients.splice(index, 1);
        }
    });
});

// ポート番号3000でサーバーをリッスン
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`シグナリングサーバーがポート ${PORT} で起動しました`);
});

