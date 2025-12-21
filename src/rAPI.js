/*
    Copyright (C) 2025  Littux-Dustux

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// Very old version

'use strict'

/**
 * Error from Reddit
 * @class RedditAPIError
 * @extends {Error}
 */
class RedditAPIError extends Error {
	/**
	 * Creates an instance of RedditAPIError.
	 * @param {String} message - Error message
	 * @param {Object} errResponse - Response object from Reddit
	 * @memberof RedditAPIError
	 * @property {Object} errResponse - Response object from Reddit. Falls back to {error: statusCode, message: statusCode} if valid JSON isn't returned by Reddit.
	 */
	constructor(message, errResponse) {
		let functionName;
		super(message);
		this.name = "RedditAPIError";
		this.errResponse = errResponse;
		try {
			functionName = this.stack.split("\n")[0].split("@")[0]
		} catch(e) {
			functionName = "???"
		};
		logger.error(message, functionName);
	}
};


/**
 * Fetch with retries on network errors
 *
 * @param {RequestInfo | URL} input
 * @param {RequestInit} init
 * @return {Promise<Response>} 
 */
async function fetchWithRetries(input, init) {
	let resp, sleepDuration = 1000;
	while (true) {
		try {
			resp = await fetch(input, init);
			break;
		} catch (e) {
			if (!(e instanceof TypeError)) throw e;
			if (sleepDuration <= 10000) sleepDuration *= 2;
			logger.warn(e+", retrying in "+sleepDuration+"ms", "fetchWithRetries");
			await sleep(sleepDuration);
		};
	}; return resp
};


const rAPI = {
	_time_next_req: 0,
	ratelimit_sleep: 500,

	async _rate_limit() {
		const time = Date.now();

		if (time < this._time_next_req) {
			const timeToSleep = Math.abs(this._time_next_req - time);
			this._time_next_req += this.ratelimit_sleep;

			return sleep(timeToSleep);
		} else {
			this._time_next_req = time + this.ratelimit_sleep;
		}
	},

	_oauth_token: null,
	_oauth_token_expires: 0,

	/**
	 * Get an Authorization header for requests needing it
	 *
	 * @return {string} 
	 */
	async getAuthBearer() {
		if (window?.___r?.session?.accessToken) {
			return "Bearer " + window?.___r?.session?.accessToken
		} else {
			if (Date.now() <= this._oauth_token_expires) {
				return this._oauth_token
			} else {
				let data = await fetch("/svc/shreddit/token", {
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					method: "POST",
					body: '{"csrf_token":"' +
						document.cookie
							.split("; ")
							.find((row) => row.startsWith("csrf_token="))
							?.split("=")[1] + '"}',
				}).then(resp => resp.json())

				this._oauth_token = data.token;
				this._oauth_token_expires = data.expires;
				return "Bearer " + data.token
			}
		}
	},

	modhash: null,
	_modhash_last_update: 0,

	/** @returns {string} */
	async getModhash() {
		if (window?.r?.config?.modhash) {
			this.modhash = r.config.modhash;
			this._modhash_last_update = Date.now();
			return r.config.modhash

		} else if (Date.now - this._modhash_last_update > 120e3) {
			this.modhash = await fetch("/api/me.json")
				.then(resp => resp.json())
				.then(jsonObject => jsonObject.data.modhash);
			this._modhash_last_update = Date.now();
			return this.modhash
		} else return this.modhash
	},


	/**
	 * Generic request
	 *
	 * @param {Object} args - Arguments
	 * @param {string} args.url - URL for the request
	 * @param {boolean} args.oauth - Whether or not to use OAuth authentication
	 * @param {"GET" | "POST" | "OPTIONS" | "HEAD" | "PATCH" | "DELETE"} [args.method="GET"] HTTP method
	 * @param {BodyInit} args.body - Request body
	 * @param {RequestInit} [fetchArgs={}] fetch() params
	 * @returns {Promise<Response>}
	 */
	async request({ url, oauth = false, method = "GET", body}, fetchArgs = { credentials: "same-origin" }) {
		method = method.toUpperCase();
		fetchArgs.method = method;

		if (!(method === "GET" || method === "HEAD")) {
			fetchArgs.body = body;

			if (!oauth) {
				fetchArgs.headers["X-Modhash"] = await this.getModhash()
			}
		};
		
		if (oauth) {
			fetchArgs.headers["Authorization"] = await this.getAuthBearer()
		};
		
		await this._rate_limit();
		return fetchWithRetries(url, fetchArgs);
	},

	/**
	 * Get JSON data from a Reddit endpoint
	 *
	 * @param {string} url
	 * @param {URLSearchParams} [params=""] URLSearchParams
	 * @param {Object} options - Additional options
	 * @param {boolean} [options.oauth=false] Whether or not to use OAuth for the request
	 * @returns {Promise<any>} response.json()
	 * @throws {RedditAPIError} on an API error
	 */
	async get(url, params = "", { oauth = false }) {
		await this._rate_limit();
		if (!url.endsWith(".json")) url += ".json";

		params = new URLSearchParams(params);
		params.set("raw_json", "1");
		url += "?" + params.toString();

		let resp = await this.request({ url: url, oauth: oauth });
		if (!resp.ok) {
			let respData;
			// Example error: "/r/reddit/about/modqueue.json?raw_json=1: 403: Forbidden"
			try {
				respData = await resp.json();
			} catch (e) {
				respData = {
					error: resp.status,
					message: resp.statusText,
				};
			}
			throw new RedditAPIError(url + ": " + resp.status + ": " + resp.statusText, respData);
		}
		logger.debug("GET " + url + " " + resp.status + "/" + resp.statusText, "rAPI.get");
		const jsonData = await resp.json();

		// Refresh modhash for POST requests
		if (jsonData?.data?.modhash) {
			this.modhash = jsonData.data.modhash;
			this._modhash_last_update = Date.now()
		};
		return jsonData;
	},


	/**
	 * Send a POST request to Reddit
	 *
	 * @param {string} url
	 * @param {BodyInit} payload
	 * @param {Object} options - Additional options
	 * @param {boolean} [options.oauth=false] Whether or not to use OAuth for the request
	 * @param {"form" | "json"} [options.contentType="form"]
	 * @param {number} [options.errorParseMaxSize=20000000] Max response size before error parsing is skipped (default: 20,000,000 bytes)
	 * @throws {Error} if json.errors exist in the response or on HTTP errors
	 * @returns {Promise<any>} response data
	 */
	async post(url, payload, { oauth = false, contentType = "form", errorParseMaxSize = 20e6 }) {
		const payloadTypes = {
			form: "application/x-www-form-urlencoded; charset=UTF-8",
			json: "application/json; charset=UTF-8"
		},
			stringifyPayload = () => contentType === "json" ? JSON.stringify(payload) : payload.toString();

		if (contentType === "json" && typeof payload === "object") {
			payload = JSON.stringify(payload);
			contentType = payloadTypes[contentType]

		} else if (contentType === "form" && typeof payload !== "string") {
			payload = new URLSearchParams(payload);
			payload.set("api_type", "json");
		};

		logger.debug(
			"POST "+url+" ("+contentType+"); payload : " +
			contentType === "json" ? JSON.stringify(payload) : payload.toString(),
			"rAPI.post"
		);
		
		await this._rate_limit();

		const resp = await this.request({ url: url, oauth: oauth, method: "POST", body: payload });
		let data = await resp.blob(), errText = "";

		if (!(
			data.type === "" ||
			data.type.startsWith("text/plain") ||
			data.type.startsWith("application/json")
		) && data.size > errorParseMaxSize) return data;

		const dataText = await data.text();

		try {
			data = JSON.parse(dataText)
		} catch(error) {
			logger.warn("Error parsing data as JSON: " + error, "rAPI.post")
		};

		// If data is an object parsed by `JSON.parse()`
		if (!data instanceof Blob) {
			if (resp.ok) {
				// "api_type: json" POST errors return HTTP 200 ok
				if (data?.json?.errors?.length) {
					let errorArray = data.json.errors;
					errText +=
						errorArray.length+
						" error(s) returned on POST to "+url+" with payload "+
						stringifyPayload();

					errorArray.forEach(error => {
						let [errCode, errMsg, errField] = error;
						errField = errField ? "field '" + errField + "'" : "unknown field";
						errText += "\n  " + errCode + " on " + errField + ": " + errMsg;
					});

					throw new RedditAPIError(errText, resp);
				};
			// Not resp.ok
			} else {
				// Regular JSON endpoint error
				if (data?.message && data?.error) {
					throw new RedditAPIError(
						'"' + JSON.stringify(data) + '" on POST to '+url+" with payload "+stringifyPayload(),
						resp
					);

				// GraphQL errors
				} else if (data?.errors && Array.isArray(data.errors) && errors.length && errors[0]?.message) {
					errText += errors.length + " errors occured on POST to "+url+" with payload "+stringifyPayload()+":";
					data.errors.forEach(error => {
						errText += "\n  "+error.message
					});
					throw new RedditAPIError(errText, resp)
				};
			}
		// if data isn't an object and the request wasn't ok
		} else if (!resp.ok) {
			if (dataText === "Internal Server Error") {
				let err = new RedditAPIError(
					"Got "+dataText+" for "+url+" with payload "+stringifyPayload(),
					resp
				);
				err.name = "InternalServerError";
				throw new err
			} else {
				throw new RedditAPIError(
					"Received data of type '"+data.type+"' with HTTP "+
					resp.status+"/"+resp.statusText+" for URL "+url+" with payload "+
					stringifyPayload()
				)
			}
		};

		return data
	},

	/**
	 * Fetches and aggregates listing children from a paginated API endpoint.
	 *
	 * @param {string} url - The API endpoint URL to fetch the listing from.
	 * @param {Object} options - Additional options
	 * @param {URLSearchParams} [options.params=null] - Optional query parameters for the API request.
	 *
	 * **NOTE**:
	 *
	 * - If you include the `after` parameter, items after that ID will be fetched. If you include `before`, it will fetch in the opposite order until the first listing item, or until the `limit` is reached.
	 * - When using `before` or `after`, if the specified ID doesn't exist in the listing, you'll get `400: Bad Request`
	 * @param {number} [options.limit=null] - Max items to fetch. Default is `null` which is unlimited.
	 * @param {Boolean} [options.alwaysThrowErrors=false] - Throw errors even if some pages fetched successfully. If `false` and an error occurs, the items that were fetched successfully will be returned.
	 * - If no items were fetched successfully, an error will always be thrown.
	 * @returns {Promise<Object[]>} A promise that resolves to an array of listing children objects.
	 * @throws {TypeError} If the provided URL does not return a valid listing object.
	 */
	async listing(url, { params = null, limit = null, alwaysThrowErrors = false }) {
		params = new URLSearchParams(params);
		let after,
			before,
			listingChildrens = [],
			goInReverse = Boolean(params.get("before"));
		params.set("limit", limit && Number(limit) < 100 ? Number(limit) : 100);
		params.set("count", "200"); // so that `before` and `after` keys get set on the responser

		logger.debug(JSON.stringify(arguments) + "; " + params.toString(), "rAPI.listing");
		do {
			let listingObject;

			try {
				listingObject = await this.get(url, params);
			} catch (error) {
				if (
					!alwaysThrowErrors &&
					error instanceof RedditAPIError &&
					error.errResponse.error === 400 &&
					listingChildrens.length !== 0
				) {
					logger.warn(
						"Error found but ignored as error code is 400, fetched " +
							listingChildrens.length +
							" items and alwaysThrowErrors = false",
						"rAPI.listing"
					);
					break;
				} else throw error;
			}

			if (listingObject.kind != "Listing") throw TypeError(url + " is not a listing.");

			if (goInReverse) {
				before = listingObject.data.before;
				params.set("before", before);
				// Prepend to listingChildrens to maintain order
				listingChildrens = listingObject.data.children.concat(listingChildrens);
			} else {
				after = listingObject.data.after;
				params.set("after", after);
				// Append to listingChildrens as we are going forwards
				listingChildrens = listingChildrens.concat(listingObject.data.children);
			}

			if (limit !== null) {
				limit -= listingObject.data.children.length;
				if (limit <= 0) break;
				else if (limit < 100) params.set("limit", limit);
			}
		} while (after || before);

		return listingChildrens;
	},

	_listing_cache: {},

	/**
	 * Get a listing with customizable caching per URL. There is a partial caching logic that works like this:
	 *
	 * If time since last cache update is greater than `partialCacheStartAge`, then only new listing items that may have appeared since the last fetch would be fetched, instead of the whole listing.
	 * This is done by setting the `before` parameter to the fullname of the latest item in the listing, and then fetching backwards, so that only new items are returned.
	 * If error 400 is returned, the whole cache is deleted and fetching is done again, as that error is likely because the `before` key points to an item that no longer exists.
	 *
	 * @param {string} url - Listing URL
	 * @param {Object} options - extra options
	 * @param {URLSearchParams} [options.params=null]
	 * @param {number} [options.partialCacheStartAge=120e3] Time in ms since cache was last updated before the partial caching strategy should be used.
	 * @param {number} [options.maxCacheAge=1800e3] Time since cache creation before the whole cache is discarded.
	 * @param {Object} [listingArgs={}] Extra arguments to pass to `listing()` (only used during full cache refresh)
	 * @return {Promise<Object[]>}
	 */
	async listingCached(
		url,
		{ params = null, partialCacheStartAge = 120e3, maxCacheAge = 1800e3 },
		listingArgs = {}
	) {
		params = new URLSearchParams(params);
		let listingChildrens,
			cachedEntry = this._listing_cache[url],
			currentTime = Date.now();

		// Load from scratch if no cache entry or the cache is older than maxCacheAge
		if (!cachedEntry || currentTime - cachedEntry["cached_on"] > maxCacheAge) {
			logger.debug("Creating cache for " + url);
			listingChildrens = await this.listing(url, { params: params, ...listingArgs });
			currentTime = Date.now();

			// logger.debug("listingChildrens: " + JSON.stringify(listingChildrens));

			if (listingChildrens.length !== 0) {
				this._listing_cache[url] = {
					cached_on: currentTime,
					last_fetch_on: currentTime,
					data: listingChildrens,
				};
			} else {
				this._listing_cache[url] = {
					cached_on: currentTime,
					last_fetch_on: null, // Disable partial caching as listing is empty so it would cause errors or be a waste.
					data: [],
				};
			}
			return listingChildrens;

			// If time since last fetch is greater than partialCacheStartAge,
			// try to fetch new listing items that may have appeared since last fetch using `before` parameter,
			// instead of returning the cache entry "as-is"
		} else if (
			cachedEntry["last_fetch_on"] !== null &&
			currentTime - cachedEntry["last_fetch_on"] > partialCacheStartAge
		) {
			try {
				params.set("before", cachedEntry.data[0].data.name);
				listingChildrens = await this.listing(url, { params: params });
				cachedEntry.last_fetch_on = Date.now();
				cachedEntry.data = listingChildrens.concat(cachedEntry.data);
				return cachedEntry.data;
			} catch (e) {
				if (e instanceof RedditAPIError && e.errResponse.error == "400") {
					logger.info("HTTP 400 response, removing cache for " + url, "rAPI.listingCached");
					delete this._listing_cache[url];
					return await this.cachedListing(...arguments);
				} else throw e;
			}
		} else {
			// No fetching as cache is still new
			logger.debug("returning cached entry for " + url, "rAPI.listingCached");
			return cachedEntry.data;
		}
	},

	/**
	 * Wrapper for /api/info. See https://www.reddit.com/dev/api#GET_api_info
	 *
	 * @param {*} fullnames - List of fullnames
	 * @returns {Promise<Object[]>} - Array of listing children objects
	 */
	async info(fullnames) {
		let listingChildrens = [];
		for (const batch of batchIterator(fullnames)) {
			const listingObject = await this.get(
				"/api/info.json",
				new URLSearchParams([["id", batch.toString()]])
			);

			listingChildrens = listingChildrens.concat(listingObject.data.children);
		}
		return listingChildrens;
	},
};


/*
const gqlAPI = {
	async request(payload) {
		payload["csrf_token"] = getCookie("csrf_token");
		resp = fetchWithRetries("")
	}
}

a = {
	id: "8a010c65298e",
	variables: {
		productSurface: "",
		sort: "new",
		filters: [
			{
				key: "nsfw",
				value: "1",
			},
		],
		pageSize: 100,
		query: "test",
	},
};
*/