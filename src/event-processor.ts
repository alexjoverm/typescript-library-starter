import { Action } from './action'
import { KeyCombo } from './key-combo'
import { logger, compareSets } from './utils'

export class EventProcessor {
  public currentCombo: KeyCombo
  public lastEvent: KeyboardEvent

  constructor () {
    this.currentCombo = new KeyCombo()
  }

  public reset () {
    this.currentCombo = new KeyCombo()
  }

  public processEvent (ev: KeyboardEvent, actions: Map<string, Action>, debug: boolean) {
    const wasAppended = this.currentCombo.addEvent(ev)

    // Avoid repeated events
    if (!wasAppended) {
      return false
    }

    if (debug) {
      this.printDebugKeyPressed(ev)
    }

    this.processActionCombos(ev, actions, debug)
  }

  public cleanCombo (debug) {
    this.reset()

    if (debug) {
      logger.log('ShortcutJS: Cleaned keyMap')
    }
  }

  /**
   * Search for the right action, given a keyCombo, and execute its callbacks
   */
  public processActionCombos (ev: KeyboardEvent, actions: Map<string, Action>, debug: boolean) {
    for (let action of actions.values()) {
      if (this.matchesComboAction(action)) {
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
   */
  private matchesComboAction (action: Action) {
    return KeyCombo.isEqual(this.currentCombo, action.keyCombo)
  }

  private printDebugKeyPressed (ev: KeyboardEvent) {
    logger.group('ShortcutJS: KeyPressed')
    logger.log('Key: ', ev.keyCode)
    logger.group('Current combo:')
    logger.log('Keys: ', [...this.currentCombo.keys])
    logger.log('State keys: ', this.currentCombo.stateKeys)
    logger.groupEnd()
    logger.groupEnd()
  }

  private printDebugActionFound (action: Action) {
    logger.group('%cShortcutJS: Action Matched', 'color: green')
    logger.log('Action: ', action.name)
    logger.group('Current combo:')
    logger.log('Keys: ', [...this.currentCombo.keys])
    logger.log('State keys: ', this.currentCombo.stateKeys)
    logger.groupEnd()
    logger.log(`${action.callbacks.size} callbacks found`)
    logger.groupEnd()
  }
}
