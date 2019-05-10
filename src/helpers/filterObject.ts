
// filterObject object using
export function filterObject(obj: any, predicate: (value: any, key: string) => any) {
	return Object.keys(obj)
		.filter(key => predicate(obj[key], key))
		.reduce((res, key) => {
			res[key] = obj[key];
			return res
		}, {})
}


export function filterObjectByKeys(obj: any, keys: string[]) {
	return filterObject(obj, (v, k) => keys.includes(k))
}
