class StateKeys {
  altKey: boolean = false
  ctrlKey: boolean = false
  metaKey: boolean = false
  shiftKey: boolean = false
}

/**
 * Returns mocked Event
 */
export function getMockedEvent(key: number, pStateKeys = new StateKeys()) {
  const stateKeys = Object.assign(new StateKeys(), pStateKeys)
  return Object.assign({ keyCode: key }, stateKeys) as KeyboardEvent
}
