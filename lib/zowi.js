const bluetooth = require('./bluetooth')();

module.exports = () => {

    let bluetoothInterface;
 
    const start = async () => {
        bluetoothInterface = await bluetooth.connect('Zowi');
        const obey = bluetoothInterface.writeMessage;
        const onClaim = bluetoothInterface.onMessage;
        return {
            obey,
            onClaim,
        };
    };

    const gestures = {
        'ZowiHappy': 'H 1',
        'ZowiSuperHappy': 'H 2',
        'ZowiSad': 'H 3',
        'ZowiSleeping': 'H 4',
        'ZowiFart': 'H 5',
        'ZowiConfused': 'H 6',
        'ZowiLove': 'H 7',
        'ZowiAngry': 'H 8',
        'ZowiFretful': 'H 9',
        'ZowiMagic': 'H 10',
        'ZowiWave': 'H 11',
        'ZowiVictory': 'H 12',
        'ZowiFail': 'H 13'
    };

    return {
        start,
        gestures,
    };
};