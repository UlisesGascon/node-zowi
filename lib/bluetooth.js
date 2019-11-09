const bluetooth = require('node-bluetooth');

const connect = (id) => new Promise((resolve, reject) => {
    const device = new bluetooth.DeviceINQ();
    device.listPairedDevices((devices) => {
        const { address, services } = devices.find(({ name }) => name === id);
        const { channel } = services[0];
        bluetooth.connect(address, channel, (err, connection) => {
            return err ? reject(err): resolve(connection);
        });
    });
});

module.exports = {
    connect,
};