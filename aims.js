export const aims = ({
	a = Object.assign,
	i = {},
	m = [_state => {}],
	accumulator = a,
	initial_state = i,
	mutators = m
 } = {}) => {
	let value = accumulator({}, initial_state)

	const state = {
		patch: object => {
			value = accumulator({ ...value }, object)
		},
		get: () => value,
	}

	const all_mutators = [mutators]
		.flat()
		.map(mutator_fn => mutator_fn(state))

	return Object.freeze(Object.assign(state, ...all_mutators))
}