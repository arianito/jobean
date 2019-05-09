"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var helpers_1 = require("../helpers");
function Connected(props) {
    return react_1.default.createElement(react_redux_1.connect(function (s, p) { return ({ value: helpers_1.optional(function () { return props.project(s, p); }, props.default) }); })(function (state) {
        return props.children(state.value);
    }));
}
exports.Connected = Connected;
