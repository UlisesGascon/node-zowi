const initIO = require('socket.io');
const {gestures} = require('./serial_interface')
const initServer = require('./lib/server');
const bluetooth = require('./lib/bluetooth');

const current = {
    distance: NaN,
    battery: NaN
}

const server = initServer(gestures, current);
const io = initIO(server);

const handler = (err, connection) => {
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
            const currentGesture = gestures[gesture]
            if(currentGesture) {
                const cmd = `${currentGesture} \r\n`
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
  };

  bluetooth.connect(handler);