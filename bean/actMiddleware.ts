import {LOCATION_CHANGE} from "connected-react-router";
import {clientSideInit} from "./clientSideInit";
import {parseCookies} from "../helpers";
export const actMiddleware = (basename: string, saga, models) => store => next => action => {
	if(action.type === LOCATION_CHANGE){
		clientSideInit({
			baseHref: basename,
			saga,
			store,
			beans: models,
			serverSide: typeof window === 'undefined',
			initialState: {},
		}, action.payload.location.pathname, action.payload.location.search, parseCookies(window.document.cookie || ''));
	}
	return next(action);
};
