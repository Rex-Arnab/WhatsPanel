const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const io = require('socket.io')(3000); // Assuming you want to use port 3000 for Socket.IO

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

client.on('message_create', message => {
    if (message.body === '!ping') {
        // send back "pong" to the chat the message was sent in
        // client.sendMessage(message.from, 'pong');
        message.reply('pong');
    }

    // Emit the received message to Socket.IO clients
    io.emit('message', message.body);
});

// Start your client
client.initialize();