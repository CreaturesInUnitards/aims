/**
 * I: I, essentially { [prop: string]: any }
 * M: M, essentially (...args?) => any
 * */

export type AimsPatch<I> = Partial<I>;

export type AimsSafeState<I, M> = M & { get: () => I };

export type AimsState<I, M> = AimsSafeState<I, M> & {
  patch: (update: AimsPatch<I>) => void;
};

export type AimsMutatorFn<I, M> = (state: AimsState<I, M>) => M;

export type AimsSafeMutatorFn<I, M> = (
  state: AimsSafeState<I, M>,
  patch: (update: AimsPatch<I>) => void
) => M;

export type AimsScaffold<I, M> = {
  a?: (x: I, y: AimsPatch<I>) => I;
  i?: I;
  m?: (AimsMutatorFn<I, typeof M> | AimsSafeMutatorFn<I, typeof M>)[];
  s?: boolean;
};

export type AIMS<I, M> = (
  options: AimsScaffold<I, M>,
  render: (state: AimsState<I, M>) => void
) => AimsState<I, M>;
