const { digest } = require('../lib/serial-digest')

describe('Serial Digest', () => {
  it('Should recognize a distance message', () => {
      const result = digest('&&D 27%%')
      expect(result.distance).toBe(27)
  })
  it('Should recognize a battery message', () => {
    const result = digest('&&B 97.60%%')
    expect(result.battery).toBe(97.60)
})
  it('Should recognize a valid mode message', () => {
    const result = digest('&&I 4%%')
    expect(result.mode).toBe('teleoperation')
  })
  it('Should recognize a non valid mode message', () => {
    const result = digest('&&I 9%%')
    expect(result.mode).toBe(undefined)
  })
  it('Should recognize noise message', () => {
    const result = digest('&&N 512%%')
    expect(result.noise).toBe(512)
  })
  it('Should recognize name message', () => {
    const result = digest('&&E Zowi%%')
    expect(result.name).toBe('Zowi')
  })
  it('Should ignore a non recognized message', () => {
    const result = digest('&&X 1RJ%%')
    expect(result).toBe(undefined)
  })
})
