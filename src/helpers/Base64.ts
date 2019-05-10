export let base64token: string = "JjmDBehPny8oL96N.GIbZ7kSlY5uaMQTitHFrVEf2s3UgqxvAR0OKp_-cXwWzd41C";

function v(a) {
	return String.fromCharCode(a)
}

function p(e) {
	let t = '', n, r;
	for (n = 0; n < e.length; n++) {
		r = e.charCodeAt(n);
		if (r < 128) {
			t += v(r)
		} else if (r > 127 && r < 2048) {
			t += v(r >> 6 | 192);
			t += v(r & 63 | 128)
		} else {
			t += v(r >> 12 | 224);
			t += v(r >> 6 & 63 | 128);
			t += v(r & 63 | 128)
		}
	}
	return t
}

function q(e) {
	let t = '', n = 0, r = 0, c3 = 0, c2 = 0;
	while (n < e.length) {
		r = e.charCodeAt(n);
		if (r < 128) {
			t += v(r);
			n++
		} else if (r > 191 && r < 224) {
			c2 = e.charCodeAt(n + 1);
			t += v((r & 31) << 6 | c2 & 63);
			n += 2
		} else {
			c2 = e.charCodeAt(n + 1);
			c3 = e.charCodeAt(n + 2);
			t += v((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
			n += 3
		}
	}
	return t
}

export class Base64 {

	static decode(e: string, pass = base64token): string {
		let t = '', s, o, u, a, f = 0;
		while (f < e.length) {
			s = pass.indexOf(e.charAt(f++));
			o = pass.indexOf(e.charAt(f++));
			u = pass.indexOf(e.charAt(f++));
			a = pass.indexOf(e.charAt(f++));

			t = t + v(s << 2 | o >> 4);
			if (u !== 64) {
				t = t + v((o & 15) << 4 | u >> 2)
			}
			if (a !== 64) {
				t = t + v((u & 3) << 6 | a)
			}
		}
		return q(t)
	}

	static encode(e: string, pass = base64token): string {
		let t = '', n, r, i, f = 0;
		e = p(e);
		while (f < e.length) {
			n = e.charCodeAt(f++);
			r = e.charCodeAt(f++);
			i = e.charCodeAt(f++);
			t += pass.charAt(n >> 2) + pass.charAt((n & 3) << 4 | r >> 4);
			if (isNaN(r)) {
				t += pass.charAt(64) + pass.charAt(64)
			} else if (isNaN(i)) {
				t += pass.charAt((r & 15) << 2 | i >> 6) + pass.charAt(64)
			} else {
				t += pass.charAt((r & 15) << 2 | i >> 6) + pass.charAt(i & 63)
			}
		}
		return t
	}

}
