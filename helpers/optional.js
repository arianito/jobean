"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function optional(method, def) {
    try {
        return method() || def;
    }
    catch (e) {
        return def;
    }
}
exports.optional = optional;
