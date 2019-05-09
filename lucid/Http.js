"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["post"] = "POST";
    HttpMethod["get"] = "GET";
    HttpMethod["put"] = "PUT";
    HttpMethod["delete"] = "DELETE";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["arrayBuffer"] = "arraybuffer";
    ResponseType["blob"] = "blob";
    ResponseType["document"] = "document";
    ResponseType["json"] = "json";
    ResponseType["text"] = "text";
    ResponseType["stream"] = "stream";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
