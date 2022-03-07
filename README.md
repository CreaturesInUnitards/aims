# AIMS
A tiny, **stream-free*** riff on [@foxdonut's](https://github.com/foxdonut) 
brilliant and elegant [Meiosis pattern](https://meiosis.js.org).  
  
_* That's right, no streams were harmed in the making of this package. 
But of course you can bring some of your own if you want._ 

## What (and more importantly WHY) is it?  
### _AIMS Is Managing State_  
I love Meiosis. I also love a nice [godref](https://www.urbandictionary.com/define.php?term=godref).
I want my local state CRUD to be wrapped in a single thingy. So here we 
are: AIMS uses the kernel of the Meiosis pattern, shallowly, to create 
both infrastructure and methodology for managing application state, 
without requiring users to be self-loathing or good at wrestling*. Oh and 
it's also < 200 bytes with zero dependencies.  
  
_* Meiosis doesn't have these requirements either, but many other state 
management approaches do. You know who you are._

## Installation
`npm i -S aims-js`

## Properties
These are passed at instantiation to `aims`:

|      | type                | description                                          | default         |
|------|---------------------|------------------------------------------------------|-----------------|
| `a`  | function            | **Accumulator**: `(a, b) => ({})`                    | `Object.assign` |
| `i`  | object              | **Initial** state object                             | `{}`            |
| `m`  | function or array   | **Mutators**: `state => ({})` (or an array of these) | `[]`            |

## Methods
These are attached to the returned `aims` instance:

|        | usage                                             | description                                 |
|--------|---------------------------------------------------|------------------------------------------|
| `get`  | `const foo = state.get()`                         | returns the current state |
| `patch`| `state.patch({ bar: 'baz' })`                     | uses the `a` function to apply the passed-in patch,<br>which in turn generates a whole new `state` |

## Usage
### _Accumulator + Initial_state + Mutators = State_ 

Begin here:

```js
import aims from 'aims-js'
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
import merge from 'mergerino'
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

Mutators are easier to illustrate than to explain: 

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
Each mutator is a closure which accepts `state` as its parameter,
and returns an object with `state` in scope. `aims` attaches the
properties of each returned object to `state`, so references can
be made via `state.myMethod`.

You may have multiple, discrete sets of mutators, e.g.
`SocketMutators` and `RESTMutators`.  
```js
const state = aims({ m: [SocketMutators, RESTMutators] })
```
In this case, it may be advisable to set namespaces, since `aims` is
determinedly tiny and won't detect collisions for you.
```js
// create the "Socket" namespace
const SocketMutators = state => ({
    Socket: {
        setFoo: foo => {
            state.patch({ foo })
        }
    }
})
// ...and the "REST" namespace 
const RESTMutators = state => ({
    REST: {...}
})

const state = aims({m: [SocketMutators, RESTMutators]})

// destructure state — NOT state.get() 
const { Socket } = state
Socket.setFoo('jack')

console.log(state.get()) // { foo: 'jack' }
```

## Patch inspection

Sometimes there are imperatives associated with particular state changes. 
TodoMVC is a great example — every data change must be persisted, as must 
every `filter` change, which must change the URL for routing purposes. 
Rather than having several mutators each kicking off persistence and 
routing, we can use a custom accumulator to inspect incoming patches and 
respond accordingly, all in one place. A [Mithril](https://mithril.js.org) 
implementation might look like this: 

```js
const a = (acc, patch) => {
    // update the route on filter changes  
    if (patch.filter) m.route.set('/' + patch.filter)
    
    // update localStorage with new state
    const new_state = Object.assign(acc, patch)
    localStorage.setItem('todoapp-aims-m', JSON.stringify(new_state))
    
    return new_state
}

const state = aims({ a })
```

## Examples
- [Two-way binding](https://tinyurl.com/aims-two-way-bindings)
- [8-bit color picker](https://tinyurl.com/aims-8bit-color-picker)
- [TodoMVC](https://tinyurl.com/aims-m-todos)

## _Appendix: mapping to redraw_
I made AIMS with MithrilJS in mind. It works out great! But a big part 
of why is that Mithril's autoredraw takes care of itself. If you want 
to use AIMS with other view libraries, you'll almost certainly need to 
use a custom accumulator which calls your rendering function after 
patching. Since the rendering function will need to pass `state` to the 
view, and since the `state` reference inside the accumulator's closure
is now stale, the rendering function must be called asynchronously:
```js
const a = (then, now) => {
    requestAnimationFrame(() => { MyViewLibrary.render(MyView(state)) })
    return Object.assign({...then}, now)
}
const state = aims({ a })
```
[Here's a quick React example](https://tinyurl.com/aims-quick-react)
