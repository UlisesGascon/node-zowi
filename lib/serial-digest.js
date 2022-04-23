const dataRegex = {
  distance: /&D (.*)%%/gm,
  battery: /&B (.*)%%/gm,
  name: /&E (.*)%%/gm,
  noise: /&N (.*)%%/gm,
  mode: /&I (.*)%%/gm
}

const modes = [
  'awaiting', // * MODE = 0: Zowi is awaiting
  'dancing', // * MODE = 1: Dancing mode!
  'obstacle detection', // * MODE = 2: Obstacle detector mode
  'noise detector', // * MODE = 3: Noise detector mode
  'teleoperation' // * MODE = 4: ZowiPAD or any Teleoperation mode (listening SerialPort).
]

const digest = (data) => {
  let result
  // Distance
  if (data.match(dataRegex.distance)) {
    result = { distance: parseInt(data.split(dataRegex.distance)[1]) }
  }

  // Battery
  if (data.match(dataRegex.battery)) {
    result = { battery: parseFloat(data.split(dataRegex.battery)[1]) }
  }

  // Mode
  if (data.match(dataRegex.mode)) {
    result = { mode: modes[parseInt(data.split(dataRegex.mode)[1])] || undefined }
  }

  // Noise
  if (data.match(dataRegex.noise)) {
    result = { noise: parseInt(data.split(dataRegex.noise)[1]) }
  }

  // Name
  if (data.match(dataRegex.name)) {
    result = { name: data.split(dataRegex.name)[1] }
  }

  return result
}

module.exports = {
  digest
}
