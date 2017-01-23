import { KeyCombo } from './key-combo'

/**
 * Action class to use for the ShortcutJS
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