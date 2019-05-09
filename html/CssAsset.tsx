import React from "react";
import {HtmlAsset} from "./HtmlAsset";

export class CssAsset implements HtmlAsset{
	src: string;
	version: string;

	constructor(src: string, version?: string){
		this.src = src;
		this.version = version || '1';
	}

	render = (key) => {
		return <link key={key} href={`${this.src}?${this.version}`} rel="stylesheet"/>
	};

}
