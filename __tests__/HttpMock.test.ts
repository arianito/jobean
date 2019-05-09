import {Lucid} from "../http/Lucid";
import {MockedHttpRoute} from "../http/MockedHttpRoute";
import {HttpMethod} from "../http/HttpMethod";

test('test mock store work correctly', async (done) => {
	Lucid.config(Lucid.CreateMockDriver());

	Lucid.RegisterMock('chunkA', [
		<MockedHttpRoute<{}>>{
			path: {
				path: '/home/:hello',
				exact: true,
			},
			method: HttpMethod.post,
			handler:(request, response) => {

				response(request.context.match.params.hello).setStatus(200);
			}
		},
	]);
	const result = await Lucid.Fetch({url: '/home/123', method: HttpMethod.post});

	expect(result.payload).toBe('123');

	done();
});
