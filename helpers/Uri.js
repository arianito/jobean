"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PATH_REGEXP = new RegExp(['(\\\\.)', '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'), 'g');
var DEFAULT_DELIMITER = '/';
var DEFAULT_DELIMITERS = './';
var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;
function parse(str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER;
    var delimiters = (options && options.delimiters) || DEFAULT_DELIMITERS;
    var pathEscaped = false;
    var res;
    while ((res = PATH_REGEXP.exec(str)) !== null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;
        if (escaped) {
            path += escaped[1];
            pathEscaped = true;
            continue;
        }
        var prev = '';
        var next = str[index];
        var name_1 = res[2];
        var capture = res[3];
        var group = res[4];
        var modifier = res[5];
        if (!pathEscaped && path.length) {
            var k = path.length - 1;
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
        var partial = prev !== '' && next !== undefined && next !== prev;
        var repeat = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var delimiter = prev || defaultDelimiter;
        var pattern = capture || group;
        tokens.push({
            name: name_1 || key++,
            prefix: prev,
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            partial: partial,
            pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
        });
    }
    if (path || index < str.length) {
        tokens.push(path + str.substr(index));
    }
    return tokens;
}
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
}
function escapeGroup(group) {
    return group.replace(/([=!:$/()])/g, '\\$1');
}
function flags(options) {
    return options && options.sensitive ? '' : 'i';
}
function regexpToRegexp(path, keys) {
    if (!keys)
        return path;
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                partial: false,
                pattern: null
            });
        }
    }
    return path;
}
function arrayToRegexp(path, keys, options) {
    var parts = [];
    for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
    }
    return new RegExp('(?:' + parts.join('|') + ')', flags(options));
}
function stringToRegexp(path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options);
}
function tokensToRegExp(tokens, keys, options) {
    options = options || {};
    var strict = options.strict;
    var start = options.start !== false;
    var end = options.end !== false;
    var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER);
    var delimiters = options.delimiters || DEFAULT_DELIMITERS;
    var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
    var route = start ? '^' : '';
    var isEndDelimited = tokens.length === 0;
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (typeof token === 'string') {
            route += escapeString(token);
            isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1;
        }
        else {
            var capture = token.repeat
                ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*'
                : token.pattern;
            if (keys)
                keys.push(token);
            if (token.optional) {
                if (token.partial) {
                    route += escapeString(token.prefix) + '(' + capture + ')?';
                }
                else {
                    route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
                }
            }
            else {
                route += escapeString(token.prefix) + '(' + capture + ')';
            }
        }
    }
    if (end) {
        if (!strict)
            route += '(?:' + delimiter + ')?';
        route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
    }
    else {
        if (!strict)
            route += '(?:' + delimiter + '(?=' + endsWith + '))?';
        if (!isEndDelimited)
            route += '(?=' + delimiter + '|' + endsWith + ')';
    }
    return new RegExp(route, flags(options));
}
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp) {
        return regexpToRegexp(path, keys);
    }
    if (Array.isArray(path)) {
        return arrayToRegexp(path, keys, options);
    }
    return stringToRegexp(path, keys, options);
}
function compilePath(path, options) {
    var cacheKey = "" + options.end + options.strict + options.sensitive;
    var pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path])
        return pathCache[path];
    var keys = [];
    var regexp = pathToRegexp(path, keys, options);
    var result = { regexp: regexp, keys: keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
var Uri = /** @class */ (function () {
    function Uri() {
    }
    Uri.searchParams = function (search) {
        if (search) {
            if (search.charAt(0) === '?')
                search = search.substr(1);
            return search.split('&').reduce(function (result, current) {
                var spl = current.split('=');
                if (spl.length === 2)
                    result[spl[0]] = spl[1];
                return result;
            }, {});
        }
        return {};
    };
    Uri.match = function (uri, pattern) {
        var path = pattern.path, _a = pattern.exact, exact = _a === void 0 ? false : _a, _b = pattern.strict, strict = _b === void 0 ? false : _b, _c = pattern.sensitive, sensitive = _c === void 0 ? false : _c;
        var paths = [].concat(path);
        return paths.reduce(function (matched, path) {
            if (matched)
                return matched;
            var _a = compilePath(path, {
                end: exact,
                strict: strict,
                sensitive: sensitive
            }), regexp = _a.regexp, keys = _a.keys;
            var match = regexp.exec(uri);
            if (!match)
                return null;
            var _b = __read(match), url = _b[0], values = _b.slice(1);
            var isExact = uri === url;
            if (exact && !isExact)
                return null;
            return {
                path: path,
                url: path === "/" && url === "" ? "/" : url,
                isExact: isExact,
                params: keys.reduce(function (memo, key, index) {
                    memo[key.name] = values[index];
                    return memo;
                }, {})
            };
        }, null);
    };
    return Uri;
}());
exports.Uri = Uri;
