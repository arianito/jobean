"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var CssAsset = /** @class */ (function () {
    function CssAsset(src, version) {
        var _this = this;
        this.render = function (key) {
            return react_1.default.createElement("link", { key: key, href: _this.src + "?" + _this.version, rel: "stylesheet" });
        };
        this.src = src;
        this.version = version || '1';
    }
    return CssAsset;
}());
exports.CssAsset = CssAsset;
