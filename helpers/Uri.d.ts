export interface RoutePattern {
    path: string;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
}
export interface MatchResult {
    path: string;
    url: string;
    isExact: boolean;
    params: {
        [key: string]: string;
    };
}
export declare class Uri {
    static searchParams(search: string): {};
    static match(uri: any, pattern: RoutePattern): MatchResult;
}
