import { AnyAction } from "redux";
import { Bean } from "../bean/Bean";
export declare const HOOK_CHANGE_CONTEXT = "HOOK_CHANGE_CONTEXT";
export declare type ChangeContextAction = AnyAction & HookPayload;
export declare type HookContext<T = any> = {
    act: Actor<T>;
} & HookPayload<T>;
export declare type HookModelState = {
    [key: string]: HookPayload;
};
export declare type ActFn<T = any> = (context: T) => IterableIterator<any>;
export declare type Actor<T = any> = (procedure: ActFn<T>) => Promise<T>;
export declare type HookPayload<T = any> = {
    id: any;
    offline?: boolean;
    context?: T;
    expiresAt?: number;
};
export declare const HookAct: import("..").Act<HookPayload<any> & {
    procedure: ActFn<any>;
}, any>;
export declare const HookBean: Bean<HookModelState>;
