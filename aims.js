export default ({
	a = (x, y) => Object.assign({ ...x }, y), // accumulator
	i = {},                                   // initial_state
	m = [_state => {}],                       // mutators
	s = false                                 // safemode
 } = {}) => {
	let value = a({}, i)
	const patch = object => {
		value = a(value, object)
	}

	const state = Object.assign({ get: () => value }, !s && { patch })

	const all_mutators = [m]
		.flat()
		.map(mutator_fn => mutator_fn(state, s && patch))

	return Object.freeze(Object.assign(state, ...all_mutators))
}
