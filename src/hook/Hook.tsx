import React, {Fragment} from 'react';
import {HookAct, HookBean, HookContext, HookPayload} from "./HookBean";
import {Connected} from "./Connected";

export type HookProps<T = any> = {
	children?: (context: HookContext<T>) => React.ReactNode
} & HookPayload<T>


export function Hook(props: HookProps) {
	const {children, id, saved} = props;
	return <Connected project={(state, props) => HookBean.read(state)[props.id].context}>{state =>
		<Fragment>{children({
			id,
			saved: saved,
			context: state.context,
			act(procedure) {
				return HookAct.asPromise({
					id,
					saved: saved,
					context: state.context,
					procedure,
				});
			}
		})}</Fragment>}
	</Connected>
}
