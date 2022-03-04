# AIMS
A stream-free riff on [@foxdonut's](https://github.com/foxdonut) 
brilliant and elegant [Meiosis pattern](https://meiosis.js.org). 

## Installation
`npm i -S aims-js`

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

## `i`

Of course, we could've set `name, height` at initialization:

```js
const i = {
    name: 'Flerb',
    height: 'not a lot'
}
const state = aims({ i })
```

`i` is our **Initial** state.

<hr>  

- accumulator
- actions
- patch inspection
