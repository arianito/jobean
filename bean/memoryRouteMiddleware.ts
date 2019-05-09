import {LOCATION_CHANGE} from "connected-react-router";
import cookies from 'js-cookie';

export const memoryRouteMiddleware = () => store => next => action => {
	if (action.type === LOCATION_CHANGE) {
		cookies.set('route',action.payload.location.pathname + '?' + action.payload.location.search);
	}
	return next(action);
};
