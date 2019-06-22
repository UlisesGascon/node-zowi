const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bluetooth = require('node-bluetooth');
const path = require('path');

//Middleware
app.use(express.static(path.join(__dirname, 'public')))

// Rutas
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

const device = new bluetooth.DeviceINQ();
device.listPairedDevices(console.log);
/*
[ { name: 'Zowi',
    address: 'b4-9d-0b-32-0a-1e',
    services: [ { channel: 1, name: 'SPP Dev' } ] } ]
*/
const address = 'b4-9d-0b-32-0a-1e';
const channel = 1;

bluetooth.connect(address, channel, (err, connection) => {
    if(err) return console.error(err);
    
    server.listen(3000);

    io.on('connection', function (socket) {

        connection.on('data', (buffer) => {
            const data = buffer.toString()
            socket.emit('zowi:said', data);
            console.log('[Zowi] said:', data);
        });

        socket.on('zowi:cmd', function (data) {
            const {cmd} = data;
            connection.write(Buffer.from(cmd, 'utf-8'), () => {
                console.log(`[Server] said: ${cmd}`);
              });
        });
    });
  });