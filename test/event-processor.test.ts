import { EventProcessor } from '../src/event-processor'
import { Action } from '../src/action'
import { KeyCombo } from '../src/key-combo'
import { getMockedEvent } from './utils'

/**
 * Mock console
 */
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

/**
 * EventProcessor test
 */
describe('EventProcessor', () => {
  let eventProcessor: EventProcessor
  let actions: Map<string, Action>
  let cb = jest.fn()

  beforeEach(() => {
    eventProcessor = new EventProcessor()
    actions = new Map()
    const action = new Action('action', KeyCombo.fromString('ctrl a'))
    action.addCallback(cb)
    actions.set('action', action)
  })

  afterEach(() => {
    cb.mockClear()
    mockConsole.log.mockClear()
    mockConsole.group.mockClear()
    mockConsole.groupEnd.mockClear()
  })

  describe('cleanCombo', () => {
    it('clears the keyMap', () => {
      eventProcessor.processEvent(getMockedEvent(55), actions, false)
      expect(eventProcessor.currentCombo.keys.size).toBe(1)

      eventProcessor.cleanCombo(false)
      expect(eventProcessor.currentCombo.keys.size).toBe(0)
    })

    it('prints if called with debug', () => {
      eventProcessor.cleanCombo(true)
      expect(mockConsole.log).toHaveBeenCalledTimes(1)
    })
  })

  describe('processEvent', () => {
    it('calls addEventToMap and processActionCombos', () => {
      eventProcessor.processEvent(getMockedEvent(55), actions, false)
      expect(eventProcessor.currentCombo.keys).toEqual(new Set<number>([55]))
    })

    it('calls addEvenToMap but only processActionCombos once', () => {
      eventProcessor.processEvent(getMockedEvent(55), actions, true)
      eventProcessor.processEvent(getMockedEvent(55), actions, true)
      eventProcessor.processEvent(getMockedEvent(45), actions, false)
      expect(eventProcessor.currentCombo.keys.size).toBe(2)
    })

    it('if debug it also logs the event', () => {
      eventProcessor.processEvent(getMockedEvent(55), actions, true)
      expect(mockConsole.group).toHaveBeenCalledTimes(2)
      expect(mockConsole.log).toHaveBeenCalledTimes(3)
      expect(mockConsole.groupEnd).toHaveBeenCalledTimes(2)
    })
  })

  describe('processActionCombos', () => {
    beforeEach(() => cb.mockClear())

    it('iterates over the actions and calls matchesComboAction, matching and calling the callback', () => {
      eventProcessor.processEvent(getMockedEvent(17, { ctrlKey: true } as any), actions, false) // ctrl
      eventProcessor.processEvent(getMockedEvent(65, { ctrlKey: true } as any), actions, false) // a
      expect(cb).toBeCalled()
    })

    it('iterates over the actions and calls matchesComboAction, NOT matching anything', () => {
      eventProcessor.processEvent(getMockedEvent(65), actions, false) // a
      expect(cb).not.toBeCalled()
    })

    it('calls printDebugActionFound if debug is active', () => {
      eventProcessor.processEvent(getMockedEvent(17), actions, true) // ctrl
      eventProcessor.processEvent(getMockedEvent(65, { ctrlKey: true } as any), actions, true) // a

      expect(mockConsole.group).toHaveBeenCalledTimes(4)
      expect(mockConsole.log).toHaveBeenCalledTimes(7)
      expect(mockConsole.groupEnd).toHaveBeenCalledTimes(4)
    })
  })
})
