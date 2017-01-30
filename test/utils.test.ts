import { compareSets } from '../src/utils'

describe('utils', () => {
  describe('compareSets', () => {
    it('returns false if size of sets is different', () => {
      expect(compareSets(new Set<any>(), new Set<any>([2]))).toBeFalsy()
    })

    it('returns false if size of sets is different', () => {
      const set1 = new Set<any>([1, 2])
      const set2 = new Set<any>([2, 1])
      expect(compareSets(set1, set2)).toBeFalsy()
    })

    it('returns false if size of sets is different', () => {
      const set1 = new Set<any>([1, 2])
      const set2 = new Set<any>([1, 2])
      expect(compareSets(set1, set2)).toBeTruthy()
    })
  })
})
