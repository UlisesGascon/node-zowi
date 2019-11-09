const bluetooth = require('node-bluetooth');

module.exports = () => {
    let connection;
    const writeMessage = (output, handler) => {
        connection.write(output, handler);
    };
    
    const onMessage = (event, handler) => {
        connection.on(event, handler);
    };
    const connect = (id) => new Promise((resolve, reject) => {
        const device = new bluetooth.DeviceINQ();
        device.listPairedDevices((devices) => {
            const { address, services } = devices.find(({ name }) => name === id);
            const { channel } = services[0];
            bluetooth.connect(address, channel, (err, _connection) => {
                connection = _connection;
                return err ? reject(err): resolve({ 
                    onMessage,
                    writeMessage,
                });
            });
        });
    });


    return {
        connect
    };
};
