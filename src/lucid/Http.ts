export type HttpHeaders = { [key: string]: string };

export enum HttpMethod {
	post = 'POST',
	get = 'GET',
	put = 'PUT',
	delete = 'DELETE',
}

export enum ResponseType {
	arrayBuffer = 'arraybuffer',
	blob = 'blob',
	document = 'document',
	json = 'json',
	text = 'text',
	stream = 'stream',
}

export enum ProgressType {
	none = 0,
	download = 1,
	upload = 2,
	any = 3,
}

export type HttpRequest<T = any, C = any> = {
	baseHref?: string
	url: string
	method?: HttpMethod
	context?: C
	responseType?: ResponseType
	timeout?: number
	withCredentials?: boolean
	payload?: T
	headers?: HttpHeaders,
	progress?: (status: ProgressType, total: number, loaded: number) => any,
}


export type HttpResponse<T = any> = {
	status?: number,
	statusText?: string,
	errorCode?: string,
	context?: any
	payload?: T,
	headers?: HttpHeaders
}

export type HttpDriver = (request: HttpRequest) => Promise<HttpResponse>
