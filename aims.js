export const createState = ({
	a = Object.assign,	// accumulator
	i = {}, 			// initial_state
	m = () => ({}), 	// mutators
} = {}) => {
	let value = a({}, i)
	const fn = Object.assign(() => {}, {
		patch: x => {
			value = a({ ...value }, x)
		},
		get: () => value,
	})
	return Object.freeze(Object.assign(fn, m(fn)))
}
