"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var NetworkCodes_1 = require("./NetworkCodes");
var helpers_1 = require("../helpers");
var Http_1 = require("./Http");
var Lucid = /** @class */ (function () {
    function Lucid() {
    }
    Lucid.driver = null;
    Lucid.requestMiddlewareChain = [];
    Lucid.responseMiddlewareChain = [];
    Lucid.mockedRoutes = {};
    Lucid.mockedMiddleware = {};
    Lucid.logger = null;
    Lucid.defaultConfiguration = {
        baseURL: '',
        timeout: 1000,
        log: false,
        method: Http_1.HttpMethod.post,
        responseType: Http_1.ResponseType.json,
        withCredentials: false,
    };
    Lucid.config = function (driver, options) {
        Lucid.driver = driver;
        if (options)
            Lucid.defaultConfiguration = __assign({}, Lucid.defaultConfiguration, options);
    };
    Lucid.setLogger = function (logger) {
        Lucid.logger = logger;
    };
    Lucid.addRequestMiddleware = function (middleWare) {
        Lucid.requestMiddlewareChain.push(middleWare);
    };
    Lucid.addResponseMiddleware = function (success, failure) {
        Lucid.responseMiddlewareChain.push({
            success: success,
            failure: failure,
        });
    };
    Lucid.addMock = function (name, routes) {
        Lucid.mockedRoutes[name] = routes;
        return function () {
            delete Lucid.mockedRoutes[name];
        };
    };
    Lucid.removeMock = function (name) {
        delete Lucid.mockedRoutes[name];
    };
    Lucid.addMiddleware = function (name, middleware) {
        Lucid.mockedMiddleware[name] = middleware;
        return function () {
            delete Lucid.mockedMiddleware[name];
        };
    };
    Lucid.removeMiddleware = function (name) {
        delete Lucid.mockedMiddleware[name];
    };
    Lucid.fetch = function (request, driver) {
        if (driver === void 0) { driver = null; }
        return __awaiter(_this, void 0, void 0, function () {
            var e_1, _a, e_2, _b, e_3, _c, requestCache, _d, _e, m, responseCache, e_4, failureCache, _f, _g, m, _h, _j, m;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        requestCache = request;
                        try {
                            for (_d = __values(Lucid.requestMiddlewareChain), _e = _d.next(); !_e.done; _e = _d.next()) {
                                m = _e.value;
                                requestCache = m(requestCache);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        responseCache = null;
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (driver || Lucid.driver)(requestCache)];
                    case 2:
                        responseCache = _k.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _k.sent();
                        failureCache = e_4;
                        try {
                            for (_f = __values(Lucid.responseMiddlewareChain), _g = _f.next(); !_g.done; _g = _f.next()) {
                                m = _g.value;
                                if (m.failure) {
                                    failureCache = m.failure(failureCache);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        throw failureCache;
                    case 4:
                        try {
                            //
                            for (_h = __values(Lucid.responseMiddlewareChain), _j = _h.next(); !_j.done; _j = _h.next()) {
                                m = _j.value;
                                if (m.success) {
                                    responseCache = m.success(responseCache);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        return [2 /*return*/, responseCache];
                }
            });
        });
    };
    Lucid.makeDriver = function (driver) {
        return driver;
    };
    Lucid.mockDriver = function (fallback) {
        return function (request) { return __awaiter(_this, void 0, void 0, function () {
            var e_5, _a, path, method, oldPath, oldMethod, routes, methodNotFound, _loop_1, routes_1, routes_1_1, route, state_1, e_5_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path = (request.baseHref || Lucid.defaultConfiguration.baseURL) + request.url;
                        method = request.method || Lucid.defaultConfiguration.method;
                        oldPath = request.url;
                        oldMethod = request.method;
                        request.url = path;
                        request.method = method;
                        if (Lucid.defaultConfiguration.log && Lucid.logger) {
                            Lucid.logger('request', request);
                        }
                        routes = Object.keys(Lucid.mockedRoutes).reduce(function (acc, value) {
                            return __spread(acc, Lucid.mockedRoutes[value]);
                        }, []);
                        methodNotFound = false;
                        _loop_1 = function (route) {
                            var matchedPath, output_1, setHeader_1, setStatus_1, send_1, responseHelper, cache, isError, i, m, e_6;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        matchedPath = helpers_1.Uri.match(path, __assign({}, route.path, { path: Lucid.defaultConfiguration.baseURL + route.path.path }));
                                        if (!matchedPath) return [3 /*break*/, 6];
                                        if (!(route.method == method)) return [3 /*break*/, 5];
                                        output_1 = {
                                            headers: {},
                                            status: NetworkCodes_1.NetworkCodes.OK,
                                            statusText: NetworkCodes_1.NetworkCodes.getStatus(NetworkCodes_1.NetworkCodes.OK),
                                            payload: '',
                                        };
                                        setHeader_1 = function (key) {
                                            var value = [];
                                            for (var _i = 1; _i < arguments.length; _i++) {
                                                value[_i - 1] = arguments[_i];
                                            }
                                            output_1.headers[key] = value.join('; ');
                                        };
                                        setStatus_1 = function (status) {
                                            output_1.status = status;
                                            output_1.statusText = NetworkCodes_1.NetworkCodes.getStatus(status);
                                        };
                                        send_1 = function (text) {
                                            if (!output_1.payload || typeof output_1.payload != 'string')
                                                output_1.payload = '';
                                            output_1.payload += text;
                                        };
                                        responseHelper = function (obj) {
                                            setHeader_1('content-type', 'application/json');
                                            send_1(obj ? JSON.stringify(obj) : '{}');
                                            return { send: send_1, setStatus: setStatus_1, setHeader: setHeader_1 };
                                        };
                                        responseHelper.send = send_1;
                                        responseHelper.setStatus = setStatus_1;
                                        responseHelper.setHeader = setHeader_1;
                                        cache = route.handler;
                                        isError = false;
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        if (route.middleware) {
                                            for (i = route.middleware.length - 1; i >= 0; i--) {
                                                m = route.middleware[i];
                                                if (Lucid.mockedMiddleware && Lucid.mockedMiddleware[m]) {
                                                    cache = Lucid.mockedMiddleware[m](cache);
                                                }
                                            }
                                        }
                                        request.context = request.context || {};
                                        request.context.match = matchedPath;
                                        return [4 /*yield*/, cache(request, responseHelper)];
                                    case 2:
                                        _a.sent();
                                        if (Lucid.defaultConfiguration.log && Lucid.logger) {
                                            Lucid.logger('response', output_1);
                                        }
                                        if (output_1.headers['content-type'] && output_1.headers['content-type'].includes('application/json')) {
                                            try {
                                                output_1.payload = JSON.parse(output_1.payload);
                                            }
                                            catch (e) {
                                                if (Lucid.defaultConfiguration.log && Lucid.logger) {
                                                    Lucid.logger('error', output_1);
                                                }
                                                delete output_1.payload;
                                            }
                                        }
                                        if (output_1.status >= 400) {
                                            isError = true;
                                        }
                                        else {
                                            return [2 /*return*/, { value: output_1 }];
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_6 = _a.sent();
                                        if (Lucid.defaultConfiguration.log && Lucid.logger) {
                                            Lucid.logger('error', '500 internal server error');
                                        }
                                        throw {
                                            status: NetworkCodes_1.NetworkCodes.INTERNAL_SERVER_ERROR,
                                            statusText: NetworkCodes_1.NetworkCodes.getStatus(NetworkCodes_1.NetworkCodes.INTERNAL_SERVER_ERROR),
                                            payload: e_6,
                                        };
                                    case 4: throw output_1;
                                    case 5:
                                        methodNotFound = true;
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        routes_1 = __values(routes), routes_1_1 = routes_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!routes_1_1.done) return [3 /*break*/, 5];
                        route = routes_1_1.value;
                        return [5 /*yield**/, _loop_1(route)];
                    case 3:
                        state_1 = _b.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _b.label = 4;
                    case 4:
                        routes_1_1 = routes_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_5_1 = _b.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (routes_1_1 && !routes_1_1.done && (_a = routes_1.return)) _a.call(routes_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        if (methodNotFound) {
                            if (Lucid.defaultConfiguration.log && Lucid.logger) {
                                Lucid.logger('error', '405 method not allowed');
                            }
                            throw {
                                status: NetworkCodes_1.NetworkCodes.METHOD_NOT_ALLOWED,
                                statusText: NetworkCodes_1.NetworkCodes.getStatus(NetworkCodes_1.NetworkCodes.METHOD_NOT_ALLOWED),
                            };
                        }
                        if (fallback) {
                            if (Lucid.defaultConfiguration.log && Lucid.logger) {
                                Lucid.logger('fallback', oldPath);
                            }
                            request.url = oldPath;
                            request.method = oldMethod;
                            return [2 /*return*/, fallback(request)];
                        }
                        if (Lucid.defaultConfiguration.log && Lucid.logger) {
                            Lucid.logger('error', '404 not found');
                        }
                        throw {
                            status: NetworkCodes_1.NetworkCodes.NOT_FOUND,
                            statusText: NetworkCodes_1.NetworkCodes.getStatus(NetworkCodes_1.NetworkCodes.NOT_FOUND),
                        };
                }
            });
        }); };
    };
    return Lucid;
}());
exports.Lucid = Lucid;
