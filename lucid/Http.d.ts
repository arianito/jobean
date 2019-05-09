export declare type HttpHeaders = {
    [key: string]: string;
};
export declare enum HttpMethod {
    post = "POST",
    get = "GET",
    put = "PUT",
    delete = "DELETE"
}
export declare enum ResponseType {
    arrayBuffer = "arraybuffer",
    blob = "blob",
    document = "document",
    json = "json",
    text = "text",
    stream = "stream"
}
export declare type HttpRequest<T = any, C = any> = {
    baseHref?: string;
    url: string;
    method?: HttpMethod;
    context?: C;
    responseType?: ResponseType;
    timeout?: number;
    withCredentials?: boolean;
    payload?: T;
    headers?: HttpHeaders;
};
export declare type HttpResponse<T = any> = {
    status?: number;
    statusText?: string;
    errorCode?: string;
    context?: any;
    payload?: T;
    headers?: HttpHeaders;
};
export declare type HttpDriver = (request: HttpRequest) => Promise<HttpResponse>;
