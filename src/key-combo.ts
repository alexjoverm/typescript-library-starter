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

import { keyContainer } from './key-container'

/**
 * Simple KeyCombo class
 * @class KeyCombo
 */
export class KeyCombo {
  public keys: Set<number|number[]>
  private comboStr: string

  /**
   * Creates an instance of KeyCombo.
   * @param {array} keys
   */
  constructor (comboStr: string) {
    this.comboStr = comboStr
    this.keys = new Set(this.parse(comboStr))
  }

  /**
   * Parses the string and gets the code or codes of it
   * @param {string} comboStr
   * @returns {number[]}
   */
  private parse (comboStr: string): (number|number[])[] {
    let comboArr: string[] = comboStr.trim().replace(/\s+/g, ' ').toLowerCase().split(' ')
    let comboArrParsed: (number|number[])[] = comboArr.map(combo => keyContainer.getValue(combo))
    return comboArrParsed
  }
}
