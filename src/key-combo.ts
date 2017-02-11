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

import { keyContainer, IStateKey } from './key-container'
import { compareSets } from './utils'

export class ComboStateKeys {
  constructor(
    public alt: boolean = false,
    public cmd: boolean = false,
    public ctrl: boolean = false,
    public shift: boolean = false
  ) {}
}

export type TComboSanitized = (number|number[])[]

export interface IComboSplit {
  keys: Set<number>,
  stateKeys: ComboStateKeys
}

/**
 * Defines a Combo of keys
 */
export class KeyCombo {
  constructor(
    public keys: Set<number> = new Set<number>(),
    public stateKeys: ComboStateKeys = new ComboStateKeys()
  ) {
    if (keys && !(keys instanceof Set)) {
      throw new Error('Pass a set as a keys param')
    }
  }

  /**
   * Creates an instance of KeyCombo, given an string.
   */
  static fromString (comboStr: string) {
    const { keys, stateKeys } = KeyCombo.parse(comboStr)
    return new KeyCombo(keys, stateKeys)
  }

  static isEqual(currentCombo: KeyCombo, targetCombo: KeyCombo) {
    return (
      compareSets(currentCombo.keys, targetCombo.keys) &&
      JSON.stringify(currentCombo.stateKeys) === JSON.stringify(targetCombo.stateKeys)
    )
  }

  /**
   * Parses the string and gets the code or codes of it
   */
  static parse (comboStr: string): IComboSplit {
    let comboArr: string[] = comboStr.trim().replace(/\s+/g, ' ').toLowerCase().split(' ')
    // Convert to keyCodes
    let comboArrParsed: TComboSanitized = comboArr.map(combo => keyContainer.getValue(combo))

    // Split into keys and stateKeys
    return KeyCombo.splitCombo(comboArrParsed)
  }

  /**
   * Return a split combo with keys and stateKeys
   */
  static splitCombo(combo: TComboSanitized) {
    const initialValue: IComboSplit = {
      keys: new Set<number>([]),
      stateKeys: new ComboStateKeys()
    }
    const allStateKeys = keyContainer.getStateKeys()

    const comboSplit: IComboSplit = combo.reduce(
      (acum, key) => {
        const keyArr = Array.isArray(key) ? key : [key]
        const stateKeys = KeyCombo.getStateKeys(keyArr, allStateKeys)

        // Add the non-state keys
        acum.keys = new Set<number>([...acum.keys, ...KeyCombo.getNonStateKeys(keyArr, stateKeys)])
        // Mark the state keys
        stateKeys.forEach(key => acum.stateKeys[key.name] = true)

        return acum
      },
      initialValue
    )

    return comboSplit
  }

  /**
   * Returns all state keys, given an array of keyCodes
   */
  static getStateKeys(keyArr: number[], stateKeys: IStateKey[]) {
    return stateKeys.filter(stateKey => keyArr.includes(stateKey.code))
  }

  /**
   * Returns all non-state keys, given an array of keyCodes
   */
  static getNonStateKeys(keyArr: number[], stateKeys: IStateKey[]) {
    return keyArr.filter(key => !KeyCombo.isStateKey(key, stateKeys))
  }

  /**
   * Returns whether a keyCode is a state key
   */
  static isStateKey(key: number, stateKeys: IStateKey[]) {
    return stateKeys.some(stateKey => stateKey.code === key)
  }

  /**
   * Creates an instance of KeyCombo, given an string.
   */
  public addEvent(ev: KeyboardEvent) {
    const stateKeys = new ComboStateKeys(
      ev.altKey,
      ev.metaKey,
      ev.ctrlKey,
      ev.shiftKey
    )
    Object.assign(this.stateKeys, stateKeys)

    const isStateKey = KeyCombo.isStateKey(ev.keyCode, keyContainer.getStateKeys())
    if (!this.keys.has(ev.keyCode) && !isStateKey) {
      this.keys.add(ev.keyCode)
      return true
    }
    return false
  }

  /**
   * Return if the combo has enabled any state key
   */
  public hasStateKeys() {
    const { alt, cmd, ctrl, shift } = this.stateKeys
    return alt || cmd || ctrl || shift
  }
}
