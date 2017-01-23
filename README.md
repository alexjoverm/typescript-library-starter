# ShortcutJS
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

```javascript
// main.js
import { shortcutJS } from 'shortcutjs'
import shortcuts from './shortcuts.json'

shortcutJS.init({
  debug: true
})
shortcutJS.fromJson(shortcuts)


// yourComponent.js (any other file)
import { shortcutJS } from 'shortcutjs'

shortcutJS.subscribe('selectAll', () => console.log('ctrl a have been triggered!'))
```

**Note:** don't forget to unsubscribe to stop listening for that action.

## Features
 - Define all your shortcuts in a json file and load them from there
 - Subscribe/unsubscribe to/from Actions
 - UMD library, so supports ES6 imports, CommonJS, AMD and browser directly (with no module bundler)
 - Fully tested and covered
 - Manually add/remove actions and Combos

## Contribution guide



## API

WIP

### init
### subscribe
### unsubscribe
### fromJson
### addAction
### removeAction

## Credits

Made with :heart: by [@alexjoverm](https://twitter.com/alexjoverm)