import { KeyCombo } from '../src/key-combo'

describe('KeyCombo', () => {
  it('should parse a combo string', () => {
    const combo = new KeyCombo('ctrl a')
    expect(combo.keys).toEqual(new Set([17, 65]))
  })

  it('should be case insensitive', () => {
    const combo = new KeyCombo('CTRL A')
    expect(combo.keys).toEqual(new Set([17, 65]))
  })

  it('should clean extra whitespaces', () => {
    const combo = new KeyCombo('     CTRL   A')
    expect(combo.keys).toEqual(new Set([17, 65]))
  })
})
