const bluetooth = require('node-bluetooth');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();

const zowiBluetooth =  device.listPairedDevices(console.log);
/*
[ { name: 'Zowi',
    address: 'b4-9d-0b-32-0a-1e',
    services: [ { channel: 1, name: 'SPP Dev' } ] } ]
*/
const address = 'b4-9d-0b-32-0a-1e';
const channel = 1;


bluetooth.connect(address, channel, (err, connection) => {
    if(err) return console.error(err);
   
    connection.on('data', (buffer) => {
      console.log('[Zowi] said:', buffer.toString());
    });
   
    setTimeout(() => {
        const cmd = "K 11 \r\n"
        connection.write(Buffer.from(cmd, 'utf-8'), () => {
          console.log(cmd);
        });
    }, 5000)

  });