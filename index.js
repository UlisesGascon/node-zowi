const initIO = require('socket.io');
const {gestures} = require('./serial_interface')
const initServer = require('./lib/server');
const robot = require('./lib/zowi')();

const current = {
    distance: NaN,
    battery: NaN
}

const server = initServer(gestures, current);
const io = initIO(server);

(async () => {
    try {
        const { obey, onClaim } = await robot.start();
        server.listen(3000);
        io.on('connection', (socket) => {
            onClaim('data', (buffer) => {
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
                obey(Buffer.from(cmd, 'utf-8'), () => {
                    console.log(`[Server] said: ${cmd}`);
                    });
            });
    
            socket.on('zowi:gesture', data => {
                const {gesture} = data
                const currentGesture = gestures[gesture]
                if(currentGesture) {
                    const cmd = `${currentGesture} \r\n`
                    obey(Buffer.from(cmd, 'utf-8'), () => {
                        console.log(`[Server][Gesture] said: ${cmd}`);
                    });
                }
            
                console.log(gesture)
            })
        });

        setInterval(() => {
            const cmd = `D \r\n`
            obey(Buffer.from(cmd, 'utf-8'), () => {
                console.log(`[Server][Distance]: ${cmd}`);
            });           
        }, 100)

        setInterval(() => {
            const cmd = `B \r\n`
            obey(Buffer.from(cmd, 'utf-8'), () => {
                console.log(`[Server][Battery]: ${cmd}`);
            });
        }, 3000)

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();