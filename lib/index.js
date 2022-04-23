const debug = require('debug')('zowi')
const serial = require('./serial-usb')()
const commands = require('./serial-commands')
const { digest } = require('./serial-digest')

module.exports = () => {
  let serialInterface
  let status = {
    distance: NaN,
    battery: NaN,
    noise: NaN
  }

  const setHealth = amendment => {
    debug(`Updating status with amendment ${JSON.stringify(amendment)}`)
    status = {
      ...status,
      ...amendment
    }
  }

  const start = async ({
    checkVitals = false,
    vitalsfreq = 500
  } = {}) => {
    debug('Starting')
    serialInterface = await serial.connect()

    const onClaim = (handler) => serialInterface.onMessage('data', handler)
    const obey = command => serialInterface.writeMessage(command)

    debug('Preparing general event digestion')
    // Update system status
    onClaim((msg) => {
      const result = digest(msg)
      if (result) {
        setHealth(result)
      }
    })

    debug('Checking the need for Vitals')
    // Keep vitals
    if (checkVitals) {
      debug(`Checking vitals enabled with frequency: ${vitalsfreq}`)
      setInterval(async () => {
        debug('Requesting Checking vitals update')
        await Promise.all([
          obey(commands.general.requestDistanceMesurament()),
          obey(commands.general.requestNoiseMesurament()),
          obey(commands.general.requestBatteryMesurament())
        ])
      }, vitalsfreq)
    }

    debug('Adding exit control')
    // Control exit
    const exitHandler = async () => {
      debug('Stopping robot due exit handler event')
      process.stdin.resume()
      await serialInterface.closeConnection()
      debug('Robot connection close. Time to close')
      process.exit(1)
    }

    // When app is closing
    process.on('exit', exitHandler)

    // Catches ctrl+c event
    process.on('SIGINT', exitHandler)

    // Catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler)
    process.on('SIGUSR2', exitHandler)

    // Catches uncaught exceptions
    process.on('uncaughtException', exitHandler)

    return {
      getHealth: () => status,
      onClaim,
      obey,
      close: serialInterface.closeConnection
    }
  }

  return {
    start,
    commands
  }
}
