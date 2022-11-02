/**
 * AIMS Is Managing State
 * (Accumulator, Initial_state, Mutators, Safemode)
 *
 * The default AIMS accumulator is mergerino by @fuzetsu
 * Copyright (c) 2019 Daniel Loomer
 * Forked and codemodded, waiting on pull
 * https://github.com/fuzetsu/mergerino/pull/14
 * */
import merge from "./merge";
import { AimsMutatorFn, AimsPatch, AimsScaffold, AimsState } from "../index";

const aims = <T, M>(
  {
    a = merge, // accumulator
    i, // initial_state
    m, // mutators
    s = false, // safemode
  }: AimsScaffold<T, M> = {},
  render?: (state: AimsState<T, M>) => void
) => {
  type STATE = AimsState<T, M>;

  let value = a({} as T, i || {}),
    state: STATE;

  const patch = (update: AimsPatch<T>) => {
    value = a(value, update);
    render && render(state);
  };

  state = Object.assign({ get: () => value }, !s && { patch }) as STATE;

  const all_mutators = [m || []]
    .flat()
    .map((mutator_fn: AimsMutatorFn<T, M>) =>
      s ? mutator_fn(state, patch) : mutator_fn(state)
    );

  Object.assign(state, ...all_mutators);
  render && render(state);
  return Object.freeze(state) as STATE;
};

export default aims;
