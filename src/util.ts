/* === Auth token tools === */
export const getJWTexpiry = (token: string): number => {	
	// Split JWT token into 3 parts, decode the second base64 part, parse as JSON, and get the "exp" value.
	try {
		const tokenParts = token.split(".");
		if (tokenParts.length !== 3) throw new TypeError("Invalid JWT token format: does not have 3 parts");

		const parsedToken = JSON.parse(atob(tokenParts[1]));
		if (!parsedToken.exp) throw new TypeError("Invalid JWT token format: missing 'exp' field");

		// To convert to milliseconds
		return parsedToken.exp * 1000;
	} catch(err) {
		throw new TypeError("Error while getting token expiry time: " + err);
	}
};

export class AuthToken {
	private _token: string;
	private refreshFunc: Function;
	expires_on: number = 0;

	/**
	 * Creates an instance of AuthToken.
	 * @param tokenUpdateFunc - function that returns a new token. Should return an array in format [token, expires_on (ms)]
	 * @memberof AuthToken
	 */
	constructor(tokenUpdateFunc: () => Promise<[string, number]>) {
		this.refreshFunc = tokenUpdateFunc;
	}

	/**
	 * Get an Authentication token. If expired, gets a new token with refreshFunc specified during class init. Otherwise, returns the cached token.
	 *
	 * @return {Promise<string>}
	 * @memberof AuthToken
	 */
	async get(): Promise<string> {
		if (Date.now() > this.expires_on - 60) await this.refresh();
		return this._token;
	};

	/**
	 * Force refresh the token using the refreshFunc specified during class init.
	 *
	 * @return {Promise<void>}
	 * @memberof AuthToken
	 */
	async refresh(): Promise<void> {
		[this._token, this.expires_on] = (await this.refreshFunc()) || [null, 0];
		if (!this._token)
			throw new TypeError("Failed getting token with function: " + this.refreshFunc.toString());
		this.expires_on ??= getJWTexpiry(this._token);
		if (Date.now() > this.expires_on)
			throw new TypeError(
				`Token generated at ${new Date().toISOString()} expired on ${new Date(
					this.expires_on
				).toISOString()}`
			);
	}
};



/* === API related === */

/**
 * @example
 * ```js
 * const limiter = new RateLimiter(1000); // 1000ms between calls
 * for (const post of posts) {
 *   await limiter.wait();
 *   post.like()
 * }
 * ```
 * @export
 * @class RateLimiter
 */
export class RateLimiter {
    private _time_next_req = 0;
    private ratelimit_sleep: number;
	private offset: number;

	/**
	 * Creates an instance of RateLimiter.
	 * @param {number} [sleepDur=500] Time between actions (default: 500ms)
	 * @param {number} [offset=50] Adjust the min/max random offset added between sleep (default: 50ms)
	 * @memberof RateLimiter
	 */
	constructor(sleepDur = 500, offset = 50) {
        this.ratelimit_sleep = sleepDur, this.offset = offset
    };

	async wait(): Promise<number | undefined> {
		const time = Date.now();

		if (time < this._time_next_req) {
			let timeToSleep = Math.max(
				0, (this._time_next_req - time) + (Math.floor(Math.random() * (this.offset * 2 + 1)) - this.offset)
			);
			this._time_next_req += this.ratelimit_sleep;

			return sleep(timeToSleep);
		} else this._time_next_req = time + this.ratelimit_sleep;
	};
};


/** "ping" a URL to get its cookies by pretending to fetch an image */
const pingURL = (url: string) => {
	return new Promise<void>((resolve) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => resolve();

		// Attach source with cache-buster
		img.src = url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
	});
};

export const getCookie = (name: string): string | null => {
	const value = "; "+document.cookie;
	const parts = value.split("; "+name+"=");
	if (parts.length === 2) return parts.pop().split(';').shift() || null;
	return null;
};

/**
 * Try to get a cookie, pinging the provided URL if cookie isn't found
 *
 * @param name - Name of the cookie
 * @param pingSrc - URL to get the cookies from. This URL is "pinged" if the cookie isn't found,
 * to trigger `Set-Cookie` headers, and hopefully get the cookie
 * @throws {Error} if the cookie isn't found even after pinging the URL
 */
export const getCookiePing = async (name: string, pingSrc: string): Promise<string> => {
	let cookieData = getCookie(name);
	if (!cookieData) {
		await pingURL(pingSrc);
		cookieData = getCookie(name);
		if (!cookieData) throw new Error("Failed getting cookie '" + name + "' by fetching " + pingSrc);
	}
	return cookieData;
};

/* === Generic === */
export const sleep = async (timeToSleep: number): Promise<number> => {
	return new Promise((resolve) => setTimeout(resolve, timeToSleep, ()=>{timeToSleep}));
};

/**
 * A generator function that yields batches of a given array.
 * @param {Array<any>} array The large array to iterate over.
 * @param {number} [batchSize=100] The maximum size of each batch. Defaults to 100.
 * @yields {Array<any>} A batch (subarray) of the original array.
 */
export function* batchIterator<T>(array: T[], batchSize = 100): Generator<T[]> {
	if (!Array.isArray(array)) throw new TypeError('Expected an array');

	// Iterate through the array in steps equal to the batch size
	for (let i = 0; i < array.length; i += batchSize) {
		// Use Array.prototype.slice() to get the subarray for the current batch
		yield array.slice(i, i + batchSize);
	}
};

const parseFormVal = (val: any): string => {
	if (typeof val === "boolean") return val ? "1" : "0";
	else if (Array.isArray(val)) return val.join(",");
	else if (typeof val === "object") return JSON.stringify(val);
	else return val.toString();
};

export const parseParams = (data: Record<string, any> | [string, any][]): [string, string][] => {
	if (data instanceof URLSearchParams) return Array.from(data.entries());
	const params: [string, string][] = [];
	
	(Array.isArray(data) ? data : Object.entries(data)).forEach(([k, v]) => {
		if (v) params.push([k, parseFormVal(v)]);
	});
	return params;
};


export const capitalize = (str: string): string => {
	if (!str) return ""; // Handle empty strings
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};