/// <reference types="react" />
import { HtmlAsset } from "./HtmlAsset";
export declare class CssAsset implements HtmlAsset {
    src: string;
    version: string;
    constructor(src: string, version?: string);
    render: (key: any) => JSX.Element;
}
