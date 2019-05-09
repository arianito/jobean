import { ActFn } from "./HookBean";
export declare function useHook<S>(initialState: S, name: any, offline?: boolean): [S, (newContext: S | Partial<S>) => any, (procedure: ActFn<S>) => Promise<S>];
