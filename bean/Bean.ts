import {AnyAction, Store} from "redux";
import {ForkEffect} from "redux-saga/effects";
import {History} from "history";
import {SagaMiddleware} from "redux-saga";
import {Act} from "./Act";


export interface BeanLifecycle {
	configure(props: BeanConfig): Promise<void>
	clientStartup(props: BeanConfig): Promise<void>
	dispose()
}

export interface BeanConfig {
	baseHref?: string,
	store: Store,
	saga: SagaMiddleware<{}>,
	beans: Array<Bean>,
	initialState: any,
	serverSide: boolean,
	history?: History<any>,
	cookies?: { [key: string]: string | string[] }
}


export type Bean<T = any> = {
	id: string
	saved?: boolean
	initialState?: T
	acts?: Array<Act>
	reducer?: (state: T, payload: AnyAction) => T | any
	sagas?: Array<ForkEffect>
	dispose?(state?: T): T,
	read?(state:any): Partial<T>,
}

export type Jar<T = {}> = {
	id: string,
	beans: Array<Bean>
} & BeanLifecycle & T;
