const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bluetooth = require('node-bluetooth');
const path = require('path');
const {gestures} = require('./serial_interface')

const current = {
    distance: NaN,
    battery: NaN
}

//Middleware
app.use(express.static(path.join(__dirname, 'public')))

// Rutas
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/gestures', (req, res) => {
    const data = Object.keys(gestures)
    res.json(data)
})

app.get('/api/status/:component?', (req, res) => {
    const component = req.params.component
    if(component) {
        return res.json(current[component])
    }

    res.json(current)
})

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

            const regexDistance = /\&D (.*\d[1-9])\%/gm
            if(data.match(regexDistance)) {
                current.distance = parseInt(data.split(regexDistance)[1])
                socket.emit('zowi:distance', current.distance)
                socket.emit('zowi:status', current)
            }

            const regexBattery = /\&B (.*\d[1-9])\%/gm
            if(data.match(regexBattery)) {
                current.battery = parseFloat(data.split(regexBattery)[1])
                socket.emit('zowi:battery', current.battery)
                socket.emit('zowi:status', current)
            }           

            console.log('[Zowi] said:', data);
        });

        socket.on('zowi:cmd', data => {
            const {cmd} = data;
            connection.write(Buffer.from(cmd, 'utf-8'), () => {
                console.log(`[Server] said: ${cmd}`);
              });
        });

        socket.on('zowi:gesture', data => {
            const {gesture} = data
            const currenGesture = gestures[gesture]
            if(currenGesture) {
                const cmd = `${currenGesture} \r\n`
                connection.write(Buffer.from(cmd, 'utf-8'), () => {
                    console.log(`[Server][Gesture] said: ${cmd}`);
                });
            }
       
            console.log(gesture)
        })

        setInterval(() => {
            const cmd = `D \r\n`
            connection.write(Buffer.from(cmd, 'utf-8'), () => {
                console.log(`[Server][Distance]: ${cmd}`);
            });           
        }, 100)

        setInterval(() => {
            const cmd = `B \r\n`
            connection.write(Buffer.from(cmd, 'utf-8'), () => {
                console.log(`[Server][Battery]: ${cmd}`);
            });
        }, 3000)

    });
  });



