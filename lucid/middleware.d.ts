import { MatchResult, RoutePattern } from "../helpers";
import { HttpMethod, HttpRequest, HttpResponse } from "./Http";
export declare type RequestMiddleware = (request: HttpRequest) => HttpRequest;
export declare type MockedMiddleware = (next: MockedHttpHandler<any, any>) => MockedHttpHandler<any, any>;
export declare type Middleware = {
    success?: (request: HttpResponse) => HttpResponse;
    failure?: (request: HttpResponse) => HttpResponse;
};
export declare type MockedHttpHandler<P, C> = (request: HttpRequest<P, C>, response: MockedResponse) => any;
export declare type MockedResponseFunctions = {
    setHeader(key: string, ...value: string[]): any;
    setStatus(code: number): any;
    send(text: any): any;
};
export declare type MockedResponse = ((obj?: any) => MockedResponseFunctions) & MockedResponseFunctions;
export interface MockedHttpRoute<P> {
    path: RoutePattern;
    middleware?: string[];
    method: HttpMethod;
    handler: MockedHttpHandler<P, {
        match: MatchResult;
        [key: string]: any;
    }>;
}
