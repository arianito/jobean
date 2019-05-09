import React from 'react';
import { HtmlAsset } from "./HtmlAsset";
export interface HtmlProps {
    id?: string;
    title: string;
    baseHref: string;
    head?: React.ReactNode;
    body?: React.ReactNode;
    direction?: 'ltr' | 'rtl';
    initialState?: any;
    productionAssets: Array<HtmlAsset>;
    developmentAssets: Array<HtmlAsset>;
    html?: string;
    children?: React.ReactNode;
}
export declare function Html(props: HtmlProps): JSX.Element;
