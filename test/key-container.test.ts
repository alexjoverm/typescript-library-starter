import { keyContainer } from '../src/key-container'

describe('keyContainer', () => {
  // it('should parse a combo string', () => {
  //   const combo = new KeyCombo('ctrl a')
  //   expect(combo.keys).toEqual(new Set([17, 65]))
  // })

  describe('init', () => {
    it('sets cmdKey to 91', () => {
      keyContainer.init('', '')
      expect(keyContainer.getKeys().cmd).toBe(91)
    })

    it('sets cmdKey to 91 when Mac but not Opera or Firefox', () => {
      keyContainer.init('Mac', '')
      expect(keyContainer.getKeys().cmd).toBe(91)
    })

    it('sets cmdKey to 17 when is Mac - Opera', () => {
      keyContainer.init('Mac', 'Opera')
      expect(keyContainer.getKeys().cmd).toBe(17)
    })

    it('sets cmdKey to 91  when is Mac - Firefox', () => {
      keyContainer.init('Mac', 'Firefox')
      expect(keyContainer.getKeys().cmd).toBe(224)
    })

    it('initializes getKeysReversed', () => {
      keyContainer.init('', '')
      expect(keyContainer.getKeysReversed()[65]).toBe('a')
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
