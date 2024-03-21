const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3001",
    }
});


// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth()
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
});

client.on('message_create', message => {
    console.log(`New message from ${message.from}: ${message.body}`)
    if (message.body === '!ping') {
        // send back "pong" to the chat the message was sent in
        // client.sendMessage(message.from, 'pong');
        message.reply('pong');
    }

    // Emit the received message to Socket.IO clients
    io.emit('message', message);
});

app.get('/', (req, res) => {
    res.send('Server is running!');
    io.emit('message', 'Hello World');
});

io.on('disconnect', (socket) => {
    console.log(`Socket disconnected: ${socket.id}`);
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    client.initialize();
    console.log(`Server is running on port ${PORT}`);
});