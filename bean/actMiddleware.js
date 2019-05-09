"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connected_react_router_1 = require("connected-react-router");
var clientSideInit_1 = require("./clientSideInit");
var helpers_1 = require("../helpers");
exports.actMiddleware = function (basename, saga, models) { return function (store) { return function (next) { return function (action) {
    if (action.type === connected_react_router_1.LOCATION_CHANGE) {
        clientSideInit_1.clientSideInit({
            baseHref: basename,
            saga: saga,
            store: store,
            beans: models,
            serverSide: typeof window === 'undefined',
            initialState: {},
        }, action.payload.location.pathname, action.payload.location.search, helpers_1.parseCookies(window.document.cookie || ''));
    }
    return next(action);
}; }; }; };
