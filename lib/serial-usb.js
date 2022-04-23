const debug = require('debug')('zowi:serial')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const commands = require('./serial-commands')

const deviceUsbName = 'zowi'

module.exports = () => {
  let port

  const closeConnection = () => port.close()
  const writeMessage = (output) => {
    debug(`Sending message: ${output}`)
    return port.write(Buffer.from(output, 'utf-8'))
  }

  const onMessage = (event, handler) => {
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
    parser.on(event, msg => {
      debug(`Arrived message (${event}): ${msg}`)
      handler(msg)
    })
  }

  const getConnectionPath = (ports, deviceName) => {
    debug(`Checking best port possible for: ${deviceName}`)

    const selectedPort = ports.find(({ path }) => path.toLowerCase().includes(deviceName.toLowerCase()))
    if (!selectedPort) {
      throw new Error(`Device (${deviceName}) not found in available ports`)
    }
    return selectedPort.path
  }

  const robotAvailability = async () => new Promise((resolve, reject) => {
    const errorTimeout = setTimeout(reject, 10000) // Wait for 10 Segs

    onMessage('data', msg => {
      if (msg.match(/ZOWI_BASE_v2/gm)) {
        clearTimeout(errorTimeout)
        resolve()
      }
    })
  })

  const connect = async ({ timeout = 10000, baudRate = 57600 } = {}) => {
    debug('Starting connection')
    const ports = await SerialPort.list()
    const pathName = getConnectionPath(ports, deviceUsbName)
    port = new SerialPort({
      path: pathName,
      baudRate
    })

    debug('Connection has been stablished, waiting to Robot availability')

    await robotAvailability(timeout)

    debug('Robot it available. Now requesting vitals on initialization')
    await Promise.all([
      writeMessage(commands.general.requestName()),
      writeMessage(commands.general.requestDistanceMesurament()),
      writeMessage(commands.general.requestNoiseMesurament()),
      writeMessage(commands.general.requestBatteryMesurament()),
      writeMessage(commands.general.requestCurrentProgramId())
    ])

    return {
      closeConnection,
      writeMessage,
      onMessage
    }
  }

  return {
    connect
  }
}
