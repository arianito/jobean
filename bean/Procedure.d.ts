import React from 'react';
import { HookContext } from "../hook";
export declare type CheckpointProps = {
    children?: (context: ProcedureProvider) => React.ReactNode;
} & CheckpointItem;
export declare function Checkpoint(props: CheckpointProps): any;
export interface CheckpointItem {
    id: string;
    title?: string;
    context?: HookContext;
    [key: string]: any;
}
export declare type ProcedureFunction<C> = (context?: Partial<C & {
    checkpoint?: string;
}>) => Promise<C & {
    checkpoint?: string;
}>;
export interface ProcedureController<T = {}> {
    received: (props: ProcedureProvider<T> & {
        checkpoint?: string;
    }) => IterableIterator<any>;
}
export declare type ProcedureProvider<C = {}> = {
    index: number;
    checkpoint: string;
    pending: boolean;
    upload: ProcedureFunction<C>;
    checkpoints: Array<CheckpointItem>;
} & C;
export interface ProcedureProps {
    id: string;
    controller?: ProcedureController;
    content?: (provider: ProcedureProvider) => React.ReactNode;
    attachToBottom?: boolean;
    children?: Array<React.ReactElement<CheckpointProps>>;
}
export declare function Procedure(props: ProcedureProps): JSX.Element;
