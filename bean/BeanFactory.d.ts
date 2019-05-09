import { Dispatch, Middleware } from "redux";
import React from "react";
import { Bean, BeanLifecycle, Jar } from "./Bean";
import { Act, ActStatus } from "./Act";
import { ProcedureController } from "./Procedure";
import { HtmlAsset } from "../html";
export declare type ProviderProps = {
    id: string;
    rtl?: boolean;
    ssr?: boolean;
    useMemory?: boolean;
    app: React.ReactNode;
    head?: React.ComponentType<{
        state: any;
    }>;
    body?: React.ComponentType<{
        state: any;
    }>;
    splash?: React.ReactNode;
    jars?: Array<Jar>;
    beans?: Array<Bean>;
    middleware?: Array<Middleware>;
};
export declare class BeanFactory {
    static dispatch: Dispatch;
    static compose: (bean: string, act: string, status: ActStatus) => string;
    static decompose: (action: any) => {
        bean: any;
        act: any;
        status: any;
    };
    static act: <P, R>(operation: Act<P, R>) => Act<P, R>;
    static bean: <T, C>(model: Bean<T>, exported: C) => Bean<T> & C;
    static jar: <T, C>(module: Jar<T>, exported: C) => {
        id: string;
        beans: Bean<any>[];
    } & BeanLifecycle & T & C;
    static controller<T>(controller: ProcedureController<T>): ProcedureController<T>;
    static provider: (props: ProviderProps) => {
        registerClient(): () => any;
        renderToString(route: string, cookiesString: string, options: {
            title: string;
            baseHref: string;
            forceRtl?: boolean;
            productionAssets?: HtmlAsset[];
            developmentAssets?: HtmlAsset[];
        }): Promise<any>;
    };
}
