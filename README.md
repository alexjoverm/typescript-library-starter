# ShortcutJS
[![npm](https://img.shields.io/npm/v/shortcutjs.svg)](https://www.npmjs.com/package/shortcutjs)
[![Travis](https://img.shields.io/travis/coosto/ShortcutJS.svg)]()
[![Coveralls](https://img.shields.io/coveralls/coosto/ShortcutJS.svg)]()
[![npm](https://img.shields.io/npm/dt/shortcutjs.svg)](https://www.npmjs.com/package/shortcutjs)
[![David](https://img.shields.io/david/coosto/ShortcutJS.svg)]()
[![David](https://img.shields.io/david/dev/coosto/ShortcutJS.svg)]()

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

**Note:** don't forget to unsubscribe to stop listening for that action.

## Features
 - Define all your shortcuts in a json file and load them from there
 - Subscribe/unsubscribe to/from Actions
 - UMD library, so supports ES6 imports, CommonJS, AMD and browser directly (with no module bundler)
 - Fully tested and covered
 - Manually add/remove actions and Combos

## Contribution guide

WIP


## API

When loading from json, you only need to use `fromJson`, `subscribe` and `unsubscribe` methods

### fromJson(json, options)
_options_: defaults to
```
{
  debug: false
}
```

### subscribe(actionName, callback)
### unsubscribe(actionName, callback?)
If `callback` is not specified, it will unregister all callbacks

### addAction
### removeAction
### init

## Credits

Made with :heart: by [@alexjoverm](https://twitter.com/alexjoverm)