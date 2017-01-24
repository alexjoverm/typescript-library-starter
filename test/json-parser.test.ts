import { JsonActionCombo, JsonParser } from 'src/json-parser'
import { shortcutJS } from 'src/index'

describe('JsonParser', () => {
  it('throws an error if json is not array', () => {
    expect(() => JsonParser.parse(shortcutJS, {})).toThrowErrorMatchingSnapshot()
  })
})
