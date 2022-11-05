import "./style.css";
import { createState, STATE } from "./model/state";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">button</button>
    </div>
  </div>
`;

const state: STATE = createState();
state.setName();
