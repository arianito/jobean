import { BeanConfig } from "./Bean";
export declare function clientSideInit(store: BeanConfig, route: string, search: string, cookies: {
    [key: string]: any;
}): import("redux-saga").Task;
