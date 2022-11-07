/**
 * I: I, essentially { [prop: string]: any }
 * M: M, essentially (...args?) => any
 * */

export type Patch<I> = Partial<I>

export type SafeState<I, M> = M & { get: () => I }

export type State<I, M> = SafeState<I, M> & {
  patch: (update: Patch<I>) => void
}

export type MutatorFn<I, M> = (state: State<I, M>) => M

export type SafeMutatorFn<I, M> = (
  state: SafeState<I, M>,
  patch: (update: Patch<I>) => void
) => M

export type Scaffold<I, M> = {
  a?: (x: I, y: Patch<I>) => I
  i?: I
  m?:
    | MutatorFn<I, typeof M>
    | SafeMutatorFn<I, typeof M>
    | (MutatorFn<I, typeof M> | SafeMutatorFn<I, typeof M>)[]
  s?: boolean
}

declare function create<I, M>(
  options?: Scaffold<I, M>,
  render?: (state: State<I, M> | SafeState<I, M>) => void
): State<I, M> | SafeState<I, M>
