export type AimsPatch<StateObject> = Partial<StateObject>;

export type AimsState<StateObject, MutatorObject> = MutatorObject & {
  get: () => StateObject;
  patch: (update: AimsPatch<StateObject>) => void;
};

export type AimsMutatorFn<StateObject, MutatorObject> =
  | ((state: AimsState<StateObject, MutatorObject>) => MutatorObject)
  | ((
      state: AimsState<StateObject, MutatorObject>,
      patch: (update: AimsPatch<StateObject>) => void
    ) => MutatorObject);

export type AimsScaffold<StateObject, MutatorObject> = {
  a?: (x: StateObject, y: AimsPatch<StateObject>) => StateObject;
  i?: StateObject;
  m?:
    | AimsMutatorFn<StateObject, MutatorObject>
    | AimsMutatorFn<StateObject, MutatorObject>[];
  s?: boolean;
};
