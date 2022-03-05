# AIMS
A tiny, stream-free riff on [@foxdonut's](https://github.com/foxdonut) 
brilliant and elegant [Meiosis pattern](https://meiosis.js.org). 

## Installation
`npm i -S aims-js`

## Properties
|  | type                | description                                 | default         |
|------|---------------------|---------------------------------------------|-----------------|
| `a`  | function            | **Accumulator**: `(a, b) => ({})` | `Object.assign` |
| `i`  | object              | **Initial** state object                    | `{}`            |
| `m`  | function or array   | **Mutators**: `state => ({})` (or an array of these) | `[]`            |

## Usage

Begin here:

```js
import { aims } from 'aims-js'
const state = aims()
```

Now `state` is ready to use. Give it some properties:

```js
state.patch({ 
    name: 'Flerb', 
    height: 'not a lot' 
})
```

Ok, now let's access our state:

```js
const { name, height } = state.get()
console.log(name, height) // Flerb, not a lot
```

## Accumulator function: `a`
Any function with the signature `(a,b) => ({})` will do. Perhaps you want to 
use @barneycarroll's [patchinko](https://github.com/barneycarroll/patchinko) or 
@fuzetsu's [mergerino](https://github.com/fuzetsu/mergerino):

```js
import {merge} from 'mergerino'
const state = aims({ a: merge })
```

## Initial state object: `i`

Of course, in our first example, we could've set `name, height` at initialization:

```js
const i = {
    name: 'Jerry',
    thought: 'some of us are ridiculous'
}
const state = aims({ i })
const { name, thought } = state.get()
console.log(name, thought) // Jerry, some of us are ridiculous
```

## Mutators: `m`

Mutators, a.k.a. "actions", are functions which mutate our state. 
AIMS attaches them to the `state` object as "methods".

```js
const mutators = state => ({
    setFoo: foo => {
        state.patch({ foo })
    }
})
const state = aims({ m: mutators })

/* ...somwhere in your code... */

onclick: e => { state.setFoo(e.target.textContent) }
```
You may even have multiple, discrete sets of mutators, e.g.
`SocketMutators` and `RESTMutators`.  
```js
const state = aims({ m: [SocketMutators, RESTMutators] })
```

## Patch inspection

Sometimes there are imperatives associated with particular state changes. A 
great example is in TodoMVC: every data change must be persisted, as must 
every route change. Additionally, route changes need to update the URL. 
Rather than having several different mutators each kicking off the persistence 
routines, we can use a custom accumulator to inspect incoming patches and 
respond accordingly, all in one place. A [Mithril](https://mithril.js.org) 
implementation might look like this: 

```js
const a = (acc, patch) => {
    if (patch.route) m.route.set('/' + patch.route)
    const new_state = Object.assign(acc, patch)
    localStorage.setItem('todoapp-aims-mithril', JSON.stringify(new_state))
    return new_state
}
const state = aims({ a })
```
