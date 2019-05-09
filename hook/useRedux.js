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
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var helpers_1 = require("../helpers");
function useRedux(selector, initialState) {
    var redux = react_1.useContext(react_redux_1.ReactReduxContext);
    var state = redux.store.getState();
    var _a = __read(react_1.useState(helpers_1.optional(function () { return selector(state); }, initialState)), 2), context = _a[0], setContext = _a[1];
    function changes() {
        var state = redux.store.getState();
        setContext(helpers_1.optional(function () { return selector(state); }, initialState));
    }
    react_1.useEffect(function () {
        var un = redux.store.subscribe(changes);
        return function () {
            un();
        };
    }, []);
    return [context];
}
exports.useRedux = useRedux;
