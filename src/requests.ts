import { AuthToken, RateLimiter, sleep, getCookiePing, parseParams, capitalize, getJWTexpiry, getCookie } from "./util";
import { getLogger } from "./logging";
import type { rtypes, models, GQL } from "./globals";

const logger = getLogger("requests");

/**
 * Fetch with retries on network errors
 *
 * @param {RequestInfo | URL} input
 * @param {RequestInit} init
 * @return {Promise<Response>}
 */
async function fetchWithRetries(input: RequestInfo | URL, init: RequestInit) {
	let resp: Response,
		sleepDuration = 1000;
	while (true) {
		if ((window as any).__rAPIkill) throw new Error("rAPI killswitch activated");
		try { resp = await fetch(input, init); break;
		} catch (err) {
			if (!(err instanceof TypeError)) throw err;
			if (sleepDuration <= 10000) sleepDuration *= 2; else throw err;
			logger.wrn(err + " during fetch, retrying in " + sleepDuration + "ms");
			await sleep(sleepDuration);
		}
	}; return resp;
}

export class RedditError {
	public code: rtypes.ErrorCode | number;
	public msg: string;
	public field?: string;

	/**
	 * Creates an instance of RedditError.
	 * @param {number | rtypes.ErrorCode} code
	 * @param {string} msg
	 * @param {string} [field]
	 */
	constructor(code: rtypes.ErrorCode | number, msg: string, field?: string) {
		this.code = code;
		this.msg = msg;
		if (field) this.field = field;
	};

	/** Return the formatted string of the error. */
	toString(): string {
		return this.code+': "'+this.msg+(this.field ? '" on field "'+this.field+'"' : '"');
	}
};


/** Errors from Reddit */
export class RedditAPIError extends Error {
	public readonly errors: RedditError[] = [];
	public readonly errCodes: Set<rtypes.ErrorCode | number>;
	public readonly errMessages: Set<string>;

	hasErrCode(code: rtypes.ErrorCode | number): boolean {
		return this.errCodes.has(code);
	};

	get error() { return this.errors[0] };

	/**
	 * Creates an instance of RedditAPIError.
	 * @param {Object} errors - An array in the format [code, error] or an array containing arrays in format [code, msg] or [code, msg, field]
	*/
	constructor(errors: [number, string] | [number | rtypes.ErrorCode, string][] | [rtypes.ErrorCode, string, string][] | RedditError[]) {
		if (!Array.isArray(errors[0]) && !(errors[0] instanceof RedditError)) {
			errors = [errors as [number, string]]
		};
		errors = errors.map((error) => {
			if (error instanceof RedditError) return error
			else if (error.length === 2) return new RedditError(error[0], error[1])
			else if (error.length === 3) return new RedditError(error[0], error[1], error[2])
			else throw new TypeError("Unknown error: "+JSON.stringify(error));
		});

		super(
			errors.map(error => error.toString()).join("\n")
		);
		this.name = "RedditAPIError";
		this.errors = errors;
		this.errCodes = new Set(this.errors.map(e => e.code));
		this.errMessages = new Set(this.errors.map(e => e.msg));
	}
};

export class rAPIcore {
	constructor() {}

	static ratelimitRegex = /([0-9]{1,3}) (milliseconds?|seconds?|minutes?)/;
	static GETerrorMap = {
		gold_only: "that subreddit needs an active reddit premium subscription",
		banned: "that subreddit was banned",
		private: "that subreddit is private",
		quarantined: "that subreddit is quarantined and requires you to opt-in",
		gated: "that subreddit contains content pertaining to drug use and abuse, and requires you to opt-in",
		PAGE_NOT_CREATED: "that page has not been created yet",
		MAY_NOT_VIEW: "you're not allowed to view that page",
	};

	static readonly modhash = new AuthToken(async () => {
		if (location.host === "sh.reddit.com")
			throw new TypeError("modhash unavailable on sh.reddit.com");
		// Try to get modhash from global variable
		const modhashExpiry = Date.now() + 7200e3;
		if ((window as any)?.r?.config?.modhash)
			return [(window as any).r.config.modhash, modhashExpiry];
		return [
			await fetch("/api/me.json")
				.then((r) => r.json())
				.then((j) => j.data.modhash),
			modhashExpiry,
		];
	});

	static readonly accessToken = new AuthToken(async () => {
		// mod.reddit.com or new.reddit.com (RIP)
		if (
			(window as any)?.___r?.session?.accessToken &&
			(window as any).___r.session?.expires > Date.now()
		)
			return [(window as any).___r.session.accessToken, (window as any).___r.session.expires];

		let token: string | null = localStorage.getItem("rAPI:accessToken");
		let expiry: number = parseInt(localStorage.getItem("rAPI:accessTokenExpiry"));

		if (token && expiry > Date.now()) {
			logger.dbg("Using previously cached access token from localStorage");
			return [token, expiry];
		} else {
			token = expiry = null;
			localStorage.removeItem("rAPI:accessToken");
			localStorage.removeItem("rAPI:accessTokenExpiry");
			logger.dbg("No valid access token in localStorage. Deleted cached token.");
		};

		if (location.host === "www.reddit.com" || location.host === "sh.reddit.com") {
			let csrf_token = await getCookiePing("csrf_token", "https://sh.reddit.com/404");
			await fetch("/svc/shreddit/token", {
				headers: { "Content-Type": "application/json" },
				method: "POST",
				body: '{"csrf_token":"' + csrf_token + '"}',
			})
			.then((resp) => resp.text())
			.then((text) => {
				const data: { token: string, expires: number } = JSON.parse(text);
				logger.dbg("Got data from /svc/shreddit/token, token expires at " + new Date(data.expires).toString());
				(token = data.token), (expiry = data.expires);
			});
		};

		// Fallback to "token" cookie
		if (!token) {
			logger.dbg("Falling back to 'token' cookie for access token");
			const rssgToken = JSON.parse(
				atob((await getCookiePing("token", "https://mod.reddit.com/404")).split(".")[0])
			);
			token = rssgToken.accessToken;
			expiry = rssgToken.expires;
		};

		localStorage.setItem("rAPI:accessToken", token);
		localStorage.setItem("rAPI:accessTokenExpiry", expiry.toString());

		return [token, expiry]
	});

	static readonly matrixAccessToken = new AuthToken(async () => {
		// Try and use the existing token set by chat.reddit.com
		const tokenData: {token: string, expires: number} = JSON.parse(localStorage.getItem("chat:access-token"));
		if (tokenData && tokenData.expires > Date.now()) {
			logger.dbg("Using previously cached Matrix access token from localStorage");
			return [tokenData.token, tokenData.expires]
		};

		// Login to matrix.redditspace.com with flow "com.reddit.token"
		logger.dbg("Fetching new Matrix access token from matrix.redditspace.com");
		const payload = {
				type: "com.reddit.token",
				token: await this.accessToken.get(),
				initial_device_display_name: "Reddit Web Client",
			},
			deviceId = JSON.parse(localStorage.getItem("chat:matrix-device-id"));

		if (deviceId) payload["device_id"] = deviceId;

		const data = await fetch("https://matrix.redditspace.com/_matrix/client/v3/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}).then((r) => r.json());

		if (data?.errcode)
			throw new TypeError(
				"Error logging into Matrix with Reddit token: " + data.errcode + ": " + data.error
			);

		if (data.device_id)
			localStorage.setItem("chat:matrix-device-id", JSON.stringify(data.device_id));

		const tokenExpiry = getJWTexpiry(data.access_token);
		localStorage.setItem("chat:matrix-access-token", JSON.stringify(data.access_token));
		localStorage.setItem("chat:access-token", JSON.stringify({
			token: data.access_token,
			expires: tokenExpiry,
		}));
		logger.dbg("Got matrix access token, expires at "+new Date(tokenExpiry).toString());

		return [data.access_token, tokenExpiry];
	});

	private static ratelimiter = new RateLimiter(1000, 100);

	/**
	 * Generic request
	 *
	 * @param args - Arguments
	 * @param args.url - URL for the request
	 * @param args.oauth - Whether or not to use OAuth authentication
	 * @param [args.method="GET"] HTTP method
	 * @param args.body - Request body
	 * @param [requestInit={}] fetch() params
	 */
	static async request(
		{
			url, oauth = false, method = "GET",
			body, json, requestInit = {},
			ratelimit = false,
		}: {
			url: URL | string;
			oauth?: boolean;
			body?: BodyInit;
			json?: Object;
			requestInit?: RequestInit;
			ratelimit?: boolean;
			method?: "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "TRACE";
		}
	): Promise<Response> {
		requestInit.credentials = "same-origin";
		requestInit.method = method;

		if (!requestInit.headers)
			requestInit.headers = new Headers()
		else if (!(requestInit.headers instanceof Headers))
			requestInit.headers = new Headers(requestInit.headers);

		if (!(method === "GET" || method === "HEAD")) {
			if (json) {
				requestInit.headers.set("content-type", "application/json");
				requestInit.body = JSON.stringify(json);
			} else if (body) {
				requestInit.body = body;
			} else
				throw new TypeError(
					"either body or json parameters must be provided for non HEAD/GET requests"
				);

			if (!oauth) requestInit.headers.set("x-modhash", await this.modhash.get());
		}

		if (oauth) requestInit.headers.set(
			"authorization", "Bearer " + (await this.accessToken.get())
		);
		if (ratelimit) await this.ratelimiter.wait();

		return fetchWithRetries(url, requestInit);
	}

	/**
	 * Get JSON data from a Reddit endpoint
	 *
	 * @param path - Relative URL or a URL object
	 * @param options - Additional options
	 * @param options.params - Array of URL search params in format [key, value]
	 * @param options.oauth - Whether or not to use OAuth for the request (default: no)
	 * @throws {RedditAPIError} on an API error
	 */
	static async get(
		path: URL | string,
		{ params, oauth }: { params?: [string, any][] | Record<string, any>; oauth?: boolean }
	): Promise<any> {
		if (location.host === "sh.reddit.com") oauth = true; // As legacy API doesn't work on sh.reddit.com

		let url =
			path instanceof URL
				? new URL(path)
				: new URL((oauth ? "https://oauth.reddit.com" : location.origin) + path);

		if (params) parseParams(params).forEach((par) => url.searchParams.set(par[0], par[1]));

		if (!oauth && !url.pathname.endsWith(".json")) url.pathname += ".json";
		url.searchParams.set("raw_json", "1");

		const resp = await this.request({ url, oauth });
		const blob = await resp.blob();
		const contentType = resp.headers.get("content-type") || "";
		if (!(contentType.startsWith("application/json")
			|| contentType.startsWith("text/plain"))
		) {
			logger.dbg(
				"Not parsing response data from " + url + " as data is of type " +
					contentType + " and not JSON."
			);
			return blob;
		}

		let jsonData: models.ErrorResponse;
		const respText = await blob.text();
		try {
			jsonData = JSON.parse(respText);
		} catch (e) {
			throw new TypeError(
				"Error parsing JSON response from " + url + ": " + e + "\n" + "Response data: " + respText
			);
		}

		if (!resp.ok) {
			if (typeof jsonData === "object") {
				let errors: RedditError[] = [];
				errors.push(new RedditError(
					(jsonData?.error) ? jsonData.error : resp.status,
					(jsonData?.message) ? jsonData.message : resp.statusText
				));

				if (jsonData?.reason) {
					let explanation = jsonData?.explanation;
					explanation ??= this.GETerrorMap[jsonData.reason];
					if (explanation) {
						errors.push(new RedditError(jsonData.reason as rtypes.ErrorCode, explanation));
					} else {
						errors.push(
							new RedditError(
								jsonData.reason as rtypes.ErrorCode, capitalize(jsonData.reason.replaceAll("_", " "))
							)
						);
					};
				};
				throw new RedditAPIError(errors);
			} else throw new RedditAPIError([resp.status, resp.statusText]);
		}

		return jsonData as any;
	}

	/**
	 * Send a POST request to Reddit
	 *
	 * @param {string} url
	 * @param {BodyInit} payload
	 * @param {Object} options - Additional options
	 * @param {boolean} [options.oauth=false] Whether or not to use OAuth for the request (default: no)
	 * @param {number} [options.errorParseMaxSize=20000000] Max response size before error parsing is skipped (default: 20,000,000 bytes)
	 * @throws {Error} if json.errors exist in the response or on HTTP errors
	 * @returns {Promise<any>} response data
	 */
	static async post(
		url: string,
		payload: [string, any][] | Record<string, any> | URLSearchParams,
		{ oauth = false, errorParseMaxSize = 20e6 }: { oauth?: boolean; errorParseMaxSize?: number }
	): Promise<any> {
		if (location.host === "sh.reddit.com") oauth = true; // As legacy API doesn't work on sh.reddit.com

		let body = new URLSearchParams(
			(payload instanceof URLSearchParams) ? payload : parseParams(payload)
		);
		body.set("api_type", "json");

		await this.ratelimiter.wait();

		const resp = await this.request({ url, oauth, method: "POST", body });
		let blob = await resp.blob(),
			data: models.POSTResponse<any>;

		if (!(blob.type === ""
			|| blob.type.startsWith("text/plain")
			|| blob.type.startsWith("application/json")
			) || blob.size > errorParseMaxSize
		) {
			logger.dbg(
				"Not parsing errors of POST request as response size ("+blob.size+") is greater than max ("+errorParseMaxSize+"), or response isn't plain text or JSON."
			);
			return blob;
		}

		const dataText = await blob.text();

		try {
			data = JSON.parse(dataText);
		} catch (error) {
			logger.wrn(
				"Error parsing POST response data ("+blob.type+") from "+url+" as JSON: " + error
			);
		}

		// If data is an object parsed by `JSON.parse()`
		if (data) {
			if (resp.ok) {
				// "api_type: json" POST errors return HTTP 200 ok
				if (data?.json?.errors?.length) {
					const apiError = new RedditAPIError(data.json.errors);
					for (const err of apiError.errors) {
						if (err.code === "RATELIMIT") {
							// Same logic as in PRAW
							logger.wrn("Got ratelimit: " + err.toString());
							const match = this.ratelimitRegex.exec(err.msg);
							if (!match) break;

							let milliseconds = parseInt(match[1]) * 1000;
							if (match[2].startsWith("minute")) milliseconds *= 60e3;
							else if (match[2].startsWith("millisecond")) milliseconds = 0;

							milliseconds += 1000;
							logger.inf("Sleeping for " + milliseconds + "ms due to ratelimit");
							await sleep(milliseconds);
							return this.post(url, payload, { oauth, errorParseMaxSize });
						}
					}
					throw apiError;
				}
				// Not resp.ok
			} else if (data?.message && data?.error) {
				const errors: RedditError[] = [];
				errors.push(new RedditError(data.error, data.message));
				if (data?.reason && data?.explanation)
					errors.push(new RedditError(data.reason as rtypes.ErrorCode, data.explanation));
				throw new RedditAPIError(errors);
			}
			// if data isn't an object and the request wasn't ok
		} else if (!resp.ok && dataText === "Internal Server Error") {
			throw new RedditAPIError([resp.status, "Internal Server Error"]);
		}
		return data;
	};

	/** GraphQL error messages with Status Code */
	static gqlStatusCodeRegex = /^(\d+) : (.*)/;

	static async gql<K extends keyof GQL.ResponseDataMap>(
		operationName: string, sha256Hash: string, variables = {}
	): Promise<GQL.Response<K>> {
		const resp = await this.request({
			"url": "https://gql-fed.reddit.com", "method": "POST",
			"json": {
				operationName, variables,
				"extensions": {
					"persistedQuery": { sha256Hash, "version": 1 }
				}
			}, "oauth": true, "ratelimit": false
		});

		const blob = await resp.blob();
		const blobText = await blob.text();
		let data: GQL.Response<K>;
		try {
			data = JSON.parse(blobText);
		} catch(err) {
			if (resp.ok) throw TypeError("Error parsing GraphQL response as JSON: "+err+"\nResponse: "+blobText)
			else throw new RedditAPIError([resp.status, blobText]);
		};

		if (data.errors) {
			const errors: RedditError[] = [];
			if (!resp.ok) errors.push(new RedditError(resp.status, resp.statusText));
			data.errors.forEach(err => {
				if (err.path) {
					const statusFromMessage = this.gqlStatusCodeRegex.exec(err.message);
					if (statusFromMessage)
						errors.push(
							new RedditError(
								parseInt(statusFromMessage[1]),
								statusFromMessage[2],
								err.path.map(str => JSON.stringify(str)).join(" => ")
							)
						)
					else
						errors.push(
							new RedditError(
								"GQL_ERROR", err.message,
								err.path.map(str => JSON.stringify(str)).join(" => ")
							)
						);
				};
			});
			throw new RedditAPIError(errors);
		};

		return data;
	};

	static async svcGql<K extends keyof GQL.ResponseDataMap>(
		operation: string, variables = {}
	): Promise<GQL.SVCResponse<K>> {
		if (!(location.host === "sh.reddit.com" || location.host === "www.reddit.com"))
			throw new TypeError("SVC GraphQL unsupported on "+location.host);

		const resp = await this.request({
			"url": "/svc/shreddit/graphql", "method": "POST",
			"json": { operation, variables, "csrf_token": getCookie("csrf_token") },
			"oauth": false, "ratelimit": false
		});
		const blobText = await (await resp.blob()).text(), errors: RedditError[] = [];

		if (!resp.ok) {
			if (resp.status === 400)
				throw new TypeError("Bad CSRF token for shreddit svc graphql: recieved 400 response with '"+blobText+"'")
			else if (resp.status === 500)
				throw new RedditAPIError([["GQL_SYNTAX_ERROR", blobText, "variables"]])
			else errors.push(new RedditError(resp.status, blobText));
		};

		let data: GQL.SVCResponse<K> = JSON.parse(blobText);
		if (data.errors) {
			data.errors.forEach(err => {
				if (err.path) {
					const statusFromMessage = this.gqlStatusCodeRegex.exec(err.message);
					if (statusFromMessage)
						errors.push(
							new RedditError(
								parseInt(statusFromMessage[1]),
								statusFromMessage[2],
								err.path.map(str => JSON.stringify(str)).join(" => ")
							)
						)
					else
						errors.push(
							new RedditError(
								"GQL_ERROR", err.message,
								err.path.map(str => JSON.stringify(str)).join(" => ")
							)
						);
				} else errors.push(
					// it will return 500 status instead. this won't actually happen
					new RedditError("GQL_SYNTAX_ERROR", err.message, "variables")
				);
			});
		};

		if (errors.length) throw new RedditAPIError(errors)
		else return data;
	};
};