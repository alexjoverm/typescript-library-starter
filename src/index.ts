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
import { JsonParser } from './json-parser'
import { KeyCombo } from './key-combo'
import { Action } from './action'


interface Logger extends Console {
  group(title: string, options?: string)
}

const logger = console as Logger

/**
 * First Version of a ShortcutJS.
 *
 * Ideally, ShortcutJS could hold the keydown and keyup events, and execute the actions according
 * to the key combos.
 *
 * WARNING: careful when adding combos with CTRL key on it. If you happen to trigger a by-default
 * browser shortcut (like CTRL-T) the keyup event will not be performed
 *
 * @todo Improvements:
 *  - Avoid repetition of mouseDownEvents if the last key is the same
 *  - Performance of processActionCombos
 *
 * @class ShortcutJS
 */
export class ShortcutJS {
  public actions: Map<string, Action>
  public keyMap: Map<string, boolean>
  public options: any

  // ********* PRIVATE API (only internal use) **********
  /**
   * Private constructor
   *
   * @memberOf ShortcutJS
   */
  constructor () {
    // With Maps we avoid events duplication, achieve immutability and performance
    this.actions = new Map()
    this.keyMap = new Map()
    this.options = {
      debug: false
    }
  }

  public init (options) {
    // @todo do some checking here
    this.options = Object.assign({}, this.options, options)


    window.addEventListener('keydown', this.processEvent.bind(this))
    window.addEventListener('keyup', this.removeAllKeys.bind(this))
  }

  public loadFromJson(json, options = null) {
    if (options) {
      this.init(options)
    }

    JsonParser.parse(this, json)
  }

  public addAction (action) {
    if (!(action instanceof Action)) {
      throw new Error('You must pass an Action instance object')
    }

    this.actions.set(action.name, action)
  }

  public subscribe (actionName, cb) {
    if (this.actions.has(actionName)) {
      const action = this.actions.get(actionName)
      action.callbacks.add(cb)
    } else {
      throw new Error(`Action ${actionName} does not exists`)
    }
  }

  public unsubscribe (actionName, cb = null) {
    if (this.actions.has(actionName)) {
      const action = this.actions.get(actionName)

      if (cb) {
        action.callbacks.delete(cb)
      } else {
        action.callbacks = new Set()
      }
    } else {
      throw new Error(`Action ${actionName} does not exists`)
    }
  }

  private addEventToQueue (ev) {
    if (this.keyMap.has(ev.keyCode)) {
      return false
    } else {
      this.keyMap.set(ev.keyCode, true)
      return true
    }
  }

  /**
   * Cleans the event Queue
   */
  private removeAllKeys (ev) {
    this.keyMap.clear()
    if (this.options.debug) {
      logger.log('ShortcutJS: Cleaned keyMap')
    }
  }

  /**
   * Checks whether the que matches a particular action
   * @todo Performance improvement
   *   - Idea 1: Using binary operators for comparison
   *   - Idea 2: Generating uuid's per KeyCombo
   * @param {any} action
   */
  private isQueueInAction (action) {
    const diff = new Set([...action.keyCombo.keys.keys()].filter(key => !this.keyMap.has(key)))
    return !diff.size // return boolean from size
  }

  /**
   * Search for the right action, given a keyCombo, and execute its callbacks
   */
  private processActionCombos () {
    for (let action of this.actions.values()) {
      if (this.isQueueInAction(action)) {
        this.printDebugActionFound(action)
        for (let cb of action.callbacks) {
          cb()
        }
        // Don't continue after finding it
        return false
      }
    }
  }

  private printDebugKeyPressed (ev: KeyboardEvent) {
    logger.group('ShortcutJS: KeyPressed')
    logger.log('Key: ', ev.keyCode)
    logger.log('Current keyMap: ', [...this.keyMap.keys()])
    logger.groupEnd()
  }

  private printDebugActionFound (action: Action) {
    logger.group('%cShortcutJS: Action Matched', 'color: green')
    logger.log('Action: ', action.name)
    logger.log('Current keyMap: ', [...this.keyMap.keys()])
    logger.log(`${action.callbacks.size} callbacks found`)
    logger.groupEnd()
  }

  private processEvent (ev) {
    const wasAppended = this.addEventToQueue(ev)

    if (this.options.debug) {
      this.printDebugKeyPressed(ev)
    }

    if (wasAppended) {
      this.processActionCombos()
    }
  }
}

export const shortcutJS = new ShortcutJS() // Enforce singleton
export { KeyCombo } from './key-combo'
export { Action } from './action'
