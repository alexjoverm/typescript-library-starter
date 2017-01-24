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

/**
 * Contains the logic for the keyMapping
 *
 * @class KeyContainer
 */
class KeyContainer {
  private keyMap = {
    // nums
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,

    // characters
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,

    // punctuation
    ',': 188,
    '.': 190,

    // special
    'shift': 16,
    'ctrl': 17,
    'alt': 18,

    // navigation
    'left': 37,
    'right': 39,
    'up': 38,
    'down': 40,
    'backspace': 8,
    'enter': 13,
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36,

    // numpad
    'num0': 96,
    'num1': 97,
    'num2': 98,
    'num3': 99,
    'num4': 100,
    'num5': 101,
    'num6': 102,
    'num7': 103,
    'num8': 104,
    'num9': 105,
    'num*': 106,
    'num+': 107,
    'num-': 109,
    'num.': 110,
    'num/': 111,

    // function keys
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123
  }

  /**
   * Reversed map (value: key) for easy mapping code -> word
   */
  private keyMapReversed: any = {}


  /**
   * Initializes the keyMaps
   *
   * @param {any} platform
   * @param {any} userAgent
   */
  public init(platform, userAgent) {
    // Define cmdKey depending on browser
    let cmdKey: number|number[] = [91, 93]

    if (platform.match('Mac') && userAgent.match('Opera')) {
      cmdKey = 17
    } else if (platform.match('Mac') && userAgent.match('Firefox')) {
      cmdKey = 224
    }

    this.keyMap = Object.assign(this.keyMap, { 'cmd': cmdKey })

    // Build reversedMap (keys are values, values are keys)
    Object.keys(this.keyMap).forEach(key => {
      let value = this.keyMap[key]
      this.keyMapReversed[value] = key
    })
  }

  public getKeys(): any {
    return this.keyMap
  }

  public getKeysReversed(): any {
    return this.keyMapReversed
  }

  public getValue(key: string): number|number[] {
    return this.keyMap[key]
  }
}

export const keyContainer = new KeyContainer() // Singleton instance
