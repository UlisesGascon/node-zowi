// @SEE: Abstraction from https://github.com/JavierIH/zowi/blob/master/code/zowi_app/zowi_app.ino and http://diwo.bq.com/zowi-telegram-bot/
const formatCommand = cmd => `${cmd} \r\n`

const gestures = {
  happy: () => formatCommand('H 1'),
  superHappy: () => formatCommand('H 2'),
  sad: () => formatCommand('H 3'),
  sleeping: () => formatCommand('H 4'),
  fart: () => formatCommand('H 5'),
  confused: () => formatCommand('H 6'),
  love: () => formatCommand('H 7'),
  angry: () => formatCommand('H 8'),
  fretful: () => formatCommand('H 9'),
  magic: () => formatCommand('H 10'),
  crazyWave: () => formatCommand('H 11'),
  victory: () => formatCommand('H 12'),
  gameOver: () => formatCommand('H 13')
}

const movements = {
  forward: (moveDuration = 1000) => formatCommand(`M 1 ${moveDuration}`),
  reverse: (moveDuration = 1000) => formatCommand(`M 2 ${moveDuration}`),
  left: (moveDuration = 1000) => formatCommand(`M 3 ${moveDuration}`),
  right: (moveDuration = 1000) => formatCommand(`M 4 ${moveDuration}`),
  updown: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 5 ${moveDuration} ${moveSize}`),
  moonwalkerLeft: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 6 ${moveDuration} ${moveSize}`),
  moonwalkerRight: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 7 ${moveDuration} ${moveSize}`),
  swing: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 8 ${moveDuration} ${moveSize}`),
  crusaitoLeft: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 9 ${moveDuration} ${moveSize}`),
  crusaitoRight: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 10 ${moveDuration} ${moveSize}`),
  jump: (moveDuration = 1000) => formatCommand(`M 11 ${moveDuration}`),
  flappingLeft: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 12 ${moveDuration} ${moveSize}`),
  flappingRight: (moveDuration = 1000, moveSize = 30) => formatCommand(`M 13 ${moveDuration} ${moveSize}`),
  tiptoeSwing: (moveDuration = 1000, moveSize = 20) => formatCommand(`M 14 ${moveDuration} ${moveSize}`),
  bendLeft: (moveDuration = 500) => formatCommand(`M 15 ${moveDuration}`),
  bendRight: (moveDuration = 500) => formatCommand(`M 16 ${moveDuration}`),
  shakeLegLeft: (moveDuration = 500) => formatCommand(`M 17 ${moveDuration}`),
  shakeLegRight: (moveDuration = 500) => formatCommand(`M 18 ${moveDuration}`),
  jitter: (moveDuration = 500, moveSize = 20) => formatCommand(`M 19 ${moveDuration} ${moveSize}`),
  ascendingTurn: (moveDuration = 500, moveSize = 15) => formatCommand(`M 20 ${moveDuration} ${moveSize}`)
}

const sounds = {
  connection: () => formatCommand('K 1'),
  disconnection: () => formatCommand('K 2'),
  surprise: () => formatCommand('K 3'),
  ohOoh1: () => formatCommand('K 4'),
  ohOoh2: () => formatCommand('K 5'),
  cuddy: () => formatCommand('K 6'),
  sleeping: () => formatCommand('K 7'),
  happy: () => formatCommand('K 8'),
  superHappy: () => formatCommand('K 9'),
  happyShort: () => formatCommand('K 10'),
  sad: () => formatCommand('K 11'),
  confused: () => formatCommand('K 12'),
  fart1: () => formatCommand('K 13'),
  fart2: () => formatCommand('K 14'),
  fart3: () => formatCommand('K 15'),
  model1: () => formatCommand('K 16'),
  model2: () => formatCommand('K 17'),
  model3: () => formatCommand('K 18'),
  buttonPushed: () => formatCommand('K 19')
}

const general = {
  hardStop: () => formatCommand('S'),
  setName: (name) => formatCommand(`R ${name}`),
  requestName: () => formatCommand('E'),
  requestDistanceMesurament: () => formatCommand('D'),
  requestNoiseMesurament: () => formatCommand('N'),
  requestBatteryMesurament: () => formatCommand('B'),
  requestCurrentProgramId: () => formatCommand('I')
}

const ensureFrecuencyValue = value => {
  if (value < 31) {
    return 31
  }

  if (value > 65535) {
    return 655355
  }

  return value
}

const buzzer = {
  tone: (frecuency = 1000, duration = 150) => formatCommand(`T ${ensureFrecuencyValue(frecuency)} ${duration}`)
}

// @TODO: Missing Servos, trims and program selection

module.exports = {
  gestures,
  buzzer,
  general,
  sounds,
  movements
}
