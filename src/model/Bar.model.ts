import { AimsSafeMutatorFn } from "../../aims";

export type IBar = { $thing: string };
export type MBar = {
  setThing: ($thing: string) => void;
  getEverybody: () => string;
};
export const MuBar: AimsSafeMutatorFn<IBar, MBar> = (_state, patch) => ({
  setThing: ($thing) => {
    patch({ $thing });
  },
  getEverybody: () => "Everybody",
});

export const Bar: IBar = { $thing: "Jack" };
