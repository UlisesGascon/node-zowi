const bluetooth = require('node-bluetooth');

const connect = (id, handler) => {
    const device = new bluetooth.DeviceINQ();
    device.listPairedDevices((devices) => {
        const { address, services } = devices.find(({ name }) => name === id);
        const { channel } = services[0];
        bluetooth.connect(address, channel, handler);
    });
};

module.exports = {
    connect,
};