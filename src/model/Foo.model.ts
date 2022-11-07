import { SafeMutatorFn } from "../../aims"

export type IFoo = { $name: string; $hooba: number }
export type MFoo = { setName: () => void }
export const MuFoo: SafeMutatorFn<IFoo, MFoo> = (state, patch) => ({
  setName: () => {
    const { $name } = state.get()
    patch({ $name: $name + "." })
  },
})
export const Foo: IFoo = { $name: "Scotty", $hooba: 9 }
