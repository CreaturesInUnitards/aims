import { AimsMutatorFn } from "../../index";

export type IFoo = { $name: string };
export type MFoo = { setName: () => void };
export const MuFoo: AimsMutatorFn<IFoo, MFoo> = (state, patch) => ({
  setName: () => {
    const { $name } = state.get();
    patch!({ $name: $name + "." });
  },
});
export const Foo: IFoo = { $name: "Scotty" };
