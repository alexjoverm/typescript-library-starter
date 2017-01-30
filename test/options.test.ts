import { Options, IOptions } from '../src/options'

describe('Options', () => {
  it('has expected defaults if no params are passed', () => {
    expect(new Options()).toEqual({ debug: false, stopPropagation: false })
  })

  it('merges options when valid options are passed', () => {
    expect(new Options({ debug: true })).toEqual({ debug: true, stopPropagation: false })
  })

  it('has expected defaults if no params are passed', () => {
    expect(() => new Options({ppe: 3} as IOptions)).toThrowErrorMatchingSnapshot()
  })
})
