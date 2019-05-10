import React from "react";
import {connect} from "react-redux";
import {optional} from "../helpers";

export type ConnectedProps = {
	default?: any
	project?: (state: any, props?: any) => any
	children?: (state: any) => React.ReactElement,
};

export function Connected(props: ConnectedProps) {
	return React.createElement(connect<{}, {}, ConnectedProps>((s, p) => ({value: optional(() => props.project(s, p), props.default)}))(function (state: any) {
		return props.children(state.value);
	}))
}
