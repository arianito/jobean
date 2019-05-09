"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// filterObject object using
function filterObject(obj, predicate) {
    return Object.keys(obj)
        .filter(function (key) { return predicate(obj[key], key); })
        .reduce(function (res, key) {
        res[key] = obj[key];
        return res;
    }, {});
}
exports.filterObject = filterObject;
function filterObjectByKeys(obj, keys) {
    return filterObject(obj, function (v, k) { return keys.includes(k); });
}
exports.filterObjectByKeys = filterObjectByKeys;
