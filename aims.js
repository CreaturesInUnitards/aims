export default ({
	a = (x, y) => Object.assign({ ...x }, y),	// accumulator
	i = {},				// initial_state
	m = [_state => {}]	// mutators
 } = {}) => {
	let value = a({}, i)

	const state = {
		patch: object => {
			value = a(value, object)
		},
		get: () => value,
	}

	const all_mutators = [m]
		.flat()
		.map(mutator_fn => mutator_fn(state))

	return Object.freeze(Object.assign(state, ...all_mutators))
}
