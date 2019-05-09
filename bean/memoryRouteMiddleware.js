"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connected_react_router_1 = require("connected-react-router");
var js_cookie_1 = __importDefault(require("js-cookie"));
exports.memoryRouteMiddleware = function () { return function (store) { return function (next) { return function (action) {
    if (action.type === connected_react_router_1.LOCATION_CHANGE) {
        js_cookie_1.default.set('route', action.payload.location.pathname + '?' + action.payload.location.search);
    }
    return next(action);
}; }; }; };
