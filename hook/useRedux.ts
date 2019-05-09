import {useContext, useEffect, useState} from "react";
import {ReactReduxContext} from "react-redux";
import {optional} from "../helpers";


export function useRedux<S>(selector: (state) => S, initialState?: S): [S] {
	const redux = useContext(ReactReduxContext);
	const state = redux.store.getState();

	const [context, setContext] = useState(optional(
		() => selector(state),
		initialState,
	));

	function changes() {
		const state = redux.store.getState();
		setContext(optional(
			() => selector(state),
			initialState,
		));
	}

	useEffect(() => {
		const un = redux.store.subscribe(changes);
		return () => {
			un();
		};
	}, []);

	return [context];
}
