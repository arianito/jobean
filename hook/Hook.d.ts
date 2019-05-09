import React from 'react';
import { HookContext, HookPayload } from "./HookBean";
export declare type HookProps<T = any> = {
    children?: (context: HookContext<T>) => React.ReactNode;
} & HookPayload<T>;
export declare function Hook(props: HookProps): JSX.Element;
