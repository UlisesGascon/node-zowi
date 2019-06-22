var socket = io()

socket.on('zowi:said', function (data) {
  console.log(`[zowi:said] ${data}`)
  addToLog(data)
})

function sendCmd (cmd) {
  socket.emit('zowi:cmd', { cmd: `${cmd} \r\n` })
}
function sendGesture (gesture) {
    socket.emit('zowi:gesture', { gesture })
  }


function addToLog (msg) {
    const timestamp = new Date().getTime()
    consoleSlc.innerHTML = `<p>[${timestamp}] ${msg}</p> + ${consoleSlc.innerHTML}`
}


const consoleSlc = document.getElementById('console')
const cmdInputSlc = document.getElementById('cmd-input');
const gestureSlc = document.getElementById('gesture-list')
const cmdActionSlc = document.getElementById('cmd-action');
const cmdGestureSlc = document.getElementById('cmd-gesture');


cmdGestureSlc.addEventListener('click', evt => {
    const gesture = gestureSlc.value
    sendGesture(gesture)
})

cmdActionSlc.addEventListener("click" ,evt => {
    const cmd = cmdInputSlc.value.trim();
    if(cmd) {
        sendCmd(cmd.toUpperCase())
    }
})


function move (dir){
    const dic = {
        '38': 'M 1',
        '87': 'M 1',
        '40': 'M 2',
        '83': 'M 2',
        '39': 'M 4',
        '68': 'M 4',
        '37': 'M 3',
        '65': 'M 3',
        '81': 'S'
    }
    const value = dic[dir]
    console.log("value:", value, dir, dic)
    if(value) {
        sendCmd(`${value} 1000`)
    }
    

}

function stop () {
    sendCmd("S")
}

const dirKeys = ['81', '38', '40', '39', '37', '87', '83', '68', '65']
let lastkey;
document.body.addEventListener('keydown', evt => {
    console.log("Hola!!")
    const key = String(evt.keyCode)
    const isValid = dirKeys.includes(key)
    console.log("isValid?", isValid)

    if(isValid) {
        if(lastkey !== key) {
            move(key)
            lastkey = key;
        }

    }
})


function gesturesOption (gestures) {
    const htmlContent = gestures.map(gesture => `<option value="${gesture}">${gesture}</option>`).join('')
    gestureSlc.innerHTML = htmlContent
}

fetch('/api/gestures')
    .then(res => res.json())
    .then(gesturesOption)
    .catch(console.error)
