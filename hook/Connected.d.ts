import React from "react";
export declare type ConnectedProps = {
    default?: any;
    project?: (state: any, props?: any) => any;
    children?: (state: any) => React.ReactElement;
};
export declare function Connected(props: ConnectedProps): React.ComponentElement<Pick<any, string | number | symbol> & ConnectedProps, React.Component<Pick<any, string | number | symbol> & ConnectedProps, any, any>>;
