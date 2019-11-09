const bluetooth = require('./bluetooth')();

module.exports = () => {

    let bluetoothInterface;
 
    const start = async () => {
        bluetoothInterface = await bluetooth.connect('Zowi');
        return bluetoothInterface;
    };

    return {
        start,
    };
};