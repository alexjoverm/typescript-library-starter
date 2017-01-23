import { Action, KeyCombo, keyManager } from '../src'

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

describe('KeyManager', () => {
  beforeEach(() => {
    keyManager.keyMap = new Map()
    keyManager.actions = new Map()

    mockWindow.addEventListener.mockClear()
    mockWindow.removeEventListener.mockClear()
  })

  describe('addEventToQueue', () => {
    it('should add an event to the queue', () => {
      keyManager.addEventToQueue({keyCode: 2})
      expect(keyManager.keyMap.size).toEqual(1)
    })

    it('should not add repeated events', () => {
      keyManager.addEventToQueue({keyCode: 2})
      keyManager.addEventToQueue({keyCode: 2})
      keyManager.addEventToQueue({keyCode: 2})
      expect(keyManager.keyMap.size).toEqual(1)
    })
  })

  describe('removeKey', () => {
    it('should remove one keystroke', () => {
      keyManager.addEventToQueue({keyCode: 2 })
      keyManager.addEventToQueue({keyCode: 3})
      keyManager.addEventToQueue({keyCode: 1})
      keyManager.removeKey({keyCode: 1})
      expect(keyManager.keyMap.size).toEqual(2)
    })
  })

  describe('isQueueInAction', () => {
    it('should return false if an action does not exists', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      expect(keyManager.isQueueInAction(action)).toBeFalsy()
    })

    it('should return true if an action exists', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      keyManager.addEventToQueue({keyCode: 5})
      keyManager.addEventToQueue({keyCode: 99})

      expect(keyManager.isQueueInAction(action)).toBeTruthy()
    })

    it('should return true if an action exists, even with a different order', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      keyManager.addEventToQueue({keyCode: 99})
      keyManager.addEventToQueue({keyCode: 5})

      expect(keyManager.isQueueInAction(action)).toBeTruthy()
    })
  })

  describe.skip('processEvent', () => {
    beforeAll(() => {
      // sinon.spy(keyManager, 'addEventToQueue')
      // sinon.spy(keyManager, 'processActionCombos')
    })

    afterAll(() => {
      // keyManager.addEventToQueue.restore()
      // keyManager.processActionCombos.restore()
    })

    it('should call addEventToQueue and processActionCombos', () => {
      keyManager.processEvent({keyCode: 2})
      expect(keyManager.addEventToQueue).toBeCalled()
      expect(keyManager.processActionCombos).toBeCalled()
    })
  })

  describe('init', () => {
    it('should set keydown and keyup event listeners', () => {
      keyManager.init()
      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2)
    })
  })

  describe('addAction', () => {
    it('should add an action', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      keyManager.addAction(action)
      expect(keyManager.actions.size).toEqual(1)
    })

    it('should throw an error if an action is not passed', () => {
      expect(keyManager.addAction.bind({})).toThrowError()
    })
  })

  describe('subscribe', () => {
    it('should add a new callback', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)

      keyManager.addAction(action)
      keyManager.subscribe(action.name, () => ({}))

      expect(keyManager.actions.get(action.name).callbacks.size).toEqual(1)
    })

    it('should throw an error if the action name is not correct', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      keyManager.addAction(action)

      expect(keyManager.subscribe.bind('papa', () => ({}))).toThrowError()
    })
  })

  describe('unsubscribe', () => {
    it('should remove a callback', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)

      const func = () => ({})

      keyManager.addAction(action)
      keyManager.subscribe(action.name, func)
      keyManager.unsubscribe(action.name, func)

      expect(keyManager.actions.get(action.name).callbacks.size).toEqual(0)
    })

    it('should throw an error if the action name is not correct', () => {
      const combo = new KeyCombo([5, 99])
      const action = new Action('action', combo)
      keyManager.addAction(action)

      expect(keyManager.unsubscribe.bind('papa', () => ({}))).toThrowError()
    })
  })
})
