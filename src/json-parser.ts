import { ShortcutJS } from './index'
import { Action } from './action'
import { KeyCombo } from './key-combo'

export class JsonActionCombo {
  public combo
  public action

  constructor(obj) {
    if (!obj || !obj.combo || !obj.action) {
      throw new Error(`
        The json provided must be an array of { combo, action } object. Example
          [
            { action: 'openWindow', combo: 'ctrl a' }
          ]
      `)
    }

    this.combo = obj.combo
    this.action = obj.action
  }
}

export class JsonParser {
  static parse(shortcutJS: ShortcutJS, json: any) {
    if (!Array.isArray(json)) {
      throw new Error('The json provided must be an array')
    }

    json.forEach(obj => {
      const jsonActionCombo = new JsonActionCombo(obj)
      const keyCombo = new KeyCombo(jsonActionCombo.combo)
      const action = new Action(jsonActionCombo.action, keyCombo)
      shortcutJS.addAction(action)
    })
  }
}