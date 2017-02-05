export interface Logger extends Console {
  group(title: string, options?: string)
  groupCollapsed(title: string, options?: string)
}

export const logger = console as Logger

export function compareSets(set1: Set<any>, set2: Set<any>) {
  if (set1.size !== set2.size) {
    return false
  }
  const set1arr = Array.from(set1)
  const set2arr = Array.from(set2)

  for (let i = 0; i < set1arr.length; i++) {
    if (set1arr[i] !== set2arr[i]) {
      return false
    }
  }

  return true
}
