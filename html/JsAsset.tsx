import React from "react";

import {HtmlAsset} from "./HtmlAsset";

export class JsAsset implements HtmlAsset {

	src: string;
	version: string;
	defer: boolean;
	crossOrigin: boolean;

	constructor(src, version?: string, defer?, crossOrigin?) {
		this.src = src;
		this.version = version || '1';
		this.defer = defer;
		this.crossOrigin = crossOrigin;
	}

	render = (key) => {
		return <script key={key} src={`${this.src}?${this.version}`}
					   crossOrigin={this.crossOrigin ? "anonymous" : undefined}
					   defer={this.defer}/>
	};

}
