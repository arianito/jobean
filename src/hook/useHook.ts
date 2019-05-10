import {useContext, useEffect, useState} from "react";
import {ReactReduxContext} from "react-redux";
import {ActFn, HookAct, HookBean} from "./HookBean";
import {optional} from "../helpers";


export function useHook<S>(initialState: S, name: any, saved?: boolean): [S, (newContext: S | Partial<S>) => any, (procedure: ActFn<S>) => Promise<S>] {
	const redux = useContext(ReactReduxContext);
	const id = name;
	const state = redux.store.getState();
	const [context, setContext] = useState(optional(
		() => state[HookBean.id][id].context,
		initialState,
	));


	async function procedure(procedure: ActFn<S>) {
		try {
			return await HookAct.asPromise({saved, id, procedure, context});
		} catch (result) {
			throw result;
		}
	}

	async function setHook(newContext: Partial<S>) {
		await HookAct.asPromise({
			saved, id, procedure: function* () {
				return newContext;
			}, context
		})
	}

	function changes() {
		const state = redux.store.getState();
		setContext(optional(
			() => state[HookBean.id][id].context,
			initialState,
		));
	}

	useEffect(() => {
		const un = redux.store.subscribe(changes);
		return () => {
			un();
		};
	}, []);

	return [context, setHook, procedure];
}
