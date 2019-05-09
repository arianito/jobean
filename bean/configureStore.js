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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var connected_react_router_1 = require("connected-react-router");
var redux_1 = require("redux");
var effects_1 = require("redux-saga/effects");
var redux_saga_1 = __importDefault(require("redux-saga"));
var History = __importStar(require("history"));
var prepareBeans_1 = require("./prepareBeans");
var BeanFactory_1 = require("./BeanFactory");
var memoryRouteMiddleware_1 = require("./memoryRouteMiddleware");
var actMiddleware_1 = require("./actMiddleware");
var helpers_1 = require("../helpers");
exports.globalState = function () { return JSON.parse(helpers_1.Base64.decode(global['BEAN'])); };
exports.globalStateAvailable = typeof global !== 'undefined' && global['BEAN'];
function readState(key) {
    try {
        return JSON.parse(helpers_1.Base64.decode(localStorage.getItem(key))) || {};
    }
    catch (e) {
        return {};
    }
}
function saveState(key, state) {
    localStorage.setItem(key, helpers_1.Base64.encode(JSON.stringify(state)));
}
exports.configureStore = function (props) {
    var key = helpers_1.Base64.encode(props.baseHref);
    var _a = prepareBeans_1.prepareBeans(props.models), initialState = _a.initialState, collectedReducers = _a.collectedReducers, offlineKeys = _a.offlineKeys, collectedSagas = _a.collectedSagas;
    function rootSagas() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.all(collectedSagas)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var ssrState = exports.globalStateAvailable ? __assign({}, exports.globalState(), { router: undefined }) : {};
    var history = null;
    var routeMiddleware = null;
    var collectedMiddleware = props.middleware || [];
    if (typeof window !== 'undefined') {
        if (props.useMemory) {
            history = History.createMemoryHistory({ initialEntries: [props.cookies['route'] || '/'], initialIndex: 0 });
        }
        else {
            history = History.createBrowserHistory({ basename: props.baseHref });
        }
        routeMiddleware = connected_react_router_1.routerMiddleware(history);
        collectedReducers['router'] = connected_react_router_1.connectRouter(history);
        collectedMiddleware.push(routeMiddleware);
    }
    var aux = redux_1.combineReducers(collectedReducers);
    var sagaMiddleware = redux_saga_1.default();
    var savedState = (typeof window !== 'undefined' && !props.forceClear) ?
        helpers_1.filterObjectByKeys(readState(key), offlineKeys) : {};
    var store = null;
    var state = __assign({}, initialState, savedState, ssrState);
    var operationMiddleware = actMiddleware_1.actMiddleware(props.baseHref, sagaMiddleware, props.models.filter(function (a) { return a.acts.some(function (a) { return !!a.automatic; }); }));
    var memoryRouterMiddleware = props.useMemory ? [memoryRouteMiddleware_1.memoryRouteMiddleware()] : [];
    var middleware = redux_1.applyMiddleware.apply(void 0, __spread(collectedMiddleware, [sagaMiddleware, operationMiddleware], memoryRouterMiddleware));
    if (process.env.NODE_ENV == 'development' && typeof window !== 'undefined') {
        store = redux_1.createStore(aux, state, (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || redux_1.compose)(middleware));
    }
    else {
        store = redux_1.createStore(aux, state, middleware);
    }
    BeanFactory_1.BeanFactory.dispatch = store.dispatch;
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', function () {
            var currentState = store.getState();
            saveState(key, Object.keys(currentState).reduce(function (output, key) {
                var _a;
                var model = currentState[key];
                var found = props.models && props.models.find(function (a) { return a.id == key; });
                if (found && found.saved) {
                    return __assign({}, output, (_a = {}, _a[key] = (found.dispose && found.dispose(model)) || model, _a));
                }
                return output;
            }, {}));
        });
    }
    sagaMiddleware.run(rootSagas);
    return {
        store: store,
        initialState: state,
        serverSide: typeof window === 'undefined',
        history: history,
        saga: sagaMiddleware,
        beans: props.models,
        baseHref: props.baseHref
    };
};
