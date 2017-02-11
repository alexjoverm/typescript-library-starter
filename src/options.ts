export interface IOptions {
  debug?: boolean
  preventDefault?: boolean
  onlyStateCombos?: boolean
}

export class Options implements IOptions {
  /**
   * Prints combo states when processing and matching combos
   */
  public debug: boolean = false

  /**
   * Automatically calls preventDefault when an Action is triggered
   */
  public preventDefault: boolean = false

  /**
   * Only process combos with State keys (cmd, ctrl, alt, shift)
   */
  public onlyStateCombos: boolean = false

  constructor(obj?: IOptions) {
    if (obj && Object.keys(obj).some(key => typeof this[key] === 'undefined')) {
      throw new Error('Some of the options are not correct. Checkout the docs at https://github.com/coosto/ShortcutJS for more info')
    } else if (obj) {
      Object.assign(this, obj)
    }
  }
}
