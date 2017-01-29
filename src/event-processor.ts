import { Action } from './action'
import { logger } from './utils'

export class EventProcessor {
  public keyMap: Map<number, boolean>
  public lastEvent: KeyboardEvent

  constructor () {
    this.keyMap = new Map()
  }

  public reset () {
    this.keyMap = new Map()
  }

  public processEvent (ev: KeyboardEvent, actions: Map<string, Action>, debug: boolean) {
    const wasAppended = this.addEventToMap(ev)
    // Avoid repeated events
    if (!wasAppended) {
      return false
    }

    if (debug) {
      this.printDebugKeyPressed(ev)
    }

    if (wasAppended) {
      this.processActionCombos(ev, actions, debug)
    }
  }

  public cleanKeyMap (debug) {
    this.keyMap.clear()

    if (debug) {
      logger.log('ShortcutJS: Cleaned keyMap')
    }
  }

  /**
   * Search for the right action, given a keyCombo, and execute its callbacks
   */
  public processActionCombos (ev: KeyboardEvent, actions: Map<string, Action>, debug: boolean) {
    for (let action of actions.values()) {
      if (this.isQueueInAction(action)) {
        if (debug) {
          this.printDebugActionFound(action)
        }

        for (let cb of action.callbacks) {
          cb(ev)
        }
        // Don't continue after finding it
        return false
      }
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

  private addEventToMap (ev) {
    if (this.keyMap.has(ev.keyCode)) {
      return false
    } else {
      this.keyMap.set(ev.keyCode, true)
      return true
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
}
