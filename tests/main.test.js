import o from "ospec"
import aims from "../dist/aims.js"

o.spec("aims", () => {
  o.spec("zeroconf", () => {
    const state = aims()
    o.spec("direct patch", () => {
      const firstPatch = { foo: 1 }
      state.patch(firstPatch)
      o("patch succeeds", () => {
        o(state.get()).deepEquals(firstPatch)
      })
      o("patch replaces state", () => {
        o(state.get()).notEquals(firstPatch)
      })
      o("can update property", () => {
        state.patch({ foo: 2 })
        o(state.get().foo).equals(2)
      })
      o("can add properties", () => {
        state.patch({ bar: 3 })
        o(state.get()).deepEquals({ foo: 2, bar: 3 })
      })
      o("can remove properties", () => {
        state.patch({ foo: undefined })
        o(state.get()).deepEquals({ bar: 3 })
      })
    })

    o.spec("works for all types", () => {
      const state = aims()
      state.patch({ s: "string", b: true, n: 1, o: {} })
      o("works for strings", () => {
        o(state.get().s).equals("string")
      })
      o("works for booleans", () => {
        o(state.get().b).equals(true)
      })
      o("works for numbers", () => {
        o(state.get().n).equals(1)
      })
      o("works for objects", () => {
        o(state.get().o).deepEquals({})
      })
    })
  })

  o.spec("with initializer", () => {
    const state = aims({ i: { foo: "bar" } })
    o("init works", () => {
      o(state.get()).deepEquals({ foo: "bar" })
    })

    const firstPatch = { foo: "mike", bar: "jack" }
    o("can patch after init", () => {
      state.patch(firstPatch)
      o(state.get()).deepEquals(firstPatch)
    })
    o("patch works immutably", () => {
      o(state.get()).notEquals(firstPatch)
    })
  })

  o.spec("with mutators", () => {
    const state = aims({
      m: (state) => ({
        setFoo: (foo) => {
          state.patch({ foo })
        },
      }),
    })
    state.setFoo("stan")
    o("mutator works", () => {
      o(state.get()).deepEquals({ foo: "stan" })
    })
  })
})
