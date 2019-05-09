test('test memory router middleware modify cookie string correctly', () => {

	const route = '/hello|/id|/dance';
	const paths = route.split('|');
	if(paths.length >= 3) {
		paths.splice(0, 1);
	}
	paths.push('/fine/ok?hello=23');
	const output = paths.join('|');
	expect(output).toEqual('/id|/dance|/fine/ok?hello=23')

});

test('test route cookie string have more than one route', () => {

	const route = '/hello';
	const paths = route.split('|');
	if(paths.length >= 3) {
		paths.splice(0, 1);
	}
	paths.push('/fine/ok?hello=23');
	const output = paths.join('|');
	expect(output).toEqual('/hello|/fine/ok?hello=23')

});
