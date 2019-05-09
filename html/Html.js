"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
function isProduction() {
    return process.env.NODE_ENV === 'production';
}
function Html(props) {
    var title = props.title, head = props.head, body = props.body, direction = props.direction, children = props.children, html = props.html, baseHref = props.baseHref, productionAssets = props.productionAssets, developmentAssets = props.developmentAssets, initialState = props.initialState, _a = props.id, id = _a === void 0 ? 'app' : _a;
    return react_1.default.createElement("html", { dir: direction },
        react_1.default.createElement("head", null,
            react_1.default.createElement("meta", { charSet: "utf-8" }),
            react_1.default.createElement("meta", { name: "baseHref", content: baseHref }),
            react_1.default.createElement("title", null, title),
            (isProduction() ? productionAssets : developmentAssets).map(function (a, i) { return a.render(i); }),
            initialState && react_1.default.createElement("script", { id: "global-state", dangerouslySetInnerHTML: {
                    __html: "window['BEAN'] = \"" + helpers_1.Base64.encode(JSON.stringify(initialState)) + "\"",
                } }),
            head),
        react_1.default.createElement("body", null,
            react_1.default.createElement("main", { id: id, dangerouslySetInnerHTML: html && { __html: html } }, children),
            body));
}
exports.Html = Html;
