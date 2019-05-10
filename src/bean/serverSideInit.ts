import {fork, all} from "redux-saga/effects";

import {Uri} from "../helpers";
import {wrapSagas} from "./wrapSagas";
import {BeanFactory} from "./BeanFactory";
import {BeanConfig} from "./Bean";
import {ActStatus} from "./Act";


export function serverSideInit(store: BeanConfig, route: string, search: string, cookies: { [key: string]: any }): Promise<any> {

	const sagas = [];
	let environment = 'client';
	if (typeof window === 'undefined') {
		environment = 'server';
	}
	store.beans.forEach(bean => bean.acts && bean.acts.forEach(act => {
		if (act.automatic) {
			if (act.automatic.toRunOn && (act.automatic.toRunOn != environment))
				return;

			const matchedPath = act.automatic.path ? Uri.match(route, {
				...act.automatic.path,
				path: store.baseHref + act.automatic.path.path
			}) : null;
			if (act.automatic.path && !matchedPath)
				return;

			sagas.push(fork(function* () {
				yield* wrapSagas({
					type: BeanFactory.compose(bean.id, act.id, ActStatus.async),
					cookies,
					...Uri.searchParams(search),
					...((matchedPath && matchedPath.params) || {}),
				}, act.body, true)
			}));
		}
	}));

	function* root() {
		yield all(sagas);
	}

	return store.saga.run(root).toPromise()
}
