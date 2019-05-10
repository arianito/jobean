import {takeLatest} from 'redux-saga/effects';
import {reducerForSagas} from "./reducerForSagas";
import {wrapSagas} from "./wrapSagas";
import {BeanFactory} from "./BeanFactory";
import {Bean} from "./Bean";
import {ActBody, ActStatus} from "./Act";

export function prepareBeans(beans: Array<Bean>) {
	const initialState = {};
	const collectedReducers = {};
	const offlineKeys = [];
	const collectedSagas = [];
	beans.forEach(bean => {
		initialState[bean.id] = bean.initialState || {};
		if (bean.saved) {
			offlineKeys.push(bean.id)
		}
		collectedReducers[bean.id] = function (state = (bean.initialState || {}), payload) {
			return (bean.acts && reducerForSagas(bean.id, state, payload)) || (bean.reducer && bean.reducer(state, payload)) || state
		};
		if (bean.acts) {
			bean.acts.forEach(act => {
				act.owner = bean;
				initialState[bean.id][act.id] = {
					pending: false,
					result: null,
					succeed: null,
					status: ActStatus.created,
					updatedAt: null,
					isDirty: true,
					serverSideFetched: false,
					payload: {},
				} as ActBody;

				let fn: any = act.effect || takeLatest;
				collectedSagas.push(fn(BeanFactory.compose(bean.id, act.id, ActStatus.async), function* (payload) {
					yield* wrapSagas(payload, act.body)
				}))
			})
		}
		if (bean.sagas) {
			bean.sagas.map(b => collectedSagas.push(b))
		}
	});

	return {initialState, collectedReducers, offlineKeys, collectedSagas}
}
