const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
/*
SerialPort.list().then(ports => {
    console.log(ports)                
})
*/

const path = `/dev/tty.Zowi-SPPDev`
const port = new SerialPort(path, { baudRate: 256000 })

const parser = new Readline()
port.pipe(parser)

parser.on('data', line => console.log(`> ${line}`))
port.write('ROBOT POWER ON\n')
//> ROBOT ONLINE
