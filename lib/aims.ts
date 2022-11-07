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
import * as aims from "../aims"

export const create = <I, M>(
  {
    a = merge, // accumulator
    i, // initial_state
    m = [], // mutators
    s = false, // safemode
  }: aims.Scaffold<I, M> = {},
  render?: (state: aims.State<I, M> | aims.SafeState<I, M>) => void
): aims.State<I, M> | aims.SafeState<I, M> => {
  let value = a({} as I, i || {}),
    state: any

  const patch = (update: aims.Patch<I>) => {
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
