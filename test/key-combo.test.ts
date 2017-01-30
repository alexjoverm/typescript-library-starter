import { KeyCombo, ComboStateKeys } from '../src/key-combo'
import { keyContainer } from '../src/key-container'
import { getMockedEvent } from './utils'

describe('KeyCombo', () => {
  let skipKeys

  beforeAll(() => {
    keyContainer.init('', '')
    skipKeys = keyContainer.getSkipKeys()
  })

  describe('constructor', () => {
    it('throws error if no set is passed as first argument', () => {
      expect(() => { new KeyCombo('ctrl a' as any) }).toThrowErrorMatchingSnapshot()
    })

    it('has defaults keys and stateKeys', () => {
      const combo = new KeyCombo()
      expect(combo.keys).toEqual(new Set<number>())
      expect(combo.stateKeys).toEqual(new ComboStateKeys())
    })

    it('has 2nd param as default', () => {
      const combo = new KeyCombo(new Set<number>([2]))
      expect(combo.keys).toEqual(new Set<number>([2]))
      expect(combo.stateKeys).toEqual(new ComboStateKeys())
    })

    it('gets params from the constructor', () => {
      const stateKeys = new ComboStateKeys()
      stateKeys.alt = true

      const combo = new KeyCombo(new Set<number>([2]), stateKeys)
      expect(combo.keys).toEqual(new Set<number>([2]))
      expect(combo.stateKeys).toEqual(stateKeys)
    })
  })

  describe('isEqual', () => {
    it('return false if the sets are not equal', () => {
      const combo1 = new KeyCombo(new Set<number>([65, 66]))
      const combo2 = new KeyCombo(new Set<number>([65]))
      expect(KeyCombo.isEqual(combo1, combo2)).toBeFalsy()
    })

    it('return false if the stateKeys are not equal', () => {
      const combo1 = KeyCombo.fromString('ctrl a')
      const combo2 = KeyCombo.fromString('alt a')
      expect(KeyCombo.isEqual(combo1, combo2)).toBeFalsy()
    })

    it('return false if the sets are not equal', () => {
      const combo1 = KeyCombo.fromString('ctrl a f num1')
      const combo2 = KeyCombo.fromString('ctrl a f num1')
      expect(KeyCombo.isEqual(combo1, combo2)).toBeTruthy()
    })
  })

  describe('parse', () => {
    it('parses a combo string', () => {
      const combo = KeyCombo.fromString('ctrl a')
      expect(combo.keys).toEqual(new Set([65]))
      expect(combo.stateKeys).toEqual({
        shift: false,
        alt: false,
        cmd: false,
        ctrl: true
      })
    })

    it('is case insensitive', () => {
      const combo = KeyCombo.fromString('CTRL A')
      expect(combo.keys).toEqual(new Set([65]))
      expect(combo.stateKeys).toEqual({
        shift: false,
        alt: false,
        cmd: false,
        ctrl: true
      })
    })

    it('cleans extra whitespaces', () => {
      const combo = KeyCombo.fromString('   ctrl  CTRL   A')
      expect(combo.keys).toEqual(new Set([65]))
      expect(combo.stateKeys).toEqual({
        shift: false,
        alt: false,
        cmd: false,
        ctrl: true
      })
    })

    it('cmd stateKey is true', () => {
      const combo = KeyCombo.fromString('     CMD   A')
      expect(combo.keys).toEqual(new Set([65]))
      expect(combo.stateKeys).toEqual({
        shift: false,
        alt: false,
        cmd: true,
        ctrl: false
      })
    })

    it('supports multiple state keys', () => {
      const combo = KeyCombo.fromString(' ctrl alt  CMD shift  A up')
      expect(combo.keys).toEqual(new Set([65, 38]))
      expect(combo.stateKeys).toEqual({
        shift: true,
        alt: true,
        cmd: true,
        ctrl: true
      })
    })
  })

  describe('splitCombo', () => {
    it('returns a IComboSplit object with the right values', () => {
      expect(KeyCombo.splitCombo([[91,93], 65])).toEqual({
        keys: new Set<number>([65]),
        stateKeys: Object.assign(new ComboStateKeys(), { cmd: true })
      })
    })

    it('returns an empty IComboSplit', () => {
      expect(KeyCombo.splitCombo([])).toEqual({
        keys: new Set<number>([]),
        stateKeys: new ComboStateKeys()
      })
    })
  })

  describe('getSkipKeys', () => {
    it('returns the stateKeys', () => {
      expect(KeyCombo.getSkipKeys([91, 93, 17, 55], skipKeys)).toEqual([
        { name: 'ctrl', code: 17 },
        { name: 'cmd', code: 91 },
        { name: 'cmd', code: 93 }
      ])
    })

    it('returns an empty array if no stateKeys are in the array', () => {
      expect(KeyCombo.getSkipKeys([65], skipKeys)).toEqual([])
    })
  })

  describe('getNonSkipKeys', () => {
    it('returns the non stateKeys', () => {
      expect(KeyCombo.getNonSkipKeys([91, 93, 17, 55], skipKeys)).toEqual([55])
    })

    it('returns an empty array if no stateKeys are in the array', () => {
      expect(KeyCombo.getNonSkipKeys([91, 16], skipKeys)).toEqual([])
    })
  })

  describe('isSkipKey', () => {
    it('returns true if it is a skip key', () => {
      expect(KeyCombo.isSkipKey(91, skipKeys)).toBeTruthy()
      expect(KeyCombo.isSkipKey(93, skipKeys)).toBeTruthy()
      expect(KeyCombo.isSkipKey(17, skipKeys)).toBeTruthy()
      expect(KeyCombo.isSkipKey(16, skipKeys)).toBeTruthy()
      expect(KeyCombo.isSkipKey(18, skipKeys)).toBeTruthy()
    })

    it('returns false if not', () => {
      expect(KeyCombo.isSkipKey(66, skipKeys)).toBeFalsy()
    })
  })

  describe('addEvent', () => {
    it('adds the key (once)', () => {
      const combo = new KeyCombo()
      expect(combo.addEvent(getMockedEvent(65))).toBeTruthy()
      expect(combo.addEvent(getMockedEvent(65))).toBeFalsy()
      expect(combo.keys).toEqual(new Set<number>([65]))
      expect(combo.stateKeys).toEqual(new ComboStateKeys())
    })

    it('doesn\'t add the key if is a stateKey', () => {
      const combo = new KeyCombo()
      expect(combo.addEvent(getMockedEvent(65))).toBeTruthy()
      expect(combo.addEvent(getMockedEvent(17, { ctrlKey: true } as any))).toBeFalsy()
      expect(combo.keys).toEqual(new Set<number>([65]))
      expect(combo.stateKeys).toEqual(Object.assign(new ComboStateKeys(), { ctrl: true }))
    })
  })
})
