"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var HookBean_1 = require("./HookBean");
var Connected_1 = require("./Connected");
function Hook(props) {
    var children = props.children, id = props.id, offline = props.offline;
    return react_1.default.createElement(Connected_1.Connected, { project: function (state, props) { return HookBean_1.HookBean.read(state)[props.id].context; } }, function (state) {
        return react_1.default.createElement(react_1.Fragment, null, children({
            id: id,
            offline: offline,
            context: state.context,
            act: function (procedure) {
                return HookBean_1.HookAct.asPromise({
                    id: id,
                    offline: offline,
                    context: state.context,
                    procedure: procedure,
                });
            }
        }));
    });
}
exports.Hook = Hook;
