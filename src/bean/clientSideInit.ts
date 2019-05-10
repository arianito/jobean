import {all, fork, put} from "redux-saga/effects";
import {BeanFactory} from "./BeanFactory";
import {Uri} from "../helpers";
import {BeanConfig} from "./Bean";
import {ActStatus} from "./Act";

export function clientSideInit(store: BeanConfig, route: string, search: string, cookies: {[key:string]: any}) {
	const sagas = [];
	store.beans.forEach(model => model.acts && model.acts.forEach(operation => {
		if (operation.automatic) {
			if (operation.automatic.toRunOn && operation.automatic.toRunOn != 'client')
				return;

			const matchedPath = operation.automatic.path ? Uri.match(store.baseHref + route, {...operation.automatic.path, path: store.baseHref + operation.automatic.path}) : null;


			if (!matchedPath)
				return;

			const state = store.store.getState();

			if (operation.read(state).serverSideFetched)
				sagas.push(fork(function* () {
					yield put({
						type: BeanFactory.compose(model.id, operation.id, ActStatus.reset),
					})
				}));
			else sagas.push(fork(function* () {

				yield put({
					type: BeanFactory.compose(model.id, operation.id, ActStatus.async),
					cookies,
					...Uri.searchParams(search),
					...((matchedPath && matchedPath.params) || {}),
				})
			}));
		}
	}));

	function* root() {
		yield all(sagas);
	}

	return store.saga.run(root);
}
