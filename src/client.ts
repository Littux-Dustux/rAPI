import { rAPIcore, RedditAPIError } from "./requests";
import { parseParams } from "./util";
import type { GQL, models, opts, rtypes } from "./globals";
import { getLogger, notify } from "./logging";
import { util } from "./main";

const logger = getLogger("client");

export default class rAPI {
	constructor() {};

	/**
	 * Fetches and aggregates listing children from a paginated API endpoint.
	 *
	 * @param path - The API endpoint URL to fetch the listing from.
	 * @param options - Additional options
	 * @param [options.params] - Optional query parameters for the API request.
	 *
	 * **NOTE**:
	 *
	 * - If you include the `after` parameter, items after that ID will be fetched immediately.
	 * - If you include `before`, it will fetch in the opposite order until the first listing item,
	 *  or until the `limit` is reached. The listings have to be collected first and yielded in the reverse order
	 *  to maintain the correct sequence, so it may use more memory and take longer.
	 * - When using `before` or `after`, if the specified ID doesn't exist in the listing, you'll get `400: Bad Request`
	 * @param [options.limit] - Max items to fetch. Default is unlimited.
	 * @yields Listing children one by one.
	 * @throws `TypeError` if the provided URL does not return a valid listing object, or `RedditAPIError` on API errors.
	 */
	static async *listingGenerator<T>(
		path: string | URL,
		{ params, oauth, limit, }:
		{ params?: [string, any][] | Record<string, any> | URLSearchParams; oauth?: boolean; limit?: number }
	): AsyncGenerator<T, void, unknown> {
		let url: URL, after: string, before: string;
		if (path instanceof URL) url = new URL(path);
		else url = new URL((oauth ? "https://oauth.reddit.com" : location.origin) + path);

		if (params) parseParams(params).forEach((par) => url.searchParams.set(par[0], par[1]));

		const listingChildrens: T[][] = [],
			goInReverse = Boolean(url.searchParams.get("before"));
		url.searchParams.set("limit", limit && limit < 100 ? limit.toString() : "100");
		url.searchParams.set("count", "200"); // so that `before` and `after` keys get set on the response

		logger.dbg(
			"Fetching listing " + url +
				(goInReverse
					? " in reverse from before=" + url.searchParams.get("before")
					: " from after=" + url.searchParams.get("after")) +
				" limit=" + limit
		);

		do {
			let listingObject: models.Listing<T> = await rAPIcore.get(url, { oauth });
			if (!listingObject?.kind || listingObject.kind != "Listing")
				throw TypeError(url + " is not a listing.");

			if (goInReverse) {
				before = listingObject.data.before;
				url.searchParams.set("before", before);

				// Only yield after we've fetched all children, to maintain order when going backwards.
				listingChildrens.push(listingObject.data.children);
			} else {
				after = listingObject.data.after;
				url.searchParams.set("after", after);

				yield* listingObject.data.children;
			}

			if (limit !== null) {
				limit -= listingObject.data.children.length;
				if (limit <= 0) {
					if (goInReverse) {
						// Yield children in reverse order
						for (const children of listingChildrens.reverse())
							yield* children;
					};
					break;
				} else if (limit < 100) url.searchParams.set("limit", limit.toString());
			}
		} while (after || before);
	}

	static listing = {
		crossposts(article: string, params?: opts.DuplicatesListing) {
			return rAPI.listingGenerator<models.Submission>(`/duplicates/${article}.json`, {
				params,
				oauth: false,
			});
		},

		feed(subreddit?: string, sort?: rtypes.ListingSort, params?: opts.Listing) {
			let path = subreddit ? `/r/${subreddit}` : "";
			if (sort) path += `/${sort}`;
			return rAPI.listingGenerator<models.Submission>(path + ".json", { params, oauth: false });
		},
	};

	/** Subreddit flair management */
	static flair = {
		async clearTemplates(subreddit: string, type: rtypes.Flair) {
			const data = await rAPIcore.post(
				`/r/${subreddit}/api/clearflairtemplates.json`,
				[["flair_type", type]],
				{ oauth: false }
			);
			return data as models.POSTResponse<null>;
		},

		/** Delete a user's flair on a subreddit */
		async deleteUser(subreddit: string, user: string) {
			return (await rAPIcore.post(`/r/${subreddit}/api/flair/deleteflair.json`, [["name", user]], {
				oauth: false,
			})) as models.POSTResponse<null>;
		},

		/**
		 * Set a user's flair or a submission's flair
		 *
		 * @param subreddit
		 * @param payload - Payload for request
		 * @param payload.css_class - CSS class for the flair
		 * @param payload.link - Submission ID to set flair on. `name` must be omitted if this is set
		 * @param payload.name - Username to set flair for. `link` must be omitted if this is set
		 * @param payload.text - Text for the flair
		 */
		async set(
			subreddit: string,
			payload: { css_class?: string; link?: string; name?: string; text?: string }
		) {
			return (await rAPIcore.post(`/r/${subreddit}/api/flair.json`, payload, {
				oauth: false,
			})) as models.POSTResponse<null>;
		},
	};

	/** Subreddit wiki management */
	static wiki = {
		async page(subreddit: string, page: string, params?: {v: string, v2: string}): Promise<models.WikiPageContent> {
			return (await rAPIcore.get(
				`/r/${subreddit}/wiki/${page}.json`, { params, oauth: false }
			) as models.WikiPage).data;
		},

		async settings(subreddit: string, page: string): Promise<models.WikiSettingsData> {
			return (await rAPIcore.get(`/r/${subreddit}/wiki/settings/${page}.json`, {
				oauth: false,
			}) as models.WikiSettings).data;
		},

		/**
		 * @param subreddit 
		 * @param payload
		 * @param payload.page - the name of an existing page or a new page to create
		 * @param payload.content - the content of the wiki page in markdown format
		 * @param payload.reason - the reason for the edit (shown in page history, max: 256 characters)
		 * @returns 
		 */
		async edit(subreddit: string, payload: { page: string, content: string; reason: string }) {
			return await rAPIcore.post(
				`/r/${subreddit}/api/wiki/edit.json`, payload, { oauth: false }
			) as models.POSTResponse<null>;
		},

		/**
		 * @param subreddit
		 * @param page - the name of an existing page or a new page to create
		 * @param payload
		 * @param payload.permlevel - the permission level for the wiki page
		 * @param payload.listed - whether the wiki page is listed in the sidebar
		 */
		async editPerm(
			subreddit: string, page: string,
			payload: { permlevel: rtypes.WikiPermLevel; listed: boolean }
		) {
			return await rAPIcore.post(
				`/r/${subreddit}/wiki/settings/${page}.json`, payload, { oauth: false }
			) as models.POSTResponse<null>;
		},
	};

	static retryModBulkErrors = new Set(["Service Unavailable", "Internal Server Error"]);
	static modaction = {
		async _bulkAction(
			action: "ModBulkRemove" | "ModBulkApprove" | "ModBulkIgnore" | "ModBulkUnignore",
			variables: { ids: string[], isSpam?: boolean }, batchSize = 25
		): Promise<string[]> {
			const failedIds: string[] = [];
			const batches = Array.from(util.batchIterator(variables.ids, batchSize));
			let currentBatch = 0;

			/* Batch size should be 100 or lower. Above that, the chances of Reddit not handling an ID increases.
			 You'll get r2 timeout errors above 25 or so IDs, after 6 seconds */
			for (const idsBatch of batches) {
				currentBatch++;
				notify.log("Doing action on batch "+currentBatch+"/"+batches.length);
				let tries = 0; variables.ids = idsBatch;
				while (tries < 3) {
					try {
						tries++; 
						const data = await rAPIcore.svcGql<"ModActionBulk">(action, {"input": variables});
						if (!Object.values(data.data)[0].ok) {
							logger.err(
								"Got error(s) while removing ids '"+idsBatch.join(",")+"': "+JSON.stringify(
									Object.values(data.data)[0].errors
								)
							);
							failedIds.push(...idsBatch);
						};
						break;
					} catch(error) {
						if (error instanceof RedditAPIError) {
							logger.wrn("Got error during batch removal: "+error);
							if (error.errMessages.has("r2 http request timeout")) {
								logger.inf("Not retrying due to r2 http timeout");
								break; // Don't retry as the action happened in the backend
							};
							for (const err of error.errors) {
								if (!rAPI.retryModBulkErrors.has(err.msg) && err.code !== "GQL_SYNTAX_ERROR") {
									if (error.errMessages.has("r2 http request timeout")) break // Don't retry as the action happened in the backend
									else {
										logger.err("Got non retryable error during bulk removal: "+err.toString());
										throw error;
									}
								} // else the request will be retried
							}
						} else throw error;
					};
					logger.inf("Sleeping 10 seconds before retrying due to error. (tries="+tries+", max=3)");
					await util.sleep(10e3);
				};
			};
			return failedIds;
		},

		bulkRemove(ids: string[], isSpam = false): Promise<string[]> {
			return rAPI.modaction._bulkAction("ModBulkRemove", { ids, isSpam });
		},

		bulkApprove(ids: string[]): Promise<string[]> {
			return rAPI.modaction._bulkAction("ModBulkApprove", { ids });
		},

		bulkIgnoreReports(ids: string[]): Promise<string[]> {
			return rAPI.modaction._bulkAction("ModBulkIgnore", { ids }, 50); // Action completes faster for some reason
		},

		bulkUnIgnoreReports(ids: string[]): Promise<string[]> {
			return rAPI.modaction._bulkAction("ModBulkUnignore", { ids }, 50); // Action completes faster for some reason, so larger batches can be safely used
		},
	}
};