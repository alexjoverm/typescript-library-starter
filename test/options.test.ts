import { Options, IOptions } from '../src/options'

describe('Options', () => {
  it('has expected defaults if no params are passed', () => {
    expect(new Options()).toEqual({ debug: false, preventDefault: false, onlyStateCombos: false })
  })

  it('merges options when valid options are passed', () => {
    const options = new Options()
    options.debug = true

    expect(new Options({ debug: true })).toEqual(options)
  })

  it('throws error if a non-expected property is passed', () => {
    expect(() => new Options({ppe: 3} as IOptions)).toThrowErrorMatchingSnapshot()
  })
})
