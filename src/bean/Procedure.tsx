import React, {Fragment} from 'react';
import {Hook, HookContext} from "../hook";


export type CheckpointProps = {
	children?: (context: ProcedureProvider) => React.ReactNode,
} & CheckpointItem;


export function Checkpoint(props: CheckpointProps) {
	return null;
}

export interface CheckpointItem {
	id: string,
	title?: string,
	context?: HookContext,
	[key:string]:any,
}

export type ProcedureFunction<C> = (context?: Partial<C & {checkpoint?: string}>) => Promise<C & {checkpoint?: string}>

export interface ProcedureController<T={}> {
	received: (props: ProcedureProvider<T> & {checkpoint?: string}) => IterableIterator<any>
}

export type ProcedureProvider<C={}> = {
	index: number,
	checkpoint: string,
	pending: boolean,
	upload: ProcedureFunction<C>,
	checkpoints: Array<CheckpointItem>
} & C;


export interface ProcedureProps {
	id: string,
	controller?: ProcedureController,
	content?: (provider: ProcedureProvider) => React.ReactNode,
	attachToBottom?: boolean,
	children?: Array<React.ReactElement<CheckpointProps>>,
}

export function Procedure(props: ProcedureProps) {
	const {id, children, controller, content, attachToBottom} = props;
	return <Hook id={id}>
		{(hook: HookContext<ProcedureProvider>) => {
			const checkpoint = hook.context.checkpoint || children[0]['props']['id'];
			for (let i = 0; i < children.length; i++) {
				const childProps = children[i].props;
				if (childProps.id === checkpoint) {
					const provider: ProcedureProvider<{}> = {
						...hook.context,
						index: i,
						checkpoint,
						checkpoints: children.map(a => a.props),
						async upload<T>(context?: T) {
							await hook.act(function* (payload) {
								return Object.assign({}, payload, context, {pending: true});
							});
							const newContext = await hook.act(function* (payload) {
								let output = Object.assign({}, {checkpoint, pending: true}, payload, context);
								if (controller)
									output = (yield* controller.received(output)) || output;
								return output;
							});
							await hook.act(function* (payload) {
								return Object.assign({}, {checkpoint: payload.checkpoint}, newContext, {pending: false});
							});
							return newContext;
						}
					};
					return <Fragment>
						{(content && !attachToBottom) && content(provider)}
						{childProps.children(provider)}
						{(content && attachToBottom) && content(provider)}
					</Fragment>
				}
			}
			return null;
		}}
	</Hook>;
}


