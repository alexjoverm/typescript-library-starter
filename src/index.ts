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
import { IOptions, Options } from './options'

import { Action } from './action'
import { EventProcessor } from './event-processor'
import { JsonParser } from './json-parser'
import { KeyCombo } from './key-combo'

import { keyContainer } from './key-container'

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
  public options: Options
  public eventProcessor: EventProcessor
  private initialized: boolean

  constructor () {
    this.actions = new Map()
    this.initialized = false
    this.eventProcessor = new EventProcessor()
  }

  public init (options: IOptions = null) {
    if (!this.initialized) {
      this.options = new Options(options)

      window.addEventListener('keydown', this.processEvent.bind(this))
      window.addEventListener('keyup', this.cleanKeyMap.bind(this))

      this.initialized = true
    }
  }

  public reset () {
    this.actions = new Map()
    this.eventProcessor.reset()
    this.initialized = false

    window.removeEventListener('keydown', this.processEvent)
    window.removeEventListener('keyup', this.cleanKeyMap)
  }

  public loadFromJson(json, options: IOptions = null) {
    this.init(options)
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
      action.addCallback(cb)
    } else {
      throw new Error(`Action ${actionName} does not exists`)
    }
  }

  public unsubscribe (actionName, cb = null) {
    if (this.actions.has(actionName)) {
      const action = this.actions.get(actionName)
      action.removeCallback(cb)
    } else {
      throw new Error(`Action ${actionName} does not exists`)
    }
  }

  public processEvent (ev: KeyboardEvent) {
    console.log('EVEEEEEEENT')
    this.eventProcessor.processEvent(ev, this.actions, this.options.debug)
  }

  public cleanKeyMap () {
    this.eventProcessor.cleanKeyMap(this.options.debug)
  }
}

export const shortcutJS = new ShortcutJS() // Enforce singleton
export { KeyCombo } from './key-combo'
export { Action } from './action'
