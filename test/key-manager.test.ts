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

describe('ShortcutJS', () => {
  beforeEach(() => {
    shortcutJS.keyMap = new Map()
    shortcutJS.actions = new Map()

    mockWindow.addEventListener.mockClear()
    mockWindow.removeEventListener.mockClear()
  })

  describe('addEventToQueue', () => {
    it('should add an event to the queue', () => {
      shortcutJS.addEventToQueue({keyCode: 2})
      expect(shortcutJS.keyMap.size).toEqual(1)
    })

    it('should not add repeated events', () => {
      shortcutJS.addEventToQueue({keyCode: 2})
      shortcutJS.addEventToQueue({keyCode: 2})
      shortcutJS.addEventToQueue({keyCode: 2})
      expect(shortcutJS.keyMap.size).toEqual(1)
    })
  })

  describe('removeKey', () => {
    it('should remove one keystroke', () => {
      shortcutJS.addEventToQueue({keyCode: 2 })
      shortcutJS.addEventToQueue({keyCode: 3})
      shortcutJS.addEventToQueue({keyCode: 1})
      shortcutJS.removeKey({keyCode: 1})
      expect(shortcutJS.keyMap.size).toEqual(2)
    })
  })

  describe('isQueueInAction', () => {
    it('should return false if an action does not exists', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      expect(shortcutJS.isQueueInAction(action)).toBeFalsy()
    })

    it('should return true if an action exists', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      shortcutJS.addEventToQueue({keyCode: 5})
      shortcutJS.addEventToQueue({keyCode: 99})

      expect(shortcutJS.isQueueInAction(action)).toBeTruthy()
    })

    it('should return true if an action exists, even with a different order', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      shortcutJS.addEventToQueue({keyCode: 99})
      shortcutJS.addEventToQueue({keyCode: 5})

      expect(shortcutJS.isQueueInAction(action)).toBeTruthy()
    })
  })

  describe.skip('processEvent', () => {
    beforeAll(() => {
      // sinon.spy(shortcutJS, 'addEventToQueue')
      // sinon.spy(shortcutJS, 'processActionCombos')
    })

    afterAll(() => {
      // shortcutJS.addEventToQueue.restore()
      // shortcutJS.processActionCombos.restore()
    })

    it('should call addEventToQueue and processActionCombos', () => {
      shortcutJS.processEvent({keyCode: 2})
      expect(shortcutJS.addEventToQueue).toBeCalled()
      expect(shortcutJS.processActionCombos).toBeCalled()
    })
  })

  describe('init', () => {
    it('should set keydown and keyup event listeners', () => {
      shortcutJS.init()
      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2)
    })
  })

  describe('addAction', () => {
    it('should add an action', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      shortcutJS.addAction(action)
      expect(shortcutJS.actions.size).toEqual(1)
    })

    it('should throw an error if an action is not passed', () => {
      expect(shortcutJS.addAction.bind({})).toThrowError()
    })
  })

  describe('subscribe', () => {
    it('should add a new callback', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)

      shortcutJS.addAction(action)
      shortcutJS.subscribe(action.name, () => ({}))

      expect(shortcutJS.actions.get(action.name).callbacks.size).toEqual(1)
    })

    it('should throw an error if the action name is not correct', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      shortcutJS.addAction(action)

      expect(shortcutJS.subscribe.bind('papa', () => ({}))).toThrowError()
    })
  })

  describe('unsubscribe', () => {
    it('should remove a callback', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)

      const func = () => ({})

      shortcutJS.addAction(action)
      shortcutJS.subscribe(action.name, func)
      shortcutJS.unsubscribe(action.name, func)

      expect(shortcutJS.actions.get(action.name).callbacks.size).toEqual(0)
    })

    it('should throw an error if the action name is not correct', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      shortcutJS.addAction(action)

      expect(shortcutJS.unsubscribe.bind('papa', () => ({}))).toThrowError()
    })
  })
})
