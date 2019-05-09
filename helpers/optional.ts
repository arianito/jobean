
export function optional(method, def?) {
	try {
		return method() || def
	} catch (e) {
		return def
	}
}
