import { AimsSafeMutatorFn } from "../../index";

export type IFoo = { $name: string; $hooba: number };
export type MFoo = { setName: () => void };
export const MuFoo: AimsSafeMutatorFn<IFoo, MFoo> = (state, patch) => ({
  setName: () => {
    const { $name } = state.get();
    patch({ $name: $name + "." });
  },
});
export const Foo: IFoo = { $name: "Scotty", $hooba: 9 };
