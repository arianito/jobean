import {filterObject} from "../helpers";
import {AnyAction} from "redux";
import {BeanFactory} from "../bean/BeanFactory";
import {Bean} from "../bean/Bean";
import {put} from 'redux-saga/effects';

export const HOOK_CHANGE_CONTEXT = 'HOOK_CHANGE_CONTEXT';

export type ChangeContextAction = AnyAction & HookPayload;


export type HookContext<T = any> = {
	act: Actor<T>
} & HookPayload<T>

export type HookModelState = {
	[key: string]: HookPayload,
};
export type ActFn<T = any> = (context: T) => IterableIterator<any>;
export type Actor<T = any> = (procedure: ActFn<T>) => Promise<T>

export type HookPayload<T = any> = {
	id: any,
	offline?: boolean,
	context?: T,
	expiresAt?: number,
}



const changeContext = (id: string, offline: boolean, context: any): ChangeContextAction => ({
	type: HOOK_CHANGE_CONTEXT,
	id,
	offline,
	context
});


export const HookAct = BeanFactory.act<HookPayload & { procedure: ActFn }, any>({
	id: 'Action',
	* body(payload) {
		const newContext = yield* payload.procedure(payload.context);
		yield put(changeContext(payload.id, payload.offline, newContext));
		return newContext;
	}
});


export const HookBean = BeanFactory.bean(<Bean<HookModelState>>{
	id: 'Hook',
	saved: true,
	state: {},
	acts: [
		HookAct
	],
	dispose(state?: HookModelState): HookModelState {
		return filterObject(state, value => value.saved || (value.expiresAt >= Date.now()) )
	},
	reducer(state, action) {
		switch (action.type) {
			case HOOK_CHANGE_CONTEXT:
				const payload = action as ChangeContextAction;
				return {
					...state,
					[payload.id]: {
						context: payload.context,
						id: payload.id,
						offline: payload.offline,
						expiresAt: Date.now() + 60000 // 1 min
					},
				} as HookModelState
		}
	}
}, {});
