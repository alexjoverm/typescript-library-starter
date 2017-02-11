import { Action } from './action'
import { KeyCombo } from './key-combo'
import { logger, compareSets } from './utils'
import { IOptions } from './options'

/**
 * Process events, mantaining a temporal combo. Then compares combos to find matches.
 */
export class EventProcessor {
  /**
   * Combo composed by the Keyboard Events keys. It is cleaned on keyup.
   */
  public currentCombo: KeyCombo

  constructor () {
    this.reset()
  }

  /**
   * Resets the current Combo
   */
  public reset () {
    this.currentCombo = new KeyCombo()
  }

  /**
   * Process a keyboardEvent
   */
  public processEvent (ev: KeyboardEvent, actions: Map<string, Action>, options: IOptions) {
    const wasAppended = this.currentCombo.addEvent(ev)

    // Avoid repeated events
    if (!wasAppended) {
      return false
    }

    const shouldProcess = !options.onlyStateCombos ||
      options.onlyStateCombos && this.currentCombo.hasStateKeys()

    if (shouldProcess) {
      if (options.debug) {
        this.printDebugKeyPressed(ev)
      }

      this.processActionCombos(ev, actions, options)
    }
  }

  /**
   * Resets the combo and prints debug output
   */
  public cleanCombo (options: IOptions) {
    this.reset()

    if (options.debug) {
      logger.log('ShortcutJS: Cleaned keyMap')
    }
  }

  /**
   * Search for matching actions, given a keyCombo, and execute its callbacks
   */
  public processActionCombos (ev: KeyboardEvent, actions: Map<string, Action>, options: IOptions) {
    for (let action of actions.values()) {
      if (this.matchesComboAction(action)) {
        if (options.debug) {
          this.printDebugActionFound(action)
        }
        if (options.preventDefault) {
          ev.preventDefault()
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
   * Checks whether the currentCombo matches a particular action
   */
  private matchesComboAction (action: Action) {
    return KeyCombo.isEqual(this.currentCombo, action.keyCombo)
  }

  /**
   * Prints keydown events
   */
  private printDebugKeyPressed (ev: KeyboardEvent) {
    logger.group('ShortcutJS: KeyPressed')
    logger.log('Key: ', ev.keyCode)
    logger.group('Current combo:')
    logger.log('Keys: ', [...this.currentCombo.keys])
    logger.log('State keys: ', this.currentCombo.stateKeys)
    logger.groupEnd()
    logger.groupEnd()
  }

  /**
   * Prints when action matches
   */
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
