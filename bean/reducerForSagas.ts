import {BeanFactory} from "./BeanFactory";
import {ActBody, ActStatus} from "./Act";

export const reducerForSagas = function (beanName: string, state, payload) {
	const action = BeanFactory.decompose(payload.type);
	if (action.status && action.bean == beanName) {
		switch (action.status) {
			case ActStatus.async:
				return {
					...state,
					[action.act]: {
						...(state[action.act] || {}),
						pending: true,
						succeed: null,
					} as ActBody,
				};
			case ActStatus.canceled:
				return {
					...state,
					[action.act]: {
						...(state[action.act] || {}),
						status: action.status,
						succeed: null,
						serverSideFetched: payload.server,
						isDirty: true,
					} as ActBody,
				};
			case ActStatus.failed:
				return {
					...state,
					[action.act]: {
						...(state[action.act] || {}),
						pending: false,
						succeed: false,
						result: payload.result,
						status: action.status,
						updatedAt: Date.now(),
						serverSideFetched: payload.server,
						isDirty: true,
					} as ActBody,
				};
			case ActStatus.succeed:

				if(!state[action.act].isDirty && (!payload.result || typeof payload.result === 'undefined'))
					return {
						...state,
						[action.act]: {
							...(state[action.act] || {}),
							pending: false,
							succeed: true,
							status: action.status,
							updatedAt: Date.now(),
							serverSideFetched: payload.server,
							payload: payload.payload,
							isDirty: false,
						}
					};
				return {
					...state,
					[action.act]: {
						...(state[action.act] || {}),
						pending: false,
						succeed: true,
						result: payload.result,
						status: action.status,
						updatedAt: Date.now(),
						serverSideFetched: payload.server,
						payload: payload.payload,
						isDirty: false,
					} as ActBody,
				};
			case ActStatus.clear:
				return {
					...state,
					[action.act]: {
						...(state[action.act] || {}),
						pending: false,
						result: null,
						succeed: false,
						isDirty: true,
						payload: {},
						serverSideFetched: false,
						status: action.status,
					} as ActBody,
				};
			case ActStatus.reset:
				return {
					...state,
					[action.act]: {
						...(state[action.act] || {}),
						serverSideFetched: false,
					} as ActBody,
				};
		}
	}
};

