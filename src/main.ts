import { rAPIcore, RedditAPIError } from "./requests";
import rAPI from "./client";
import * as util from "./util";
import * as logging from "./logging";

// Manual global assignment for the browser
(window as any).rAPIcore = rAPIcore;
(window as any).RedditAPIError = RedditAPIError;
(window as any).rAPI = rAPI;
(window as any).util = util;
(window as any).logging = logging;

// Keep exports so the bundler and type-checker can see them
export { rAPIcore, rAPI, util, logging, RedditAPIError };