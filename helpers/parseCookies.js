"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseCookies(jar) {
    if (jar === void 0) { jar = ''; }
    return jar.split(';').map(function (c) {
        return c.trim().split('=').map(decodeURIComponent);
    }).reduce(function (a, b) {
        try {
            a[b[0]] = JSON.parse(b[1]);
        }
        catch (e) {
            a[b[0]] = b[1];
        }
        return a;
    }, {});
}
exports.parseCookies = parseCookies;
