import keys from './keymap'

/**
 * First Version of a KeyManager.
 *
 * Ideally, KeyManager could hold the keydown and keyup events, and execute the actions according
 * to the key combos.
 *
 * WARNING: careful when adding combos with CTRL key on it. If you happen to trigger a by-default
 * browser shortcut (like CTRL-T) the keyup event will not be performed
 *
 * @todo Improvements:
 *  - Allow loading actions from json
 *  - Avoid repetition of mouseDownEvents if the last key is the same
 *  - Performance of processActionCombos
 *
 * @class KeyManager
 */

class KeyManager {
  public actions: Map<string, Action>
  public keyMap: Map<string, boolean>
  public debugMode: boolean


  // ********* PRIVATE API (only internal use) **********

  /**
   * Private constructor
   *
   * @memberOf KeyManager
   */
  constructor () {
    // With Maps we avoid events duplication, achieve immutability and performance
    this.actions = new Map()
    this.keyMap = new Map()
    this.debugMode = false
  }

  addEventToQueue (ev) {
    if (this.keyMap.has(ev.keyCode  )  ) {
      return false
    } else {
      this.keyMap.set(ev.keyCode, true)
      return true
    }
  }

  /**
   * Checks whether the que matches a particular action
   * @todo Performance improvement
   *   - Idea 1: Using binary operators for comparison
   *   - Idea 2: Generating uuid's per KeyCombo
   * @param {any} action
   */
  isQueueInAction (action) {
    const diff = new Set([...action.keyCombo.keys.keys()].filter(key => !this.keyMap.has(key)))
    return !diff.size // return boolean from size
  }

  /**
   * Cleans the event Queue
   */
  removeKey (ev) {
    this.keyMap.delete(ev.keyCode)
    if (this.debugMode) {
      console.log('Removed key: ', ev.keyCode)
      console.log('Queue: ', [...this.keyMap.keys()])
    }
  }

  /**
   * Search for the right action, given a keyCombo, and execute its callbacks
   */
  processActionCombos () {
    for (let action of this.actions.values()) {
      if (this.isQueueInAction(action)) {
        for (let cb of action.callbacks) {
          cb()
        }
        // Don't continue after finding it
        return false
      }
    }
  }

  processEvent (ev) {
    const wasAppended = this.addEventToQueue(ev)

    if (this.debugMode) {
      console.log('Current: ', ev.keyCode)
      console.log('Queue: ', [...this.keyMap.keys()])
    }

    if (wasAppended) {
      this.processActionCombos()
    }
  }

  // *********** PUBLIC API ************

  init () {
    window.addEventListener('keydown', this.processEvent.bind(this))
    window.addEventListener('keyup', this.removeKey.bind(this))
  }

  addAction (action) {
    if (!(action instanceof Action)) {
      throw new Error('You must pass an Action instance object')
    }

    this.actions.set(action.name, action)
  }

  subscribe (actionName, cb) {
    if (this.actions.has(actionName)) {
      const action = this.actions.get(actionName)
      action.callbacks.add(cb)
    } else {
      throw new Error(`Action ${actionName} does not exists`)
    }
  }

  unsubscribe (actionName, cb = null) {
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
}

/**
 * Simple KeyCombo class
 * @export
 * @class KeyCombo
 */
export class KeyCombo {
  public keys: Set<number>

  /**
   * Creates an instance of KeyCombo.
   * @param {array} keys
   */
  constructor (keys: number[]) {
    this.keys = new Set(keys)
  }
}

/**
 * Action class to use for the KeyManager
 * @export
 * @class Action
 */
export class Action {
  public name: string
  public keyCombo: KeyCombo
  public callbacks: Set<Function>
  /**
   * Creates an instance of Action.
   * @param {sring} name
   * @param {KeyCombo} keyCombo
   */
  constructor (name: string, keyCombo: KeyCombo) {
    if (!(keyCombo instanceof KeyCombo)) {
      throw new Error('The second parameter (keyCombo) must be an instance of KeyCombo')
    }

    this.name = name
    this.keyCombo = keyCombo
    this.callbacks = new Set()
  }
}

// Singleton pattern
export const keyManager = new KeyManager()

export const keyCodes = keys
