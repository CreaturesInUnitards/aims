import aims from "../lib/aims";
import { AimsPatch, AimsState } from "../index";

type STATE = AimsState<IFoo, MFoo>;

type IFoo = { $name: string };
type MFoo = {
  setName: ($name: string) => void;
};

const i = { $name: "Scotty" };
const m = (_state: STATE, patch: AimsPatch<MFoo>) => ({
  setName: ($name: string) => patch({ $name }),
});

export const createState = () => {
  let button: HTMLElement | null;

  const state: STATE = aims({ i, m, s: true }, (state: STATE) => {
    if (!button) {
      button = document.getElementById("counter");
      button!.onclick = (_e) => {
        state.setName(state.get().$name + ".");
      };
    }
    button!.textContent = state.get().$name;
  });

  state.setName("Freddy");
};
