import { MockedHttpRoute, MockedMiddleware, RequestMiddleware } from "./middleware";
import { HttpMethod, HttpRequest, HttpResponse, HttpDriver, ResponseType } from "./Http";
export declare type LucidConfig = {
    baseURL: string;
    timeout: number;
    method: HttpMethod;
    responseType: ResponseType;
    withCredentials: boolean;
    log: boolean;
};
export declare class Lucid {
    private static driver;
    private static requestMiddlewareChain;
    private static responseMiddlewareChain;
    private static mockedRoutes;
    private static mockedMiddleware;
    private static logger;
    static defaultConfiguration: LucidConfig;
    static config: (driver: HttpDriver, options?: LucidConfig) => void;
    static setLogger: (logger: (...messages: any) => any) => void;
    static addRequestMiddleware: (middleWare: RequestMiddleware) => void;
    static addResponseMiddleware: (success?: (request: HttpResponse<any>) => HttpResponse<any>, failure?: (request: HttpResponse<any>) => HttpResponse<any>) => void;
    static addMock: (name: string, routes: MockedHttpRoute<any>[]) => () => void;
    static removeMock: (name: string) => void;
    static addMiddleware: (name: string, middleware: MockedMiddleware) => () => void;
    static removeMiddleware: (name: string) => void;
    static fetch: <R = any>(request: HttpRequest<any, any>, driver?: HttpDriver) => Promise<HttpResponse<R>>;
    static makeDriver: (driver?: HttpDriver) => HttpDriver;
    static mockDriver: (fallback?: HttpDriver) => (request: HttpRequest<any, any>) => Promise<HttpResponse<any>>;
}
