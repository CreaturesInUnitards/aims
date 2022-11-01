# TS Demo
`npm start`  
  
...  



# AIMS
A tiny, **stream-free*** riff on [@foxdonut's](https://github.com/foxdonut) 
brilliant and elegant [Meiosis pattern](https://meiosis.js.org).  
  
_* That's right, no streams were harmed in the making of this package. 
But of course you can bring some of your own if you want._ 

## What (and more importantly WHY) is it?  
### _AIMS Is Managing State_  
I love Meiosis. I also love a nice [godref](https://www.urbandictionary.com/define.php?term=godref). 
So here we are: AIMS uses the kernel of the Meiosis pattern, shallowly, to create 
both infrastructure and methodology for managing application state, 
without requiring users to be self-loathing or good at wrestling*. Oh and 
it's also just over 750 bytes with zero dependencies.  
  
_* Meiosis doesn't have these requirements either, but many other state 
management approaches do. You know who you are._

## Installation
`npm i -S aims-js`

## Properties
These are passed at instantiation to `aims`:

|      | type                | description                                                                 | default  |
|------|---------------------|-----------------------------------------------------------------------------|----------|
| `a`  | function            | **Accumulator**: `(x, y) => ({})`                                           | `merge`* |
| `i`  | object              | **Initial** state object                                                    | `{}`     |
| `m`  | function or array   | **Mutators/Measurements**: `(state, patch?) => ({})` (or an array of these) | `[]`     |
| `s`  | boolean             | **Safemode**                                                                | `false`  |
  
_* `merge` is a slightly modified port of `mergerino` by [@fuzetsu](https://github.com/fuzetsu/mergerino)._

## Methods
These are attached to the returned `aims` instance:

|             | usage                                             | description                                                                                         |
|-------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `get`       | `const foo = state.get()`                         | returns the current state                                                                           |
| `patch`* ** | `state.patch({ bar: 'baz' })`                     | uses the `a` function to apply the passed-in patch,<br>which in turn generates a whole new `state`  |
  
_* In AIMS parlance, the word "patch" has dual meanings: as a verb, it's the 
method we use to "patch" our state with new values; as a noun, it's the object which provides those values. Try not to use both in the same sentence :) "Patrick, please patch our state with this patch."_  

_** In `safemode`, `patch` is not a property of `state`, and 
instead is passed as the second argument to `m`._

## Usage
### _Accumulator, Initialization, Mutators/Measurements, Safemode_ 

Begin here:

```js
import aims from 'aims-js'
const state = aims()
```

Now `state` is ready to use. Give it some properties:

```js
state.patch({ 
    name: 'Jack', 
    height: 'Short' 
})
```

Ok, now let's access our state:

```js
const { name, height } = state.get()
console.log(name, height) // Jack Short
```

## Accumulator function: `a`
Any function with the signature `(previous_state, incoming_patch) => ({})` (e.g. `Object.assign`) will do:

```js
// low-rent, shallow immutability
const state = aims({ 
  a: (prev, incoming) => Object.assign({}, prev, incoming) 
})
```

## Initialization: `i`
Of course, in our first example, we could've set `name, height` at initialization:

```js
const i = {
    name: 'Mike',
    height: 'Average'
}

const state = aims({ i })
const { name, height } = state.get()
console.log(name, height) // Mike Average
```

## Mutators: `m`
Mutators are easier to illustrate than to explain: 

```js
const m = state => ({
    //  MUTATION FUNCTIONS: 
    //  apply patches to state
    
    setFirstName: firstName => {
        state.patch({ firstName })
    },
    setLastName: lastName => {
        state.patch({ lastName })
    },
  
    // MEASUREMENT FUNCTIONS: 
    // side effects, computations, and whatever 
    // else you want to be able to access via 
    // `state.myMeasurement(...)`
    fullName: () => {
      const { firstName, lastName } = state.get()
      return `${firstName} ${{lastName}}`
    },
    
})

const state = aims({ m: mutators })

/* ...somwhere in your code... */

onclick: e => { state.setFoo(e.target.textContent) }
```
Each mutator is a closure which accepts `state` as its parameter,
and returns an object with `state` in scope. `aims` attaches the
properties of each returned object to `state`, so calls can
be made via `state.myMethod(...)`.

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

## Safemode: `s`
In larger codebases, it may be desirable to restrict mutations to actions 
only, eliminating occurences of `state.patch({...})` within application 
views and elsewhere. Safemode achieves this by omitting `state.patch` and 
instead passing the patching function as a second parameter to Mutators, e.g.

```js
const state = aims({
  s: true,
  m: (state, patch) => ({
    setFoo: foo => {
      patch({ foo })
    }
  })
})
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
import aims, { merge } from 'aims-js'
const a = (prev, incoming) => {
    // update the route on filter changes  
    if (incoming.filter) m.route.set('/' + incoming.filter)
    
    // update localStorage with new state
    const new_state = merge(prev, incoming)
    localStorage.setItem('todoapp-aims-m', JSON.stringify(new_state))
    
    return new_state
}

const state = aims({ a })
```

## Integrating with view libraries*
_* Unless you're using an auto-redrawing library or framework like Mithril.js, in which case you can skip this step._  

To render your view, pass a function to the second argument of `aims`, which 
in turn takes `state` as its own argument, and render your App within the 
function. So for e.g. React:

```jsx
import aims from 'aims-js'
import { createRoot } from 'ReactDOM'

const root = createRoot(document.getElementById('app'))

// Here the reference returned from `aims` is 
// unneeded, since we pass `state` to the function 
// provided, so we can just call `aims` directly
aims({}, state => {
  root.render(<App state={state} />)
})
```

## Examples
- [Two-way binding](https://tinyurl.com/aims-two-way-bindings)
- [8-bit color picker](https://tinyurl.com/aims-8bit-color-picker)
- [TodoMVC](https://tinyurl.com/aims-m-todos)