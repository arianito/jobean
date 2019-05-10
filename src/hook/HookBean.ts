import {filterObject} from "../helpers";
import {AnyAction} from "redux";
import {BeanFactory} from "../bean";
import {Bean} from "../bean";
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
	saved?: boolean,
	context?: T,
	expiresAt?: number,
}



const changeContext = (id: string, saved: boolean, context: any): ChangeContextAction => ({
	type: HOOK_CHANGE_CONTEXT,
	id,
	saved,
	context
});


export const HookAct = BeanFactory.act<HookPayload & { procedure: ActFn }, any>({
	id: 'Act',
	* body(payload) {
		const newContext = yield* payload.procedure(payload.context);
		yield put(changeContext(payload.id, payload.saved, newContext));
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
						saved: payload.saved,
						expiresAt: Date.now() + 60000 // 1 min
					},
				} as HookModelState
		}
	}
}, {
	HookAct,
	changeContext,

});
