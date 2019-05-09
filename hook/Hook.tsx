import React, {Fragment} from 'react';
import {HookAct, HookBean, HookContext, HookPayload} from "./HookBean";
import {Connected} from "./Connected";

export type HookProps<T = any> = {
	children?: (context: HookContext<T>) => React.ReactNode
} & HookPayload<T>


export function Hook(props: HookProps) {
	const {children, id, offline} = props;
	return <Connected project={(state, props) => HookBean.read(state)[props.id].context}>{state =>
		<Fragment>{children({
			id,
			offline,
			context: state.context,
			act(procedure) {
				return HookAct.asPromise({
					id,
					offline,
					context: state.context,
					procedure,
				});
			}
		})}</Fragment>}
	</Connected>
}
