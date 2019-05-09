import {MatchResult, RoutePattern} from "../helpers";
import {HttpMethod, HttpRequest, HttpResponse} from "./Http";

export type RequestMiddleware = (request: HttpRequest) => HttpRequest

export type MockedMiddleware = (next: MockedHttpHandler<any, any>) => MockedHttpHandler<any, any>

export type Middleware = {
	success?: (request: HttpResponse) => HttpResponse
	failure?: (request: HttpResponse) => HttpResponse
}


export type MockedHttpHandler<P, C> = (request: HttpRequest<P, C>, response: MockedResponse) => any

export type MockedResponseFunctions = {
	setHeader(key: string, ...value: string[])
	setStatus(code: number)
	send(text: any)
};

export type MockedResponse = ((obj?: any) => MockedResponseFunctions) & MockedResponseFunctions;


export interface MockedHttpRoute<P> {
	path: RoutePattern
	middleware?: string[]
	method: HttpMethod
	handler: MockedHttpHandler<P, {match: MatchResult,[key:string]: any}>
}
