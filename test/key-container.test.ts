import { keyContainer } from '../src/key-container'

describe('keyContainer', () => {
  describe('init', () => {
    it('sets cmdKey to 91', () => {
      keyContainer.init('', '')
      expect(keyContainer.getKeys()['cmd']).toEqual([91, 93])
      expect(keyContainer.getSkipKeys()).toMatchSnapshot()
    })

    it('sets cmdKey to 91 when Mac but not Opera or Firefox', () => {
      keyContainer.init('Mac', '')
      expect(keyContainer.getKeys()['cmd']).toEqual([91, 93])
      expect(keyContainer.getSkipKeys()).toMatchSnapshot()
    })

    it('sets cmdKey to 17 when is Mac - Opera', () => {
      keyContainer.init('Mac', 'Opera')
      expect(keyContainer.getKeys()['cmd']).toEqual([17])
      expect(keyContainer.getSkipKeys()).toMatchSnapshot()
    })

    it('sets cmdKey to 224 when is Mac - Firefox', () => {
      keyContainer.init('Mac', 'Firefox')
      expect(keyContainer.getKeys()['cmd']).toEqual([224])
      expect(keyContainer.getSkipKeys()).toMatchSnapshot()
    })

    it('initializes getKeysReversed', () => {
      keyContainer.init('', '')
      expect(keyContainer.getKeysReversed()[65]).toBe('a')
      expect(keyContainer.getKeysReversed()[91]).toBe('cmd')
      expect(keyContainer.getKeysReversed()[93]).toBe('cmd')
    })
  })

  describe('getValue', () => {
    it('throws error if the key is not supported', () => {
      keyContainer.init('', '')
      expect(() => keyContainer.getValue('klsdlkjd')).toThrowErrorMatchingSnapshot()
    })

    it('returns the right value given a key', () => {
      keyContainer.init('', '')
      expect(keyContainer.getValue('ctrl')).toBe(17)
    })
  })
})
