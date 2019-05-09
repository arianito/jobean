import {Dispatch, Middleware} from "redux";
import React from "react";
import {parseCookies} from "../helpers";
import {configureStore, globalStateAvailable} from "./configureStore";
import {serverSideInit} from "./serverSideInit";
import {Provider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import {StaticRouter} from "react-router";
import {Bean, BeanConfig, BeanLifecycle, Jar} from "./Bean";
import {Act, ActBody, ActStatus} from "./Act";
import {ProcedureController} from "./Procedure";
import {Html, HtmlAsset} from "../html";


export type ProviderProps = {
	id: string
	rtl?: boolean
	ssr?: boolean
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

	static decompose = (action) => {
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
			const {app, id, splash, beans, useMemory, jars, middleware = []} = props;


			interface ClientProviderProps {
				store?: BeanConfig,
				middleware?: Array<Middleware>,
				splash?: React.ReactNode,
				models: Array<Bean>
				useMemory?: boolean
			}

			interface ClientProviderState {
				store?: BeanConfig
			}

			class ClientProvider extends React.Component<ClientProviderProps, ClientProviderState> {
				state: ClientProviderState = {};

				componentDidMount() {
					(async () => {
						const base = document.querySelector('meta[id="baseHref"]').getAttribute('content') || '';

						const cookies = parseCookies(document.cookie || '');
						const store = this.props.store || configureStore({
							baseHref: base,
							models: this.props.models,
							middleware: this.props.middleware,
							cookies,
							useMemory: this.props.useMemory,
						});


						const app = ((this.props && this.props.children && this.props.children['type'] && this.props.children['type'].prototype) || {}) as BeanLifecycle;


						const data = {
							...store,
							cookies,
						};
						await Promise.all(jars.map(jar => jar.configure && jar.configure(data)));
						await app.configure && app.configure(data);

						if (!globalStateAvailable) {
							await serverSideInit(store, window.location.pathname, window.location.search, cookies);
						}

						await Promise.all(jars.map(jar => jar.clientStartup && jar.clientStartup(data)));
						await app.clientStartup && app.clientStartup(data);

						this.setState({
							store,
						})
					})()
				}

				render() {
					const store = this.state.store;
					if (store) {
						return (
							<Provider store={store.store}>
								<ConnectedRouter history={store.history}>
									{this.props.children}
								</ConnectedRouter>
							</Provider>
						)
					}
					if (this.props.splash) {
						return this.props.splash
					}
					return null
				}
			}

			const root = <ClientProvider splash={splash} useMemory={useMemory} models={beans}
										 middleware={middleware}>{app}</ClientProvider>;


			const dom = require('react-dom');
			const element = document.getElementById(id);
			if (process.env.NODE_ENV === 'production') {
				dom.hydrate(root, element);
			} else {
				dom.render(root, element);
				return () => dom.hydrate(root, element);

			}
		},
		async renderToString(route: string, cookiesString: string, options: {
			title: string,
			baseHref: string,
			forceRtl?: boolean,
			productionAssets?: Array<HtmlAsset>,
			developmentAssets?: Array<HtmlAsset>,
		}) {

			const {app, id, rtl, beans, body, head, ssr, jars, useMemory} = props;
			const {title, baseHref, forceRtl, productionAssets, developmentAssets} = options;

			const cookies = parseCookies(cookiesString);

			if (useMemory) {
				route = cookies['route'] || '/';
			}
			const store = configureStore({
				baseHref: baseHref,
				models: beans,
				middleware: [],
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

				await Promise.all(jars.map(jar => jar.configure && jar.configure(data)));
				await reactApp.configure && reactApp.configure(data);


				const spl = route.split('?');
				await serverSideInit(store, spl[0], spl[1], cookies);
				initialState = store.store.getState();
			}

			return dom.renderToString(
				<Provider store={store.store}>
					<StaticRouter basename={baseHref} context={{}} location={route}>
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
						{(process.env.NODE_ENV === 'production' && ssr) && app}
						</Html>
					</StaticRouter>
				</Provider>
			);
		}
	});
}
