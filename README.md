# ShortcutJS
[![npm](https://img.shields.io/npm/v/shortcutjs.svg)](https://www.npmjs.com/package/shortcutjs)
[![Travis](https://img.shields.io/travis/coosto/ShortcutJS.svg)](https://travis-ci.org/coosto/ShortcutJS)
[![Coverage Status](https://coveralls.io/repos/github/coosto/ShortcutJS/badge.svg?branch=master)](https://coveralls.io/github/coosto/ShortcutJS?branch=master)
[![bitHound Code](https://www.bithound.io/github/coosto/ShortcutJS/badges/code.svg)](https://www.bithound.io/github/coosto/ShortcutJS)
[![bitHound Dependencies](https://www.bithound.io/github/coosto/ShortcutJS/badges/dependencies.svg)](https://www.bithound.io/github/coosto/ShortcutJS/master/dependencies/npm)
[![npm](https://img.shields.io/npm/dt/shortcutjs.svg)](https://www.npmjs.com/package/shortcutjs)


Keyboard manager for javascript and typescript, made for humans :sunglasses:

Do you have a very interactive app with lots of shortcuts? ShortcutJS makes defining all your shortcuts very easy, by defining **Combos** bound to **Actions**. Even better, you can define them all **in JSON file**.

## Usage

```bash
yarn add shortcutjs
# or
npm install shortcutjs --save
```
Define a `shortcuts.json` file with all your shortcuts

```json
[
  {
    "combo": "ctrl a",
    "action": "selectAll"
  },
  {
    "combo": "ctrl alt f",
    "action": "find"
  }
]
```

_Note: action means just an action name to subscribe to_

```javascript
// --> main.js
import { shortcutJS } from 'shortcutjs'
import shortcuts from './shortcuts.json'

// optional debug param
shortcutJS.fromJson(shortcuts, { debug: true })


// --> yourComponent.js (any other file)
import { shortcutJS } from 'shortcutjs'

// Subscribe to the action created from the json
shortcutJS.subscribe('selectAll', ev => console.log('ctrl a have been triggered!', ev))
```

Checkout the **[Full API documentation](https://coosto.github.io/ShortcutJS/classes/_shortcut_.shortcut.html)**

## Combos and Supported keys

A combo is composed by 1 or more **state keys** `(ctrl, alt, shift, cmd)` plus 1 or more supported keys. They're case insensitive.

Supported keys:
 - Basic letters (a-z)
 - Numbers (0-9)
 - Navigation keys (left, up, enter, backspace, end...)
 - Function keys (f1, f2...)
 - Numpad keys (num0, num1, num*, num/...)

You can see all available keys in [keyMap of key-container.ts](src/key-container.ts).

## Options

When initializing shortcutJS by calling `fromJson` or `init`, you can pass an options object:

```js
{
  debug: false, // Prints debug notes in the console
  preventDefault: false, // Automatically calls ev.preventDefault() when an action is matched
  onlyStateCombos: false, // Only process combos which includes any state key (cmd, ctrl, alt, shift)
}
```

## API

- `fromJson(json[], options)`: initializes shortcutJS from a json array
- `subscribe(actionName, cb)`: binds a callback to an action, given its name
- `unsubscribe(actionName, cb?)`: unbinds a callback from an action, given its name. If no cb specified, unbinds all.
- `pause()`: pauses execution of shortcutJS
- `resume()`
- `isPaused()`
- `addAction(action: Action)`: dynamically adds an action
- `init(options)`: (don't use it if you've used fromJson). Initializes shortcutJS.
- `reset()`: resets shortcutJS, cleans variables and unbind events

## Examples

When loading from json, you only need to use `fromJson`, `subscribe` and `unsubscribe` methods.

### Pausing/Resuming

```javascript
import { shortcutJS } from 'shortcutjs'
import shortcuts from './shortcuts.json'

shortcutJS.fromJson(shortcuts)

shortcutJS.pause()
console.log(shortcutJS.isPaused()) // true
shortcutJS.resume()
console.log(shortcutJS.isPaused()) // false
```

### Manually creating Actions and Combos

```javascript
import { shortcutJS, Action, KeyCombo } from 'shortcutjs'

shortcutJS.init({ debug: true }) // optional "options" parameter

// Add action
const openAction = new Action('open', KeyCombo.fromString('ctrl a'))
shortcutJS.addAction(openAction)

// --> From anotherComponent.js
const openCb = ev => console.log(ev)
shortcutJS.subscribe('open', openCb)

// Later, when leaving the view...
shortcutJS.unsubscribe('open', openCb)
```

## Contribution guide

```
# Fork repo
git clone https://github.com/YOUR-USERNAME/ShortcutJS
yarn install # or npm install
# Start coding. For commit, use npm run commit (otherwise it will tell you to do it ;)
# Open a PR
```
_**Note**: Use node 7.5, or <= 7.2. Because of a [regression in Node 7.3](https://github.com/nodejs/node/issues/10492), the tests would fail in Node 7.3 and 7.4_

ShortcutJS project setup applies CI (with Travis) + CD (Semantic Release) using **conventions** ([commitizen](https://github.com/commitizen/cz-cli), with [conventional-commit](https://github.com/commitizen/conventional-commit-types) and [conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)) and git hooks _instead of large contribution rules_.

As a suggestion, follow [clean code](https://github.com/ryanmcdermott/clean-code-javascript) practises


## Credits

Made with :heart: by [@alexjoverm](https://twitter.com/alexjoverm), supported by [Coosto](https://www.coosto.com/en), [@coostodev](https://twitter.com/coostodev)
