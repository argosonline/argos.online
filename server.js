const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 10000; // Renderが指定するポートを使用

// サーバーは1回だけリッスンする
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const rooms = {}; // ルームの状態を保存

// CORS設定
app.use(cors({
    origin: 'https://argosonline.github.io' // フロントエンドのURL
}));

// JSONのリクエストボディをパース
app.use(express.json());

// ルーム作成API
app.post('/create-room', (req, res) => {
    const password = req.query.password;
    if (!rooms[password]) {
        rooms[password] = { broadcaster: null, viewers: [] };
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
});

// ルーム存在確認API
app.get('/check-room', (req, res) => {
    const password = req.query.password;
    if (rooms[password]) {
        return res.json({ exists: true });
    } else {
        return res.json({ exists: false });
    }
});

io.on('connection', (socket) => {
    socket.on('joinRoom', (password, role) => {
        if (role === 'broadcaster') {
            // 配信者としてルームを作成
            if (!rooms[password].broadcaster) {
                rooms[password].broadcaster = socket.id;
                socket.join(password);
                socket.emit('roomCreated', password);
            } else {
                socket.emit('error', 'Room already exists.');
            }
        } else if (role === 'viewer') {
            // 視聴者としてルームに参加
            if (rooms[password] && rooms[password].broadcaster) {
                rooms[password].viewers.push(socket.id);
                socket.join(password);
                socket.emit('joinedRoom', password);
            } else {
                socket.emit('error', 'Room not found.');
            }
        }
    });

    socket.on('disconnect', () => {
        // ルームの管理とクリーニング
        for (const password in rooms) {
            const room = rooms[password];
            if (room.broadcaster === socket.id) {
                delete rooms[password]; // 配信者が切断されたらルームを削除
            } else {
                room.viewers = room.viewers.filter(viewer => viewer !== socket.id);
            }
        }
    });
});
