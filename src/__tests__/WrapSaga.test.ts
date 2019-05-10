import {WrapSaga} from "../src/wrapSagas";
import {CreateAction} from "../helpers";
import {OperationStatus} from "../src/ActStatus";

import sagaHelper from 'redux-saga-testing';

{
	const test = sagaHelper(
		WrapSaga({
			type: CreateAction('hello', 'world', OperationStatus.async),
			name: 'aryan',
			cookies: {auth: 'Bearer'},
			done: (err, result) => {
				console.log(result)
			}
		}, function* (p) {
			return {hello: true, world: '123'};
		})
	);
	test('--', () => {});
	test('succeed action', put => {
		const action = put.payload.action;
		expect(action).toEqual({
			type: 'hello.world.succeed',
			result: {hello: true, world: '123'},
			payload: {type: 'hello.world.async', name: 'aryan'},
			server: undefined
		})
	});

}
{
	const test = sagaHelper(
		WrapSaga({
			type: CreateAction('hello', 'world', OperationStatus.async),
			name: 'aryan',
			cookies: {auth: 'Bearer'},
			done: (err, result) => {
				console.log(result)
			}
		}, function* (p) {
			throw {hello: true, world: '123', auth: p.cookies.auth};
		})
	);
	test('--', () => {});
	test('failed action', put => {
		const action = put.payload.action;
		expect(action).toEqual({
			type: 'hello.world.failed',
			result: {hello: true, world: '123', auth: 'Bearer'},
			payload: {type: 'hello.world.async', name: 'aryan'},
			server: undefined
		})
	});

}
