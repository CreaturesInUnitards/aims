import { create } from "../../lib/aims"
import { SafeState } from "../../aims"
import { Foo, IFoo, MFoo, MuFoo } from "./Foo.model"
import { Bar, IBar, MBar, MuBar } from "./Bar.model"

export type STATE = SafeState<IFoo & IBar, MFoo & MBar>

export const createState = () => {
  let button: HTMLElement | null

  const state: STATE = create(
    {
      i: { ...Foo, ...Bar },
      m: [MuFoo, MuBar],
      s: true,
    },
    (state: STATE) => {
      if (!button) {
        button = document.getElementById("counter")
        button!.onclick = (_e) => {
          const { $thing } = state.get()
          state.setName()
          state.setThing($thing + ".")
        }
      }
      const { $name, $thing } = state.get()
      button!.textContent = `${$name} ${$thing} ${state.getEverybody()}`
    }
  )

  return state
}
