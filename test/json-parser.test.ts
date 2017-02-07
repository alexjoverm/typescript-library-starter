import { JsonActionCombo, JsonParser } from '../src/json-parser'
import { shortcutJS } from '../src/shortcut'

describe('JsonParser: parse', () => {
  it('throws an error if json is not array', () => {
    expect(() => JsonParser.parse(shortcutJS, {})).toThrowErrorMatchingSnapshot()
  })

  it('throws an error if an object is empty', () => {
    expect(() => JsonParser.parse(shortcutJS, [{}])).toThrowErrorMatchingSnapshot()
  })

  it('throws an error if combo property is not in an object', () => {
    expect(() => JsonParser.parse(shortcutJS, [{ action: 'open' }]))
      .toThrowErrorMatchingSnapshot()
  })

  it('throws an error if action property is not in an object', () => {
    expect(() => JsonParser.parse(shortcutJS, [{ combo: 'open' }]))
      .toThrowErrorMatchingSnapshot()
  })

  it('should be ok if is an array of json objects with both properties', () => {
    expect(() => JsonParser.parse(shortcutJS, [{ action: 'open', combo: 'ctrl a' }]))
      .not.toThrowError()
  })
})
