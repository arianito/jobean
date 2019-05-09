import { Middleware } from "redux";
import { Bean, BeanConfig } from "./Bean";
export declare const globalState: () => any;
export declare const globalStateAvailable: any;
export declare type ConfigureStorePayload = {
    baseHref: string;
    models: Array<Bean>;
    middleware?: Array<Middleware>;
    forceClear?: boolean;
    cookies?: {
        [key: string]: any;
    };
    useMemory?: boolean;
};
export declare const configureStore: (props: ConfigureStorePayload) => BeanConfig;
