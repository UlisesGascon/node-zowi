const bluetooth = require('./bluetooth')();

module.exports = () => {

    let bluetoothInterface;
    let status = {
        distance: NaN,
        battery: NaN
    }

    const gestures = {
        'ZowiHappy': 'H 1 \r\n',
        'ZowiSuperHappy': 'H 2 \r\n',
        'ZowiSad': 'H 3 \r\n',
        'ZowiSleeping': 'H 4 \r\n',
        'ZowiFart': 'H 5 \r\n',
        'ZowiConfused': 'H 6 \r\n',
        'ZowiLove': 'H 7 \r\n',
        'ZowiAngry': 'H 8 \r\n',
        'ZowiFretful': 'H 9 \r\n',
        'ZowiMagic': 'H 10 \r\n',
        'ZowiWave': 'H 11 \r\n',
        'ZowiVictory': 'H 12 \r\n',
        'ZowiFail': 'H 13 \r\n',
    };
 
    const start = async () => {
        bluetoothInterface = await bluetooth.connect('Zowi');
        const obey = command => async () => new Promise((resolve, reject) => {
            const commands = {
                'request-distance': 'D \r\n',
                'request-battery': 'B \r\n',
                ...gestures,
            };
            if (!commands[command]) return reject(new Error(`Command ${command} non found!`));
            bluetoothInterface.writeMessage(Buffer.from(commands[command], 'utf-8'), resolve);      
        });
        const onClaim = bluetoothInterface.onMessage;
        const inject = cmd => new Promise(resolve => {
            bluetoothInterface.writeMessage(Buffer.from(cmd, 'utf-8'), resolve);
        });

        const setHealth = amendment => {
            status = {
                ...status,
                ...amendment,
            }
        }

        const digest = async (data) => {
            const regexDistance = /\&D (.*\d[1-9])\%/gm;
            const result = [
                {
                    key: 'zowi:status',
                    data: status
                }
            ];
            if(data.match(regexDistance)) {
                setHealth({
                    distance: parseInt(data.split(regexDistance)[1]),
                });
                return result.concat({
                    key: 'zowi:distance',
                    data: status.distance
                });
            }

            const regexBattery = /\&B (.*\d[1-9])\%/gm
            if(data.match(regexBattery)) {
                setHealth({
                    battery: parseFloat(data.split(regexBattery)[1]),
                });
                return result.concat({
                    key: 'zowi:battery',
                    data: status.battery
                });
            }
            return result;
        };

        return {
            obey,
            onClaim,
            inject,
            digest,
            health: () => status,
        };
    };

    return {
        start,
        gestures,
    };
};