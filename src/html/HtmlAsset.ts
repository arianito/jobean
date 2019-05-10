import React from "react";

export interface HtmlAsset {
	src: string;
	version?: string;
	render: (key: any) => React.ReactNode;
}
