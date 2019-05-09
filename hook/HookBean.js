"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var BeanFactory_1 = require("../bean/BeanFactory");
var effects_1 = require("redux-saga/effects");
exports.HOOK_CHANGE_CONTEXT = 'HOOK_CHANGE_CONTEXT';
var changeContext = function (id, offline, context) { return ({
    type: exports.HOOK_CHANGE_CONTEXT,
    id: id,
    offline: offline,
    context: context
}); };
exports.HookAct = BeanFactory_1.BeanFactory.act({
    id: 'Action',
    body: function (payload) {
        var newContext;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(payload.procedure(payload.context))];
                case 1:
                    newContext = _a.sent();
                    return [4 /*yield*/, effects_1.put(changeContext(payload.id, payload.offline, newContext))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, newContext];
            }
        });
    }
});
exports.HookBean = BeanFactory_1.BeanFactory.bean({
    id: 'Hook',
    saved: true,
    state: {},
    acts: [
        exports.HookAct
    ],
    dispose: function (state) {
        return helpers_1.filterObject(state, function (value) { return value.saved || (value.expiresAt >= Date.now()); });
    },
    reducer: function (state, action) {
        var _a;
        switch (action.type) {
            case exports.HOOK_CHANGE_CONTEXT:
                var payload = action;
                return __assign({}, state, (_a = {}, _a[payload.id] = {
                    context: payload.context,
                    id: payload.id,
                    offline: payload.offline,
                    expiresAt: Date.now() + 60000 // 1 min
                }, _a));
        }
    }
}, {});
