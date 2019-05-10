import {Bean, BeanConfig, BeanLifecycle, Jar} from "./Bean";
import {Middleware} from "redux";
import React from "react";
import {parseCookies} from "../helpers";
import {configureStore, globalStateAvailable} from "./configureStore";
import {serverSideInit} from "./serverSideInit";
import {Provider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";


export interface ClientProviderProps {
	store?: BeanConfig,
	middleware?: Array<Middleware>,
	splash?: React.ReactNode,
	jars: Array<Jar>
	beans: Array<Bean>
	useMemory?: boolean
}

export interface ClientProviderState {
	store?: BeanConfig
}

export class ClientProvider extends React.Component<ClientProviderProps, ClientProviderState> {
	state: ClientProviderState = {};

	componentDidMount() {
		(async () => {
			const elm = document.querySelector('meta[name="baseHref"]');
			const base = elm ? (elm.getAttribute('content') || '') : '';

			const cookies = parseCookies(document.cookie || '');
			const store = this.props.store || configureStore({
				baseHref: base,
				beans: this.props.beans,
				middleware: this.props.middleware,
				cookies,
				useMemory: this.props.useMemory,
			});


			const app = ((this.props && this.props.children && this.props.children['type'] && this.props.children['type'].prototype) || {}) as BeanLifecycle;


			const data = {
				...store,
				cookies,
			};
			this.props.jars && await Promise.all(this.props.jars.map(jar => jar.configure && jar.configure(data)));
			app.configure && await app.configure(data);

			if (!globalStateAvailable) {
				await serverSideInit(store, window.location.pathname, window.location.search, cookies);
			}

			this.props.jars && await Promise.all(this.props.jars.map(jar => jar.clientStartup && jar.clientStartup(data)));
			app.clientStartup && await app.clientStartup(data);

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
