import { Action } from '../src/action'
import { KeyCombo } from '../src/key-combo'

const mockA = jest.fn()
const mockB = jest.fn()

describe('Action', () => {
  it('throws an error if second parameter is not a combo', () => {
    expect(() => new Action('', {} as KeyCombo)).toThrowErrorMatchingSnapshot()
  })

  it('should be ok if parameters are correct', () => {
    const action = new Action('open', new KeyCombo('ctrl a'))
    expect(action.name).toBe('open')
    expect(action.keyCombo).toBeInstanceOf(KeyCombo)
    expect(action.callbacks).toEqual(new Set())
  })

  it('addCallback: should add a callback', () => {
    const action = new Action('open', new KeyCombo('ctrl a'))
    action.addCallback(mockA)
    expect(action.callbacks.size).toBe(1)
  })

  describe('deleteCallback', () => {
    it('should remove one callback if a cb param is passed', () => {
      const action = new Action('open', new KeyCombo('ctrl a'))
      action.addCallback(mockA)
      action.addCallback(mockB)
      expect(action.callbacks.size).toBe(2)
      action.removeCallback(mockA)
      expect(action.callbacks.size).toBe(1)
    })

    it('should remove all callbacks if no params are passed', () => {
      const action = new Action('open', new KeyCombo('ctrl a'))
      action.addCallback(mockA)
      action.addCallback(mockB)
      expect(action.callbacks.size).toBe(2)
      action.removeCallback()
      expect(action.callbacks.size).toBe(0)
    })
  })
})
