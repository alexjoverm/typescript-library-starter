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

import { keyContainer, ISkipKey } from './key-container'
import { compareSets } from './utils'

export class ComboStateKeys {
  alt: boolean = false
  cmd: boolean = false
  ctrl: boolean = false
  shift: boolean = false
}

export type TComboSanitized = (number|number[])[]

export interface IComboSplit {
  keys: Set<number>,
  stateKeys: ComboStateKeys
}

/**
 * Simple KeyCombo class
 * @class KeyCombo
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
    const allSkipKeys = keyContainer.getSkipKeys()

    const comboSplit: IComboSplit = combo.reduce(
      (acum, key) => {
        const keyArr = Array.isArray(key) ? key : [key]
        const skipKeys = KeyCombo.getSkipKeys(keyArr, allSkipKeys)

        // Add the non-skip keys
        acum.keys = new Set<number>([...acum.keys, ...KeyCombo.getNonSkipKeys(keyArr, skipKeys)])
        // Mark the skip keys
        skipKeys.forEach(key => acum.stateKeys[key.name] = true)

        return acum
      },
      initialValue
    )

    return comboSplit
  }

  static getSkipKeys(keyArr: number[], skipKeys: ISkipKey[]) {
    return skipKeys.filter(skipKey => keyArr.includes(skipKey.code))
  }

  static getNonSkipKeys(keyArr: number[], skipKeys: ISkipKey[]) {
    return keyArr.filter(key => !KeyCombo.isSkipKey(key, skipKeys))
  }

  static isSkipKey(key: number, skipKeys: ISkipKey[]) {
    return skipKeys.some(skipKey => skipKey.code === key)
  }

  /**
   * Creates an instance of KeyCombo, given an string.
   */
  public addEvent(ev: KeyboardEvent) {
    const stateKeys: ComboStateKeys = {
      alt: ev.altKey,
      cmd: ev.metaKey,
      ctrl: ev.ctrlKey,
      shift: ev.shiftKey
    }
    Object.assign(this.stateKeys, stateKeys)

    const isSkipKey = KeyCombo.isSkipKey(ev.keyCode, keyContainer.getSkipKeys())
    if (!this.keys.has(ev.keyCode) && !isSkipKey) {
      this.keys.add(ev.keyCode)
      return true
    }
    return false
  }
}
