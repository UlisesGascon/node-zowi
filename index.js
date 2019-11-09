const initIO = require('socket.io');
const initServer = require('./lib/server');
const robot = require('./lib/zowi')();

const current = {
    distance: NaN,
    battery: NaN
}

const server = initServer(robot.gestures, current);
const io = initIO(server);

(async () => {
    try {
        const zowi = await robot.start();
        server.listen(3000);
        io.on('connection', (socket) => {
            zowi.onClaim('data', (buffer) => {
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
    
                // console.log('[Zowi] said:', data);
            });
    
            socket.on('zowi:cmd', async ({ cmd }) => {
                await zowi.inject(cmd);
                console.log(`[Server] said: ${cmd}`);
            });
    
            socket.on('zowi:gesture', async ({ gesture }) => {
                const requestGesture = zowi.obey(gesture);
                await requestGesture();
                console.log(`Requesting gesture ${gesture}...`);
        
            })
        });

        setInterval(async () => {
            const requestDistance = zowi.obey('request-distance');
            await requestDistance();
            // console.log('Just request distance for the robot');
        }, 100)

        setInterval(async () => {
            const requestBattery = zowi.obey('request-battery');
            await requestBattery();
            // console.log('Just request battery for the robot');
        }, 3000)

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();