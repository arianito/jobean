"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64token = "fWd-wJeGa4MuhlS6ytPFL5o1z_rHC3v0nRYmNbB.qI2scE8ATpgjQxVKki7XODUZ9";
var _utf8_encode = function (e) {
    e = e.replace(/rn/g, "n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        if (r < 128) {
            t += String.fromCharCode(r);
        }
        else if (r > 127 && r < 2048) {
            t += String.fromCharCode(r >> 6 | 192);
            t += String.fromCharCode(r & 63 | 128);
        }
        else {
            t += String.fromCharCode(r >> 12 | 224);
            t += String.fromCharCode(r >> 6 & 63 | 128);
            t += String.fromCharCode(r & 63 | 128);
        }
    }
    return t;
};
var _utf8_decode = function (e) {
    var t = "";
    var n = 0;
    var r = 0;
    var c3 = 0;
    var c2 = 0;
    while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
            t += String.fromCharCode(r);
            n++;
        }
        else if (r > 191 && r < 224) {
            c2 = e.charCodeAt(n + 1);
            t += String.fromCharCode((r & 31) << 6 | c2 & 63);
            n += 2;
        }
        else {
            c2 = e.charCodeAt(n + 1);
            c3 = e.charCodeAt(n + 2);
            t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            n += 3;
        }
    }
    return t;
};
var Base64 = /** @class */ (function () {
    function Base64() {
    }
    Base64.decode = function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = exports.base64token.indexOf(e.charAt(f++));
            o = exports.base64token.indexOf(e.charAt(f++));
            u = exports.base64token.indexOf(e.charAt(f++));
            a = exports.base64token.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u !== 64) {
                t = t + String.fromCharCode(r);
            }
            if (a !== 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = _utf8_decode(t);
        return t;
    };
    Base64.encode = function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = _utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            }
            else if (isNaN(i)) {
                a = 64;
            }
            t = t + exports.base64token.charAt(s) + exports.base64token.charAt(o) + exports.base64token.charAt(u) + exports.base64token.charAt(a);
        }
        return t;
    };
    return Base64;
}());
exports.Base64 = Base64;
