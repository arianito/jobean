import {ParseCookies} from "../src/parseCookies";

test('test parse cookies parse simple cookie correctly' , () => {

	expect(ParseCookies('route=salam123;route=5567')).toEqual({route:5567});
	const cookie = ParseCookies('route=/hello,/,/dance');
	const paths = cookie['route'].split(',');
	expect(paths).toEqual(['/hello' , '/' , '/dance'])
});
