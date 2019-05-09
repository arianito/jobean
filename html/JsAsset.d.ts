/// <reference types="react" />
import { HtmlAsset } from "./HtmlAsset";
export declare class JsAsset implements HtmlAsset {
    src: string;
    version: string;
    defer: boolean;
    crossOrigin: boolean;
    constructor(src: any, version?: string, defer?: any, crossOrigin?: any);
    render: (key: any) => JSX.Element;
}
