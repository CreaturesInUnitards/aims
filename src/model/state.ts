import aims from "../../lib/aims";
import { AimsState } from "../../index";
import { Foo, IFoo, MFoo, MuFoo } from "./Foo.model";
import { Bar, IBar, MBar, MuBar } from "./Bar.model";

type STATE = AimsState<IFoo & IBar, MFoo & MBar>;

export const createState = () => {
  let button: HTMLElement | null;

  const state: STATE = aims(
    {
      i: { ...Foo, ...Bar },
      m: [MuFoo, MuBar],
      s: true,
    },
    (state: STATE) => {
      if (!button) {
        button = document.getElementById("counter");
        button!.onclick = (_e) => {
          state.setName();
        };
      }
      button!.textContent = state.get().$name;
    }
  );

  state.setName();
};
