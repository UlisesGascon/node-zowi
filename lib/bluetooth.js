const bluetooth = require('node-bluetooth');

const connect = (handler) => {
    const device = new bluetooth.DeviceINQ();
    device.listPairedDevices(console.log);
    /*
    [ { name: 'Zowi',
        address: 'b4-9d-0b-32-0a-1e',
        services: [ { channel: 1, name: 'SPP Dev' } ] } ]
    */
    const address = 'b4-9d-0b-33-8a-79';
    const channel = 1;
    bluetooth.connect(address, channel, handler);
};

module.exports = {
    connect,
};