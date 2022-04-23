const commands = require('../lib/serial-commands')
const { movementsMapOut } = require('../__fixtures__')

describe('Serial Commands', () => {
    describe('General', () => {
        const general = Object.keys(commands.general);
        test.each(general)(
            "Command: %p",
            (cmd) => {
              expect(commands.general[cmd]()).toMatchSnapshot();
            }
          );
        it('Command: "setName" should support custom name', () => {
            expect(commands.general.setName('octocat')).toContain('octocat')
        })
    })
    
    describe('Gestures', () => {
        const gestures = Object.keys(commands.gestures);
        test.each(gestures)(
            "Gesture: %p",
            (gesture) => {
              expect(commands.gestures[gesture]()).toMatchSnapshot();
            }
          );
    })

    describe('Sounds', () => {
        const sounds = Object.keys(commands.sounds);
        test.each(sounds)(
            "Sound: %p",
            (sound) => {
              expect(commands.sounds[sound]()).toMatchSnapshot();
            }
          );
    })

    describe('Movements', () => {
        test.each(movementsMapOut)(
            "Movement: %p",
            (movement, moveDuration, moveSize) => {
              const defaultexecution = commands.movements[movement]()
              expect(defaultexecution).toMatchSnapshot();
              expect(defaultexecution).toContain(String(moveDuration))

              const durationExecution = commands.movements[movement](123)
              expect(durationExecution).toMatchSnapshot();
              expect(durationExecution).toContain('123')

              if(moveSize) {
                expect(defaultexecution).toContain(String(moveSize))
                expect(durationExecution).toContain(String(moveSize))

                const sizeExecution = commands.movements[movement](123, 456)
                expect(sizeExecution).toMatchSnapshot();
                expect(sizeExecution).toContain('123')
                expect(sizeExecution).toContain('456')
              }

            }
          );
    })


    describe('Buzzer', () => {
        it('Should have default values', () => {
            const tone = commands.buzzer.tone()
            expect(tone).toMatchSnapshot()
            expect(tone).toContain('150')   // duration
            expect(tone).toContain('1000')  // frecuency
        })

        it('Should support custom frecuency', () => {
            expect(commands.buzzer.tone(70)).toContain('70')
            expect(commands.buzzer.tone(995355)).toContain('655355') // Max limit
            expect(commands.buzzer.tone(1)).toContain('31')  // Min limit
        })

        it('Should support custom duration', () => {
            expect(commands.buzzer.tone(1000, 7000)).toContain('7000')
        })
    })

})