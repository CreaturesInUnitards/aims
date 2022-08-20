/**
 * AIMS Is Managing State
 *
 * mergerino by @fuzetsu
 * Copyright (c) 2019 Daniel Loomer
 * Forked and codemodded, waiting on pull
 * https://github.com/fuzetsu/mergerino/pull/14
 * */
export const merge = (() => {
	const run = (isArr, copy, patch) => {
		const type = typeof patch
		if (patch && type === 'object') {
			if (Array.isArray(patch)) for (const p of patch) copy = run(isArr, copy, p)
			else {
				for (const k of Object.keys(patch)) {
					const val = patch[k]
					if (typeof val === 'function') copy[k] = val(copy[k], merge)
					else if (val === undefined) isArr && !isNaN(k) ? copy.splice(k, 1) : delete copy[k]
					else if (val === null || typeof val !== 'object' || val.constructor !== Object || Array.isArray(val)) copy[k] = val
					else if (typeof copy[k] === 'object') copy[k] = val === copy[k] ? val : merge(copy[k], val)
					else copy[k] = run(false, {}, val)
				}
			}
		} else if (type === 'function') copy = patch(copy, merge)
		return copy
	}

	const merge = (source, ...patches) => {
		const isArr = Array.isArray(source)
		return run(isArr, isArr ? source.slice() : Object.assign({}, source), patches)
	}

	return merge
})()

export default ({
	a = merge, 									// accumulator
	i = {},                    	// initial_state
	m = [_state => {}],         // mutators
	s = false                   // safemode
} = {}) => {

	let redraw = false
	let value = a({}, i)
	const patch = object => {
		value = a(value, object)
	}

	const state = Object.assign({ get: () => value }, !s && { patch })
	state.redraw = fn => {
		if (!redraw) {
			redraw = true
			const old_a = a
			a = (x, y) => {
				requestAnimationFrame(() => { fn(state) })
				return old_a(x, y)
			}
			fn(state)
		}
	}

	const all_mutators = [m]
	.flat()
	.map(mutator_fn => mutator_fn(state, s && patch))

	return Object.freeze(Object.assign(state, ...all_mutators))
}