const PATH_REGEXP = new RegExp(['(\\\\.)', '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'), 'g');

const DEFAULT_DELIMITER = '/';
const DEFAULT_DELIMITERS = './';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function parse(str, options) {
	let tokens = [];
	let key = 0;
	let index = 0;
	let path = '';
	let defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER;
	let delimiters = (options && options.delimiters) || DEFAULT_DELIMITERS;
	let pathEscaped = false;
	let res;

	while ((res = PATH_REGEXP.exec(str)) !== null) {
		let m = res[0];
		let escaped = res[1];
		let offset = res.index;
		path += str.slice(index, offset);
		index = offset + m.length;
		if (escaped) {
			path += escaped[1];
			pathEscaped = true;
			continue;
		}
		let prev = '';
		let next = str[index];
		let name = res[2];
		let capture = res[3];
		let group = res[4];
		let modifier = res[5];

		if (!pathEscaped && path.length) {
			let k = path.length - 1;

			if (delimiters.indexOf(path[k]) > -1) {
				prev = path[k];
				path = path.slice(0, k);
			}
		}
		if (path) {
			tokens.push(path);
			path = '';
			pathEscaped = false;
		}
		let partial = prev !== '' && next !== undefined && next !== prev;
		let repeat = modifier === '+' || modifier === '*';
		let optional = modifier === '?' || modifier === '*';
		let delimiter = prev || defaultDelimiter;
		let pattern = capture || group;

		tokens.push({
			name: name || key++,
			prefix: prev,
			delimiter: delimiter,
			optional: optional,
			repeat: repeat,
			partial: partial,
			pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
		})
	}
	if (path || index < str.length) {
		tokens.push(path + str.substr(index))
	}

	return tokens;
}

function escapeString(str) {
	return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

function escapeGroup(group) {
	return group.replace(/([=!:$/()])/g, '\\$1')
}

function flags(options) {
	return options && options.sensitive ? '' : 'i'
}

function regexpToRegexp(path, keys) {
	if (!keys) return path;

	// Use a negative lookahead to match only capturing groups.
	let groups = path.source.match(/\((?!\?)/g);

	if (groups) {
		for (let i = 0; i < groups.length; i++) {
			keys.push({
				name: i,
				prefix: null,
				delimiter: null,
				optional: false,
				repeat: false,
				partial: false,
				pattern: null
			})
		}
	}

	return path
}

function arrayToRegexp(path, keys, options) {
	let parts = [];

	for (let i = 0; i < path.length; i++) {
		parts.push(pathToRegexp(path[i], keys, options).source)
	}

	return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

function stringToRegexp(path, keys, options) {
	return tokensToRegExp(parse(path, options), keys, options)
}

function tokensToRegExp(tokens, keys, options) {
	options = options || {};

	let strict = options.strict;
	let start = options.start !== false;
	let end = options.end !== false;
	let delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER);
	let delimiters = options.delimiters || DEFAULT_DELIMITERS;
	let endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
	let route = start ? '^' : '';
	let isEndDelimited = tokens.length === 0;

	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i];

		if (typeof token === 'string') {
			route += escapeString(token);
			isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1;
		} else {
			let capture = token.repeat
				? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*'
				: token.pattern;

			if (keys) keys.push(token);

			if (token.optional) {
				if (token.partial) {
					route += escapeString(token.prefix) + '(' + capture + ')?';
				} else {
					route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
				}
			} else {
				route += escapeString(token.prefix) + '(' + capture + ')';
			}
		}
	}

	if (end) {
		if (!strict) route += '(?:' + delimiter + ')?';
		route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
	} else {
		if (!strict) route += '(?:' + delimiter + '(?=' + endsWith + '))?';
		if (!isEndDelimited) route += '(?=' + delimiter + '|' + endsWith + ')';
	}

	return new RegExp(route, flags(options))
}

function pathToRegexp(path, keys, options) {
	if (path instanceof RegExp) {
		return regexpToRegexp(path, keys)
	}

	if (Array.isArray(path)) {
		return arrayToRegexp(path, keys, options)
	}

	return stringToRegexp(path, keys, options)
}

function compilePath(path, options) {
	const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
	const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

	if (pathCache[path]) return pathCache[path];

	const keys = [];
	const regexp = pathToRegexp(path, keys, options);
	const result = {regexp, keys};

	if (cacheCount < cacheLimit) {
		pathCache[path] = result;
		cacheCount++;
	}

	return result;
}

export interface RoutePattern {
	path: string,
	exact?: boolean,
	strict?: boolean,
	sensitive?: boolean
}


export interface MatchResult {
	path: string,
	url: string,
	isExact: boolean,
	params: { [key: string]: string },
}


export class Uri {
	static searchParams(search: string) {
		if (search) {
			if (search.charAt(0) === '?')
				search = search.substr(1);
			return search.split('&').reduce((result, current) => {
				const spl = current.split('=');
				if (spl.length === 2)
					result[spl[0]] = spl[1];
				return result;
			}, {});
		}
		return {};
	}


	static match(uri, pattern: RoutePattern): MatchResult {
		const {path, exact = false, strict = false, sensitive = false} = pattern;

		const paths = [].concat(path);

		return paths.reduce((matched, path) => {
			if (matched) return matched;
			const {regexp, keys} = compilePath(path, {
				end: exact,
				strict,
				sensitive
			});
			const match = regexp.exec(uri);

			if (!match) return null;

			const [url, ...values] = match;
			const isExact = uri === url;

			if (exact && !isExact) return null;

			return {
				path,
				url: path === "/" && url === "" ? "/" : url,
				isExact,
				params: keys.reduce((memo, key, index) => {
					memo[key.name] = values[index];
					return memo;
				}, {})
			};
		}, null);
	}

}
