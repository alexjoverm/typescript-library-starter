/*
  Copyright 2017 Alex Jover Morales (alexjovermorales@gmail.com)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */

import { ShortcutJS } from './index'
import { Action } from './action'
import { KeyCombo } from './key-combo'

/**
 * Value object class representing an object from the json array loaded
 * @class JsonActionCombo
 */
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


/**
 * Parses the json array of combo actions loaded externally
 * @class JsonParser
 */
export class JsonParser {


  /**
   * Does the parsing
   *
   * @param {ShortcutJS} shortcutJS
   * @param {any} json
   */
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