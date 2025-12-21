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

import rAPIcore from "./requests";

export default class {
	constructor() {};

	static listing = {
		crossposts(article: string, params?: opts.DuplicatesListing) {
			return rAPIcore.listing<models.Submission>(`/duplicates/${article}.json`, {
				params,
				oauth: false,
			});
		},

		feed(subreddit?: string, sort?: rtypes.ListingSort, params?: opts.Listing) {
			let path = subreddit ? `/r/${subreddit}` : "";
			if (sort) path += `/${sort}`;
			return rAPIcore.listing<models.Submission>(path + ".json", { params, oauth: false });
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
		async page(subreddit: string, page: string, params?: {v: string, v2: string}) {
			return (await rAPIcore.get(
				`/r/${subreddit}/wiki/${page}.json`, { params, oauth: false }
			) as models.WikiPage).data;
		},

		async settings(subreddit: string, page: string) {
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
			payload: { page: string, permlevel: rtypes.WikiPermLevel; listed: boolean }
		) {
			return await rAPIcore.post(
				`/r/${subreddit}/wiki/settings/${page}.json`, payload, { oauth: false }
			) as models.POSTResponse<null>;
		},
	}
};