export interface IOptions {
  debug?: boolean
  stopPropagation?: boolean
}

export class Options implements IOptions {
  public debug: boolean = false
  public stopPropagation: boolean = false

  constructor(obj?: IOptions) {
    if (obj && Object.keys(obj).some(key => typeof this[key] === 'undefined')) {
      throw new Error('Some of the options are not correct. Checkout the docs at https://github.com/coosto/ShortcutJS for more info')
    } else if (obj) {
      Object.assign(this, obj)
    }
  }
}
