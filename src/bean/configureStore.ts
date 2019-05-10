import {connectRouter, routerMiddleware} from "connected-react-router";
import {applyMiddleware, combineReducers, compose, createStore, Middleware} from "redux";
import {all} from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga'
import * as History from 'history'
import {Bean, BeanConfig} from "./Bean";
import {prepareBeans} from "./prepareBeans";
import {BeanFactory} from "./BeanFactory";
import {memoryRouteMiddleware} from "./memoryRouteMiddleware";
import {actMiddleware} from "./actMiddleware";
import {filterObjectByKeys, Base64} from "../helpers";


export const globalState = () => JSON.parse(Base64.decode(global['BEAN']));
export const globalStateAvailable = typeof global !== 'undefined' && global['BEAN'];


function readState(key) {
	try {
		return JSON.parse(Base64.decode(localStorage.getItem(key))) || {}
	} catch (e) {
		return {}
	}
}

function saveState(key, state) {
	localStorage.setItem(key, Base64.encode(JSON.stringify(state)))
}

export type ConfigureStorePayload = {
	baseHref: string,
	beans: Array<Bean>,
	middleware?: Array<Middleware>,
	forceClear?: boolean,
	cookies?: { [key: string]: any },
	useMemory?: boolean
}


export const configureStore = (props: ConfigureStorePayload): BeanConfig => {
	const key = Base64.encode(props.baseHref || '/');
	const {initialState, collectedReducers, offlineKeys, collectedSagas} = prepareBeans(props.beans);

	function* rootSagas() {
		yield all(collectedSagas)
	}


	let ssrState = globalStateAvailable ? {
		...globalState(),
		router: undefined,
	} : {};

	let history = null;
	let routeMiddleware = null;
	const collectedMiddleware = props.middleware || [];

	if (typeof window !== 'undefined') {

		if (props.useMemory) {
			history = History.createMemoryHistory({initialEntries: [props.cookies['route'] || '/'], initialIndex: 0});
		} else {
			history = History.createBrowserHistory({basename: props.baseHref});
		}
		routeMiddleware = routerMiddleware(history);
		collectedReducers['router'] = connectRouter(history);
		collectedMiddleware.push(routeMiddleware);
	}

	const aux = combineReducers(collectedReducers);

	const sagaMiddleware = createSagaMiddleware();

	let savedState = (typeof window !== 'undefined' && !props.forceClear) ?
		filterObjectByKeys(readState(key), offlineKeys) : {};


	let store = null;
	const state = {...initialState, ...savedState, ...ssrState};
	const operationMiddleware = actMiddleware(props.baseHref, sagaMiddleware, props.beans.filter(a => a.acts.some(a => !!a.automatic)));
	const memoryRouterMiddleware = props.useMemory ? [memoryRouteMiddleware()] : [];
	const middleware = applyMiddleware(...collectedMiddleware, sagaMiddleware, operationMiddleware, ...memoryRouterMiddleware);

	if (process.env.NODE_ENV == 'development' && typeof window !== 'undefined') {
		store = createStore(aux, state, (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose)(middleware))
	} else {
		store = createStore(aux, state, middleware)
	}
	BeanFactory.dispatch = store.dispatch;

	if (typeof window !== 'undefined') {
		window.addEventListener('beforeunload', () => {
			const currentState = store.getState();
			saveState(key, Object.keys(currentState).reduce((output, key) => {
				const model = currentState[key];
				const found = props.beans && props.beans.find(a => a.id == key);
				if (found && found.saved) {
					return {...output, [key]: (found.dispose && found.dispose(model)) || model};
				}
				return output;
			}, {}));
		});
	}
	sagaMiddleware.run(rootSagas);
	return {
		store,
		initialState: state,
		serverSide: typeof window === 'undefined',
		history,
		saga: sagaMiddleware,
		beans: props.beans,
		baseHref: props.baseHref
	}
};
