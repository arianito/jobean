import { AnyAction } from "redux";
import { Bean } from "./Bean";
import { ForkEffect } from './effects';
import { RoutePattern } from "../helpers";
export declare type ActPayload<P, R> = {
    cookies: {
        [key: string]: string | string[];
    };
    operation: ActBody<P, R>;
} & P;
export declare type ActAction<R> = {
    done?: (err: true | false | null, result: R) => any;
};
export declare type ActBody<P = any, R = any> = {
    pending: false | true;
    result: R;
    succeed: null | true | false;
    status: ActStatus;
    updatedAt: number;
    serverSideFetched?: boolean;
    isDirty?: boolean;
    payload?: P & AnyAction;
};
export declare enum ActStatus {
    created = "CREATED",
    canceled = "CANCELLED",
    failed = "FAILED",
    succeed = "SUCCEED",
    async = "ASYNC",
    clear = "CLEAR",
    reset = "RESET"
}
export declare type Act<P = {}, R = any> = {
    id: string;
    owner?: Bean;
    effect?: ForkEffect;
    automatic?: {
        toRunOn?: 'client' | 'server';
        path?: RoutePattern;
    };
    body: (payload?: ActPayload<P, R>) => IterableIterator<any>;
    typeOf?(payload: P & ActAction<R>): AnyAction;
    execute?(payload: P & ActAction<R>): any;
    asPromise?(payload: P): Promise<R>;
    clean?(): any;
    read?(state: any): ActBody<P, R>;
};
