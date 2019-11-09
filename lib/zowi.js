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

    return {
        start,
    };
};