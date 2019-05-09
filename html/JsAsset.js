"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var JsAsset = /** @class */ (function () {
    function JsAsset(src, version, defer, crossOrigin) {
        var _this = this;
        this.render = function (key) {
            return react_1.default.createElement("script", { key: key, src: _this.src + "?" + _this.version, crossOrigin: _this.crossOrigin ? "anonymous" : undefined, defer: _this.defer });
        };
        this.src = src;
        this.version = version || '1';
        this.defer = defer;
        this.crossOrigin = crossOrigin;
    }
    return JsAsset;
}());
exports.JsAsset = JsAsset;
