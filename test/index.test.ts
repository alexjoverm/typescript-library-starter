/*
  Copyright 2017 Alex Jover Morales (alexjovermorales@gmail.com)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */

import { Action, KeyCombo, shortcutJS } from '../src'

interface MockWindow extends Window {
  addEventListener: jest.Mock<{}> & typeof window.addEventListener
  removeEventListener: jest.Mock<{}> & typeof window.removeEventListener
}

function getMockWindow() {
  window.addEventListener = jest.fn()
  window.removeEventListener = jest.fn()
  return window as MockWindow
}

let mockWindow = getMockWindow()

interface MockConsole extends Console {
  log: jest.Mock<{}> & typeof console.log
  group: jest.Mock<{}> & typeof console.group
  groupEnd: jest.Mock<{}> & typeof console.groupEnd
}

function getMockConsole() {
  console.log = jest.fn()
  console.group = jest.fn()
  console.groupEnd = jest.fn()
  return console as MockConsole
}

let mockConsole = getMockConsole()

// function keyPress(key) {
//   let options: KeyboardEventInit = { keyCode: key } as KeyboardEventInit
//   let event: KeyboardEvent = new KeyboardEvent('keydown', {
//     bubbles: true,
//     cancelable: true,
//     shiftKey: true
//   })

//   document.dispatchEvent(event)
// }

function getMockedEvent(key) {
  return {
    keyCode: key
  }
}

/**
 * Actual test suite
 */
describe('shortcutJS', () => {
  afterEach(() => {
    shortcutJS.reset()

    mockWindow.addEventListener.mockClear()
    mockWindow.removeEventListener.mockClear()

    mockConsole.log.mockClear()
    mockConsole.group.mockClear()
    mockConsole.groupEnd.mockClear()
  })


  describe('init', () => {
    it('sets keydown and keyup event listeners', () => {
      shortcutJS.init()
      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2)
    })

    it('sets keydown and keyup event listeners only once', () => {
      shortcutJS.init()
      shortcutJS.init()
      shortcutJS.init()
      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2)
    })
  })

  describe('reset', () => {
    it('removes keydown and keyup event listeners only once', () => {
      shortcutJS.reset()
      expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(2)
    })

    it('clears keyMap and actions', () => {
      shortcutJS.init()

      shortcutJS.processEvent(getMockedEvent(17))
      expect(shortcutJS.keyMap.size).toBe(1)

      shortcutJS.addAction(new Action('open', new KeyCombo('ctrl a')))
      expect(shortcutJS.actions.size).toBe(1)

      shortcutJS.reset()
      expect(shortcutJS.keyMap.size).toBe(0)
      expect(shortcutJS.actions.size).toBe(0)
    })
  })

  describe('loadFromJson', () => {
    it('calls init and parses json', () => {
      shortcutJS.loadFromJson([{ action: 'open', combo: 'ctrl a' }])
      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2)
      expect(shortcutJS.actions.size).toBeGreaterThan(0)
    })

    it('calls init and parses json with debug true', () => {
      shortcutJS.loadFromJson([{ action: 'open', combo: 'ctrl a' }], { debug: true })
      expect(shortcutJS.options.debug).toBeTruthy()
    })
  })

  describe('addAction', () => {
    it('adds an action', () => {
      const combo = new KeyCombo('ctrl a')
      const action = new Action('action', combo)
      shortcutJS.addAction(action)
      expect(shortcutJS.actions.size).toEqual(1)
    })

    it('throws an error if an action is not passed', () => {
      expect(shortcutJS.addAction.bind({})).toThrowError()
    })
  })

  describe('subscribe', () => {
    it('adds a new callback', () => {
      const combo = new KeyCombo('ctrl a')
      const action = new Action('action', combo)

      shortcutJS.addAction(action)
      shortcutJS.subscribe(action.name, () => ({}))

      expect(shortcutJS.actions.get(action.name).callbacks.size).toEqual(1)
    })

    it('throws an error if the action name is not correct', () => {
      const combo = new KeyCombo('ctrl a')
      const action = new Action('action', combo)
      shortcutJS.addAction(action)

      expect(shortcutJS.subscribe.bind('papa', () => ({}))).toThrowError()
    })
  })

  describe('unsubscribe', () => {
    it('removes a callback', () => {
      const combo = new KeyCombo('ctrl a')
      const action = new Action('action', combo)

      const func = () => ({})

      shortcutJS.addAction(action)
      shortcutJS.subscribe(action.name, func)
      shortcutJS.unsubscribe(action.name, func)

      expect(shortcutJS.actions.get(action.name).callbacks.size).toEqual(0)
    })

    it('removes a all callbacks', () => {
      shortcutJS.loadFromJson([{ action: 'open', combo: 'ctrl a' }])
      shortcutJS.subscribe('open', jest.fn())
      shortcutJS.subscribe('open', jest.fn())
      shortcutJS.unsubscribe('open')

      expect(shortcutJS.actions.get('open').callbacks.size).toEqual(0)
    })

    it('throws an error if the action name is not correct', () => {
      const combo = new KeyCombo('ctrl a')
      const action = new Action('action', combo)
      shortcutJS.addAction(action)

      expect(shortcutJS.unsubscribe.bind('papa', () => ({}))).toThrowError()
    })
  })

  describe('processEvent', () => {
    it('calls addEventToMap and processActionCombos', () => {
      shortcutJS.processEvent(getMockedEvent(17))
      expect(shortcutJS.keyMap.get(17)).toBeTruthy()
    })

    it('calls addEvenToMap but only processActionCombos once', () => {
      shortcutJS.processEvent(getMockedEvent(17))
      shortcutJS.processEvent(getMockedEvent(17))
      shortcutJS.processEvent(getMockedEvent(17))
      expect(shortcutJS.keyMap.size).toBe(1)
    })

    it('if debug it also logs the event', () => {
      shortcutJS.init({debug: true})
      shortcutJS.processEvent(getMockedEvent(17))
      expect(mockConsole.group).toHaveBeenCalledTimes(1)
      expect(mockConsole.log).toHaveBeenCalledTimes(2)
      expect(mockConsole.groupEnd).toHaveBeenCalledTimes(1)
    })
  })

  describe('processActionCombos', () => {
    let actionJson = [
      { action: 'open', combo: 'ctrl a' },
      { action: 'close', combo: 'ctrl c' }
    ]

    let cb = jest.fn()
    beforeEach(() => cb.mockClear())

    it('iterates over the actions and calls isQueueInAction, matching and calling the callback', () => {
      shortcutJS.loadFromJson(actionJson)
      shortcutJS.subscribe('open', cb)
      shortcutJS.processEvent(getMockedEvent(17)) // ctrl
      shortcutJS.processEvent(getMockedEvent(65)) // a
      shortcutJS.processActionCombos()

      expect(cb).toBeCalled()
    })

    it('iterates over the actions and calls isQueueInAction, NOT matching anything', () => {
      shortcutJS.loadFromJson(actionJson)
      shortcutJS.subscribe('open', cb)
      shortcutJS.processEvent(getMockedEvent(65)) // a
      shortcutJS.processActionCombos()

      expect(cb).not.toBeCalled()
    })

    it('calls printDebugActionFound if debug is active', () => {
      shortcutJS.loadFromJson(actionJson, { debug: true })
      shortcutJS.subscribe('open', cb)
      shortcutJS.keyMap.set(65, true)
      shortcutJS.keyMap.set(17, true)
      shortcutJS.processActionCombos()

      expect(console.group).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledTimes(3)
      expect(console.groupEnd).toHaveBeenCalledTimes(1)
    })
  })



  // describe.only('addEventToMap', () => {
  //   it('should add an event to the queue', () => {
  //     shortcutJS.addEventToMap({keyCode: 2})
  //     expect(shortcutJS.keyMap.size).toEqual(1)
  //   })

  //   it('should not add repeated events', () => {
  //     shortcutJS.addEventToMap({keyCode: 2})
  //     shortcutJS.addEventToMap({keyCode: 2})
  //     shortcutJS.addEventToMap({keyCode: 2})
  //     expect(shortcutJS.keyMap.size).toEqual(1)
  //   })
  // })

  // describe('removeKey', () => {
  //   it('should remove one keystroke', () => {
  //     shortcutJS.addEventToMap({keyCode: 2 })
  //     shortcutJS.addEventToMap({keyCode: 3})
  //     shortcutJS.addEventToMap({keyCode: 1})
  //     shortcutJS.removeKey({keyCode: 1})
  //     expect(shortcutJS.keyMap.size).toEqual(2)
  //   })
  // })

  // describe('isQueueInAction', () => {
  //   it('should return false if an action does not exists', () => {
  //     const combo = new KeyCombo('ctrl a')
  //     const action = new Action('action', combo)
  //     expect(shortcutJS.isQueueInAction(action)).toBeFalsy()
  //   })

  //   it('should return true if an action exists', () => {
  //     const combo = new KeyCombo([5, 99])
  //     const action = new Action('action', combo)
  //     shortcutJS.addEventToMap({keyCode: 5})
  //     shortcutJS.addEventToMap({keyCode: 99})

  //     expect(shortcutJS.isQueueInAction(action)).toBeTruthy()
  //   })

  //   it('should return true if an action exists, even with a different order', () => {
  //     const combo = new KeyCombo([5, 99])
  //     const action = new Action('action', combo)
  //     shortcutJS.addEventToMap({keyCode: 99})
  //     shortcutJS.addEventToMap({keyCode: 5})

  //     expect(shortcutJS.isQueueInAction(action)).toBeTruthy()
  //   })
  // })

  // describe.skip('processEvent', () => {
  //   beforeAll(() => {
  //     // sinon.spy(shortcutJS, 'addEventToMap')
  //     // sinon.spy(shortcutJS, 'processActionCombos')
  //   })

  //   afterAll(() => {
  //     // shortcutJS.addEventToMap.restore()
  //     // shortcutJS.processActionCombos.restore()
  //   })

  //   it('should call addEventToMap and processActionCombos', () => {
  //     shortcutJS.processEvent({keyCode: 2})
  //     expect(shortcutJS.addEventToMap).toBeCalled()
  //     expect(shortcutJS.processActionCombos).toBeCalled()
  //   })
  // })

  // describe('addAction', () => {
  //   it('should add an action', () => {
  //     const combo = new KeyCombo([5, 99])
  //     const action = new Action('action', combo)
  //     shortcutJS.addAction(action)
  //     expect(shortcutJS.actions.size).toEqual(1)
  //   })

  //   it('should throw an error if an action is not passed', () => {
  //     expect(shortcutJS.addAction.bind({})).toThrowError()
  //   })
  // })

  // describe('subscribe', () => {
  //   it('should add a new callback', () => {
  //     const combo = new KeyCombo([5, 99])
  //     const action = new Action('action', combo)

  //     shortcutJS.addAction(action)
  //     shortcutJS.subscribe(action.name, () => ({}))

  //     expect(shortcutJS.actions.get(action.name).callbacks.size).toEqual(1)
  //   })

  //   it('should throw an error if the action name is not correct', () => {
  //     const combo = new KeyCombo([5, 99])
  //     const action = new Action('action', combo)
  //     shortcutJS.addAction(action)

  //     expect(shortcutJS.subscribe.bind('papa', () => ({}))).toThrowError()
  //   })
  // })

  // describe('unsubscribe', () => {
  //   it('should remove a callback', () => {
  //     const combo = new KeyCombo([5, 99])
  //     const action = new Action('action', combo)

  //     const func = () => ({})

  //     shortcutJS.addAction(action)
  //     shortcutJS.subscribe(action.name, func)
  //     shortcutJS.unsubscribe(action.name, func)

  //     expect(shortcutJS.actions.get(action.name).callbacks.size).toEqual(0)
  //   })

  //   it('should throw an error if the action name is not correct', () => {
  //     const combo = new KeyCombo([5, 99])
  //     const action = new Action('action', combo)
  //     shortcutJS.addAction(action)

  //     expect(shortcutJS.unsubscribe.bind('papa', () => ({}))).toThrowError()
  //   })
  // })
})
