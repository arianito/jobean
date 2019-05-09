import {MockedHttpRoute, MockedMiddleware, RequestMiddleware, Middleware} from "./middleware";
import {NetworkCodes} from "./NetworkCodes";
import {Uri} from "../helpers";
import {HttpMethod, HttpRequest, HttpResponse, HttpDriver, ResponseType} from "./Http";


export type LucidConfig = {
	baseURL: string
	timeout: number
	method: HttpMethod
	responseType: ResponseType
	withCredentials: boolean
	log: boolean
}


export class Lucid {
	private static driver: HttpDriver = null;

	private static requestMiddlewareChain: RequestMiddleware[] = [];
	private static responseMiddlewareChain: Middleware[] = [];

	private static mockedRoutes: { [key: string]: Array<MockedHttpRoute<any>> } = {};
	private static mockedMiddleware: { [key: string]: MockedMiddleware } = {};

	private static logger: (...messages: any) => any = null;

	static defaultConfiguration: LucidConfig = {
		baseURL: '',
		timeout: 1000,
		log: false,
		method: HttpMethod.post,
		responseType: ResponseType.json,
		withCredentials: false,
	};

	static config = (driver: HttpDriver, options?: LucidConfig) => {
		Lucid.driver = driver;
		if (options)
			Lucid.defaultConfiguration = {
				...Lucid.defaultConfiguration,
				...options,
			}
	};

	static setLogger = (logger: (...messages: any) => any) => {
		Lucid.logger = logger;
	};

	static addRequestMiddleware = (middleWare: RequestMiddleware) => {
		Lucid.requestMiddlewareChain.push(middleWare);
	};


	static addResponseMiddleware = (success?: (request: HttpResponse) => HttpResponse, failure?: (request: HttpResponse) => HttpResponse) => {
		Lucid.responseMiddlewareChain.push({
			success,
			failure: failure,
		});
	};

	static addMock = (name: string, routes: Array<MockedHttpRoute<any>>) => {
		Lucid.mockedRoutes[name] = routes;
		return () => {
			delete Lucid.mockedRoutes[name];
		}
	};

	static removeMock = (name: string) => {
		delete Lucid.mockedRoutes[name];
	};

	static addMiddleware = (name: string, middleware: MockedMiddleware) => {
		Lucid.mockedMiddleware[name] = middleware;

		return () => {
			delete Lucid.mockedMiddleware[name];
		}
	};

	static removeMiddleware = (name: string) => {
		delete Lucid.mockedMiddleware[name];
	};

	static fetch = async <R = any>(request: HttpRequest, driver: HttpDriver = null): Promise<HttpResponse<R>> => {
		let requestCache = request;
		for (let m of Lucid.requestMiddlewareChain) {
			requestCache = m(requestCache)
		}
		//
		let responseCache = null;
		try {
			responseCache = await (driver || Lucid.driver)(requestCache)
		} catch (e) {
			let failureCache = e as HttpResponse;
			for (let m of Lucid.responseMiddlewareChain) {
				if (m.failure) {
					failureCache = m.failure(failureCache)
				}
			}
			throw failureCache
		}
		//
		for (let m of Lucid.responseMiddlewareChain) {
			if (m.success) {
				responseCache = m.success(responseCache)
			}
		}
		return responseCache
	};

	static makeDriver = (driver?: HttpDriver) => {
		return driver;
	};

	static mockDriver = (fallback?: HttpDriver) => {
		return async (request: HttpRequest): Promise<HttpResponse> => {

			const path = (request.baseHref || Lucid.defaultConfiguration.baseURL) + request.url;
			const method = request.method || Lucid.defaultConfiguration.method;
			const oldPath = request.url;
			const oldMethod = request.method;
			request.url = path;
			request.method = method;

			if (Lucid.defaultConfiguration.log && Lucid.logger) {
				Lucid.logger('request', request);
			}

			const routes = Object.keys(Lucid.mockedRoutes).reduce((acc, value) => {
				return [
					...acc,
					...Lucid.mockedRoutes[value],
				]
			}, []);

			let methodNotFound = false;
			for (let route of routes) {
				const matchedPath = Uri.match(path, {
					...route.path,
					path: Lucid.defaultConfiguration.baseURL + route.path.path
				});
				if (matchedPath) {
					// check if method is available
					if (route.method == method) {
						let output: HttpResponse = {
							headers: {},
							status: NetworkCodes.OK,
							statusText: NetworkCodes.getStatus(NetworkCodes.OK),
							payload: '',
						};
						const setHeader = function (key: string, ...value) {
							output.headers[key] = value.join('; ');
						};
						const setStatus = function (status: number) {
							output.status = status;
							output.statusText = NetworkCodes.getStatus(status);
						};
						const send = function (text: any) {
							if (!output.payload || typeof output.payload != 'string')
								output.payload = '';
							output.payload += text;
						};
						const responseHelper: any = function (obj: any) {
							setHeader('content-type', 'application/json');
							send(obj ? JSON.stringify(obj) : '{}');
							return {send, setStatus, setHeader}
						};

						responseHelper.send = send;
						responseHelper.setStatus = setStatus;
						responseHelper.setHeader = setHeader;


						let cache = route.handler;


						let isError = false;
						try {

							if (route.middleware) {
								for (let i = route.middleware.length - 1; i >= 0; i--) {
									const m = route.middleware[i];
									if (Lucid.mockedMiddleware && Lucid.mockedMiddleware[m]) {
										cache = Lucid.mockedMiddleware[m](cache);
									}
								}
							}

							request.context = request.context || {};
							request.context.match = matchedPath;

							await cache(request, responseHelper);

							if (Lucid.defaultConfiguration.log && Lucid.logger) {
								Lucid.logger('response', output);
							}

							if (output.headers['content-type'] && output.headers['content-type'].includes('application/json')) {
								try {
									output.payload = JSON.parse(output.payload);
								} catch (e) {

									if (Lucid.defaultConfiguration.log && Lucid.logger) {
										Lucid.logger('error', output);
									}

									delete output.payload;
								}
							}
							if (output.status >= 400) {
								isError = true;
							} else {
								return output;
							}

						} catch (e) {
							if (Lucid.defaultConfiguration.log && Lucid.logger) {
								Lucid.logger('error', '500 internal server error');
							}
							throw <HttpResponse>{
								status: NetworkCodes.INTERNAL_SERVER_ERROR,
								statusText: NetworkCodes.getStatus(NetworkCodes.INTERNAL_SERVER_ERROR),
								payload: e,
							};
						}
						throw output;
					} else {
						methodNotFound = true;
					}
				}
			}
			if (methodNotFound) {
				if (Lucid.defaultConfiguration.log && Lucid.logger) {
					Lucid.logger('error', '405 method not allowed');
				}
				throw <HttpResponse>{
					status: NetworkCodes.METHOD_NOT_ALLOWED,
					statusText: NetworkCodes.getStatus(NetworkCodes.METHOD_NOT_ALLOWED),
				};
			}

			if (fallback) {
				if (Lucid.defaultConfiguration.log && Lucid.logger) {
					Lucid.logger('fallback', oldPath);
				}
				request.url = oldPath;
				request.method = oldMethod;
				return fallback(request);
			}

			if (Lucid.defaultConfiguration.log && Lucid.logger) {
				Lucid.logger('error','404 not found');
			}
			throw <HttpResponse>{
				status: NetworkCodes.NOT_FOUND,
				statusText: NetworkCodes.getStatus(NetworkCodes.NOT_FOUND),
			};
		}
	};

}
