var socket = io()

socket.on('zowi:said', function (data) {
  console.log(`[zowi:said] ${data}`)
  addToLog(data)
})

function sendCmd (cmd) {
  socket.emit('zowi:cmd', { cmd })
}

function addToLog (msg) {
    const timestamp = new Date().getTime()
    consoleSlc.innerHTML += `<p>[${timestamp}] ${msg}</p>`
}


const consoleSlc = document.getElementById('console')
const cmdInputSlc = document.getElementById('cmd-input');
const cmdActionSlc = document.getElementById('cmd-action');

cmdActionSlc.addEventListener("click" ,evt => {
    const cmd = cmdInputSlc.value.trim();
    if(cmd) {
        sendCmd(`${cmd}  \r\n`)
    }
})
