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
Object.defineProperty(exports, "__esModule", { value: true });
var BeanFactory_1 = require("./BeanFactory");
var Act_1 = require("./Act");
exports.reducerForSagas = function (beanName, state, payload) {
    var _a, _b, _c, _d, _e, _f, _g;
    var action = BeanFactory_1.BeanFactory.decompose(payload.type);
    if (action.status && action.bean == beanName) {
        switch (action.status) {
            case Act_1.ActStatus.async:
                return __assign({}, state, (_a = {}, _a[action.act] = __assign({}, (state[action.act] || {}), { pending: true, succeed: null }), _a));
            case Act_1.ActStatus.canceled:
                return __assign({}, state, (_b = {}, _b[action.act] = __assign({}, (state[action.act] || {}), { status: action.status, succeed: null, serverSideFetched: payload.server, isDirty: true }), _b));
            case Act_1.ActStatus.failed:
                return __assign({}, state, (_c = {}, _c[action.act] = __assign({}, (state[action.act] || {}), { pending: false, succeed: false, result: payload.result, status: action.status, updatedAt: Date.now(), serverSideFetched: payload.server, isDirty: true }), _c));
            case Act_1.ActStatus.succeed:
                if (!state[action.act].isDirty && (!payload.result || typeof payload.result === 'undefined'))
                    return __assign({}, state, (_d = {}, _d[action.act] = __assign({}, (state[action.act] || {}), { pending: false, succeed: true, status: action.status, updatedAt: Date.now(), serverSideFetched: payload.server, payload: payload.payload, isDirty: false }), _d));
                return __assign({}, state, (_e = {}, _e[action.act] = __assign({}, (state[action.act] || {}), { pending: false, succeed: true, result: payload.result, status: action.status, updatedAt: Date.now(), serverSideFetched: payload.server, payload: payload.payload, isDirty: false }), _e));
            case Act_1.ActStatus.clear:
                return __assign({}, state, (_f = {}, _f[action.act] = __assign({}, (state[action.act] || {}), { pending: false, result: null, succeed: false, isDirty: true, payload: {}, serverSideFetched: false, status: action.status }), _f));
            case Act_1.ActStatus.reset:
                return __assign({}, state, (_g = {}, _g[action.act] = __assign({}, (state[action.act] || {}), { serverSideFetched: false }), _g));
        }
    }
};
