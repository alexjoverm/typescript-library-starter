/*
  Copyright 2017 Alex Jover Morales (alexjovermorales@gmail.com)

  Licensed under the Apache License, Version 2.0 (the "License")
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

export interface ShortcutJS {
  actions: Map<string, Action>
  options: Options
  eventProcessor: EventProcessor
  init(options?: IOptions): void
  reset(): void
  loadFromJson(json: any, options?: IOptions): void
  addAction(action: Action): void
  subscribe(actionName: string, cb: Function): void
  unsubscribe(actionName: string, cb?: Function): void
  processEvent(ev: KeyboardEvent): void
  cleanCombo(): void
  pause(): void
  resume(): void
  isPaused(): boolean
}

/**
 * Shortcut is the class for creating the singleton public instance shortcutJS.
 * It makes use and coordinates other classes in order to process events and checking matching.
 */
class Shortcut implements ShortcutJS {
  /**
   * Loaded map of actions
   */
  public actions: Map<string, Action>

  /**
   * Holds the behavioural options of shortcutJS
   */
  public options: Options

  /**
   * Instance of the eventProcessor. Internal usage
   */
  public eventProcessor: EventProcessor

  /**
   * For checking initialization
   */
  private initialized: boolean

  /**
   * For checking initialization
   */
  private paused: boolean

  constructor () {
    this.resetState()
  }

  /**
   * Sets up events and options, if not initialized
   */
  public init (options: IOptions = null) {
    if (!this.initialized) {
      this.options = new Options(options)

      window.addEventListener('keydown', this.processEvent.bind(this))
      window.addEventListener('keyup', this.cleanCombo.bind(this))

      this.initialized = true
    }
  }

  /**
   * Tears down event handlers and resets internal variables
   */
  public reset () {
    this.resetState()

    window.removeEventListener('keydown', this.processEvent)
    window.removeEventListener('keyup', this.cleanCombo)
  }

  /**
   * Initializes shortcutJS from a JSON array
   */
  public loadFromJson(json: any[], options: IOptions = null) {
    this.init(options)
    JsonParser.parse(this, json)
  }

  public addAction (action: Action) {
    if (!(action instanceof Action)) {
      throw new Error('You must pass an Action instance object')
    }

    this.actions.set(action.name, action)
  }

  public subscribe (actionName: string, cb: Function) {
    if (this.actions.has(actionName)) {
      const action = this.actions.get(actionName)
      action.addCallback(cb)
    } else {
      throw new Error(`Action ${actionName} does not exists`)
    }
  }

  public unsubscribe (actionName: string, cb: Function = null) {
    if (this.actions.has(actionName)) {
      const action = this.actions.get(actionName)
      action.removeCallback(cb)
    } else {
      throw new Error(`Action ${actionName} does not exists`)
    }
  }

  public processEvent (ev: KeyboardEvent) {
    if (!this.paused) {
      this.eventProcessor.processEvent(ev, this.actions, this.options)
    }
  }

  public cleanCombo () {
    this.eventProcessor.cleanCombo(this.options)
  }

  /**
   * Returns whether shortcutJS is running
   */
  public isPaused () {
    return this.paused
  }

  /**
   * Pauses execution of shortcutJS
   */
  public pause () {
    this.paused = true
  }

  /**
   * Resumes execution of shortcutJS
   */
  public resume () {
    this.paused = false
  }

  /**
   * Resets state and vars
   */
  private resetState() {
    this.actions = new Map()
    this.initialized = false
    this.eventProcessor = new EventProcessor()
    this.paused = false
  }
}

export const shortcutJS: ShortcutJS = new Shortcut() // Enforce singleton
export * from './action'
export * from './event-processor'
export * from './json-parser'
export * from './key-combo'
export * from './key-container'
export * from './options'
