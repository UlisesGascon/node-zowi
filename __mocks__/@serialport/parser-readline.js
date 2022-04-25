let message = null

const registerPreloadedMessage = (msg) => {
    message = msg
}

class ReadlineParser {
    constructor(settings) {
        this.settings = settings
    }

    on (event, cb) {
        cb(message)
    }
}

module.exports = {
    ReadlineParser,
    registerPreloadedMessage
}