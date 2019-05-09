import { AnyAction } from "redux";
import { ActAction } from "./Act";
export declare const wrapSagas: (payload: ActAction<any> & AnyAction, procedure: any, server?: boolean) => IterableIterator<any>;
