var socket = io()

socket.on('zowi:said', function (data) {
  console.log(`[zowi:said] ${data}`)
})
function sendCmd (cmd) {
  socket.emit('zowi:cmd', { cmd })
}
