let ports = []

const mockedWrite = jest.fn(() => Promise.resolve())
const mockedClose = jest.fn(() => Promise.resolve())
const mockedList = jest.fn(() => Promise.resolve(ports))

const registerPreloadedPorts = (data) => {
    ports = data
}

class SerialPort {
    constructor(path, baudRate) {
      this.path = path;
      this.baudRate = baudRate;
    }

    static list () {
        return mockedList()
    }

    close () {
        return mockedClose()
    }

    write () {
        return mockedWrite()
    }

    pipe (arg) {
        return arg
    }

  }


module.exports = {
    SerialPort,
    registerPreloadedPorts,
    mockedWrite,
    mockedClose,
    mockedList
}