import {Dispatch, Middleware} from "redux";
import React from "react";
import {parseCookies} from "../helpers";
import {configureStore} from "./configureStore";
import {serverSideInit} from "./serverSideInit";
import {Provider} from "react-redux";
import {StaticRouter} from "react-router";
import {Bean, BeanLifecycle, Jar} from "./Bean";
import {Act, ActBody, ActStatus} from "./Act";
import {ProcedureController} from "./Procedure";
import {Html, HtmlAsset} from "../html";
import {ClientProvider} from "./ClientProvider";


export type ProviderProps = {
	id: string
	rtl?: boolean
	useSSR?: boolean
	useMemory?: boolean
	app: React.ReactNode
	head?: React.ComponentType<{ state: any }>,
	body?: React.ComponentType<{ state: any }>
	splash?: React.ReactNode
	jars?: Array<Jar>
	beans?: Array<Bean>
	middleware?: Array<Middleware>
}

export class BeanFactory {

	static dispatch: Dispatch = null;

	static compose = (bean: string, act: string, status: ActStatus) => {
		return [bean, act, status].join('$$');
	};

	static decompose = (action: string) => {
		const spl = action.split('$$');
		return {
			bean: spl.length > 0 && spl[0],
			act: spl.length > 1 && spl[1],
			status: spl.length > 2 && spl[2],
		}
	};

	static act = <P, R>(operation: Act<P, R>): Act<P, R> => {
		operation.typeOf = (payload) => {
			return {
				type: BeanFactory.compose(operation.owner.id, operation.id, ActStatus.async),
				...(payload || {}),
			};
		};
		operation.asPromise = (payload) => {
			return new Promise((acc, rej) => {
				BeanFactory.dispatch({
					type: BeanFactory.compose(operation.owner.id, operation.id, ActStatus.async),
					...(payload || {}),
					done: (status, result) => {
						(status ? acc : rej)(result)
					}
				})
			})
		};
		operation.execute = (payload) => {
			BeanFactory.dispatch({
				type: BeanFactory.compose(operation.owner.id, operation.id, ActStatus.async),
				...(payload || {}),
			})
		};
		operation.clean = () => {
			BeanFactory.dispatch({
				type: BeanFactory.compose(operation.owner.id, operation.id, ActStatus.clear),
			});
		};

		operation.read = (state) => {
			const def = {
				pending: false,
				result: null,
				succeed: null,
				status: ActStatus.created,
				updatedAt: null,
				isDirty: true,
				serverSideFetched: false,
				payload: {},
			} as ActBody;
			try {
				return state[operation.owner.id][operation.id] || def;
			} catch (e) {
				return def;
			}
		};
		return operation;
	};

	static bean = <T, C>(model: Bean<T>, exported: C): (Bean<T> & C) => {
		return {
			...exported,
			...model,
			read: (state) => {
				try {
					return state[model.id] || {};
				} catch (e) {
					return {};
				}
			},
		};
	};

	static jar = <T, C>(module: Jar<T>, exported: C): (Jar<T> & C) => {
		return {
			...module,
			...exported,
		};
	};

	static controller<T>(controller: ProcedureController<T>) {
		return controller
	}

	static provider = (props: ProviderProps) => ({
		registerClient() {
			const {app, id, splash, beans = [], useMemory, jars = [], middleware = []} = props;

			const root = <ClientProvider
				splash={splash}
				jars={jars}
				useMemory={useMemory}
				beans={beans}
				middleware={middleware}>
				{app}
			</ClientProvider>;

			const dom = require('react-dom');
			const element = document.getElementById(id);
			if (process.env.NODE_ENV === 'production') {
				dom.hydrate(root, element);
			} else {
				dom.render(root, element);
				return () => dom.hydrate(root, element);
			}
		},
		async renderToString(options: {
			route: string,
			cookiesString: string
			title: string,
			baseHref: string,
			forceRtl?: boolean,
			productionAssets?: Array<HtmlAsset>,
			developmentAssets?: Array<HtmlAsset>,
		}) {

			const {app, id, rtl, beans = [], body, head, useSSR, jars = [], useMemory, middleware = []} = props;
			const {title, baseHref, forceRtl, productionAssets, developmentAssets} = options;

			const cookies = parseCookies(options.cookiesString);

			if (useMemory) {
				options.route = cookies['route'] || '/';
			}
			const store = configureStore({
				baseHref,
				beans,
				middleware,
				cookies,
				useMemory,
			});
			const dom = require('react-dom/server');
			let initialState = {};
			if (process.env.NODE_ENV === 'production') {
				const reactApp = ((app['type'] && app['type'].prototype) || {}) as BeanLifecycle;
				const data = {
					...store,
					cookies,
				};

				jars && await Promise.all(jars.map(jar => jar.configure && jar.configure(data)));
				reactApp.configure && await reactApp.configure(data);


				const spl = options.route.split('?');
				await serverSideInit(store, spl[0], spl[1], cookies);
				initialState = store.store.getState();
			}

			return dom.renderToString(
				<Provider store={store.store}>
					<StaticRouter basename={baseHref} context={{}} location={options.route}>
						<Html
							id={id}
							title={title}
							direction={(forceRtl !== undefined ? forceRtl : rtl) ? 'rtl' : 'ltr'}
							baseHref={baseHref}
							initialState={process.env.NODE_ENV === 'production' && initialState}
							productionAssets={productionAssets}
							developmentAssets={developmentAssets}
							head={head && React.createElement(head, {state: initialState})}
							body={body && React.createElement(body, {state: initialState})}
						>
						{(process.env.NODE_ENV === 'production' && useSSR) && app}
						</Html>
					</StaticRouter>
				</Provider>
			);
		}
	});
}
