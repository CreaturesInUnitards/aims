import { AimsMutatorFn } from "../../index";

export type IBar = { $thing: string };
export type MBar = {
  setThing: ($thing: string) => void;
};
export const MuBar: AimsMutatorFn<IBar, MBar> = (_state, patch) => ({
  setThing: ($thing) => {
    patch!({ $thing });
  },
});
export const Bar: IBar = { $thing: "Jack" };
