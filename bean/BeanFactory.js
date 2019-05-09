"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
var configureStore_1 = require("./configureStore");
var serverSideInit_1 = require("./serverSideInit");
var react_redux_1 = require("react-redux");
var connected_react_router_1 = require("connected-react-router");
var react_router_1 = require("react-router");
var Act_1 = require("./Act");
var html_1 = require("../html");
var BeanFactory = /** @class */ (function () {
    function BeanFactory() {
    }
    BeanFactory.controller = function (controller) {
        return controller;
    };
    BeanFactory.dispatch = null;
    BeanFactory.compose = function (bean, act, status) {
        return [bean, act, status].join('$$');
    };
    BeanFactory.decompose = function (action) {
        var spl = action.split('$$');
        return {
            bean: spl.length > 0 && spl[0],
            act: spl.length > 1 && spl[1],
            status: spl.length > 2 && spl[2],
        };
    };
    BeanFactory.act = function (operation) {
        operation.typeOf = function (payload) {
            return __assign({ type: BeanFactory.compose(operation.owner.id, operation.id, Act_1.ActStatus.async) }, (payload || {}));
        };
        operation.asPromise = function (payload) {
            return new Promise(function (acc, rej) {
                BeanFactory.dispatch(__assign({ type: BeanFactory.compose(operation.owner.id, operation.id, Act_1.ActStatus.async) }, (payload || {}), { done: function (status, result) {
                        (status ? acc : rej)(result);
                    } }));
            });
        };
        operation.execute = function (payload) {
            BeanFactory.dispatch(__assign({ type: BeanFactory.compose(operation.owner.id, operation.id, Act_1.ActStatus.async) }, (payload || {})));
        };
        operation.clean = function () {
            BeanFactory.dispatch({
                type: BeanFactory.compose(operation.owner.id, operation.id, Act_1.ActStatus.clear),
            });
        };
        operation.read = function (state) {
            var def = {
                pending: false,
                result: null,
                succeed: null,
                status: Act_1.ActStatus.created,
                updatedAt: null,
                isDirty: true,
                serverSideFetched: false,
                payload: {},
            };
            try {
                return state[operation.owner.id][operation.id] || def;
            }
            catch (e) {
                return def;
            }
        };
        return operation;
    };
    BeanFactory.bean = function (model, exported) {
        return __assign({}, exported, model, { read: function (state) {
                try {
                    return state[model.id] || {};
                }
                catch (e) {
                    return {};
                }
            } });
    };
    BeanFactory.jar = function (module, exported) {
        return __assign({}, module, exported);
    };
    BeanFactory.provider = function (props) { return ({
        registerClient: function () {
            var app = props.app, id = props.id, splash = props.splash, beans = props.beans, useMemory = props.useMemory, jars = props.jars, _a = props.middleware, middleware = _a === void 0 ? [] : _a;
            var ClientProvider = /** @class */ (function (_super) {
                __extends(ClientProvider, _super);
                function ClientProvider() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.state = {};
                    return _this;
                }
                ClientProvider.prototype.componentDidMount = function () {
                    var _this = this;
                    (function () { return __awaiter(_this, void 0, void 0, function () {
                        var base, cookies, store, app, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    base = document.querySelector('meta[id="baseHref"]').getAttribute('content') || '';
                                    cookies = helpers_1.parseCookies(document.cookie || '');
                                    store = this.props.store || configureStore_1.configureStore({
                                        baseHref: base,
                                        models: this.props.models,
                                        middleware: this.props.middleware,
                                        cookies: cookies,
                                        useMemory: this.props.useMemory,
                                    });
                                    app = ((this.props && this.props.children && this.props.children['type'] && this.props.children['type'].prototype) || {});
                                    data = __assign({}, store, { cookies: cookies });
                                    return [4 /*yield*/, Promise.all(jars.map(function (jar) { return jar.configure && jar.configure(data); }))];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, app.configure];
                                case 2:
                                    (_a.sent()) && app.configure(data);
                                    if (!!configureStore_1.globalStateAvailable) return [3 /*break*/, 4];
                                    return [4 /*yield*/, serverSideInit_1.serverSideInit(store, window.location.pathname, window.location.search, cookies)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [4 /*yield*/, Promise.all(jars.map(function (jar) { return jar.clientStartup && jar.clientStartup(data); }))];
                                case 5:
                                    _a.sent();
                                    return [4 /*yield*/, app.clientStartup];
                                case 6:
                                    (_a.sent()) && app.clientStartup(data);
                                    this.setState({
                                        store: store,
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                };
                ClientProvider.prototype.render = function () {
                    var store = this.state.store;
                    if (store) {
                        return (react_1.default.createElement(react_redux_1.Provider, { store: store.store },
                            react_1.default.createElement(connected_react_router_1.ConnectedRouter, { history: store.history }, this.props.children)));
                    }
                    if (this.props.splash) {
                        return this.props.splash;
                    }
                    return null;
                };
                return ClientProvider;
            }(react_1.default.Component));
            var root = react_1.default.createElement(ClientProvider, { splash: splash, useMemory: useMemory, models: beans, middleware: middleware }, app);
            var dom = require('react-dom');
            var element = document.getElementById(id);
            if (process.env.NODE_ENV === 'production') {
                dom.hydrate(root, element);
            }
            else {
                dom.render(root, element);
                return function () { return dom.hydrate(root, element); };
            }
        },
        renderToString: function (route, cookiesString, options) {
            return __awaiter(this, void 0, void 0, function () {
                var app, id, rtl, beans, body, head, ssr, jars, useMemory, title, baseHref, forceRtl, productionAssets, developmentAssets, cookies, store, dom, initialState, reactApp, data_1, spl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            app = props.app, id = props.id, rtl = props.rtl, beans = props.beans, body = props.body, head = props.head, ssr = props.ssr, jars = props.jars, useMemory = props.useMemory;
                            title = options.title, baseHref = options.baseHref, forceRtl = options.forceRtl, productionAssets = options.productionAssets, developmentAssets = options.developmentAssets;
                            cookies = helpers_1.parseCookies(cookiesString);
                            if (useMemory) {
                                route = cookies['route'] || '/';
                            }
                            store = configureStore_1.configureStore({
                                baseHref: baseHref,
                                models: beans,
                                middleware: [],
                                cookies: cookies,
                                useMemory: useMemory,
                            });
                            dom = require('react-dom/server');
                            initialState = {};
                            if (!(process.env.NODE_ENV === 'production')) return [3 /*break*/, 4];
                            reactApp = ((app['type'] && app['type'].prototype) || {});
                            data_1 = __assign({}, store, { cookies: cookies });
                            return [4 /*yield*/, Promise.all(jars.map(function (jar) { return jar.configure && jar.configure(data_1); }))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, reactApp.configure];
                        case 2:
                            (_a.sent()) && reactApp.configure(data_1);
                            spl = route.split('?');
                            return [4 /*yield*/, serverSideInit_1.serverSideInit(store, spl[0], spl[1], cookies)];
                        case 3:
                            _a.sent();
                            initialState = store.store.getState();
                            _a.label = 4;
                        case 4: return [2 /*return*/, dom.renderToString(react_1.default.createElement(react_redux_1.Provider, { store: store.store },
                                react_1.default.createElement(react_router_1.StaticRouter, { basename: baseHref, context: {}, location: route },
                                    react_1.default.createElement(html_1.Html, { id: id, title: title, direction: (forceRtl !== undefined ? forceRtl : rtl) ? 'rtl' : 'ltr', baseHref: baseHref, initialState: process.env.NODE_ENV === 'production' && initialState, productionAssets: productionAssets, developmentAssets: developmentAssets, head: head && react_1.default.createElement(head, { state: initialState }), body: body && react_1.default.createElement(body, { state: initialState }) }, (process.env.NODE_ENV === 'production' && ssr) && app))))];
                    }
                });
            });
        }
    }); };
    return BeanFactory;
}());
exports.BeanFactory = BeanFactory;
