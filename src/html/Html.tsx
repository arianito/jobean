import React from 'react';
import {HtmlAsset} from "./HtmlAsset";
import {Base64} from "../helpers";

export interface HtmlProps {
	id?: string,
	title: string,
	baseHref: string,
	head?: React.ReactNode,
	body?: React.ReactNode,
	direction?: 'ltr' | 'rtl',
	initialState?: any,
	productionAssets: Array<HtmlAsset>,
	developmentAssets: Array<HtmlAsset>,
	html?: string,
	children?: React.ReactNode,
}

function isProduction() {
	return process.env.NODE_ENV === 'production';
}

export function Html(props: HtmlProps) {
	const {title, head, body, direction, children, html, baseHref, productionAssets, developmentAssets, initialState, id = 'app'} = props;
	return <html dir={direction}>
	<head>
		<meta charSet="utf-8"/>
		<meta name="baseHref" content={baseHref}/>
		<title>{title}</title>
		{(isProduction() ? productionAssets : developmentAssets).map((a, i) => a.render(i))}
		{initialState && <script id="global-state" dangerouslySetInnerHTML={{
			__html: `window['BEAN'] = "${Base64.encode(JSON.stringify(initialState))}"`,
		}}/>}
		{head}
	</head>
	<body>
	<main id={id} dangerouslySetInnerHTML={html && {__html: html}}>{children}</main>
	{body}
	</body>
	</html>
}
