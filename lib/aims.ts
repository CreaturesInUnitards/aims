/**
 * AIMS Is Managing State
 * (Accumulator, Initial_state, Mutators, Safemode)
 *
 * The default AIMS accumulator is mergerino by @fuzetsu
 * Copyright (c) 2019 Daniel Loomer
 * Forked and codemodded, waiting on pull
 * https://github.com/fuzetsu/mergerino/pull/14
 * */
import merge from "./merge"
import { Patch, SafeState, Scaffold, State } from "../aims"

const aims = <I, M>(
  {
    a = merge, // accumulator
    i, // initial_state
    m = [], // mutators
    s = false, // safemode
  }: Scaffold<I, M> = {},
  render?: (state: State<I, M> | SafeState<I, M>) => void
): State<I, M> | SafeState<I, M> => {
  let value = a({} as I, i || {}),
    state: any

  const patch = (update: Patch<I>) => {
    value = a(value, update)
    render && render(state)
  }

  state = Object.assign({ get: () => value }, !s && { patch })

  const all_mutators = [m]
    .flat()
    // @ts-ignore
    .map((mutatorFn) => mutatorFn(state, !!s && patch))

  Object.assign(state, ...all_mutators)
  render && render(state)
  return Object.freeze(state)
}

export default aims
