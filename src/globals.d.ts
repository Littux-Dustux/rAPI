export namespace rtypes {
	/**
	code | message
	:- | :-
	`ADMIN_REQUIRED` | you must be in admin mode for this
	`ALREADY_MODERATOR` | that user is already a moderator
	`ALREADY_SUB` | that link has already been submitted
	`BAD_ADDRESS` | address problem: %(message)s
	`BAD_BID` | your bid must be at least $%(min)s and no more than $%(max)s.
	`BAD_BUDGET` | your budget must be at least $%(min)d and no more than $%(max)d.
	`BAD_CAPTCHA` | care to try these again?
	`BAD_CARD` | card problem: %(message)s
	`BAD_CNAME` | that domain isn't going to work
	`BAD_COLOR` | invalid color
	`BAD_CSS` | invalid css
	`BAD_CSS_NAME` | invalid css name
	`BAD_DATE` | please provide a date of the form mm/dd/yyyy
	`BAD_DATE_RANGE` | the dates need to be in order and not identical
	`BAD_EMAIL` | that email is invalid
	`BAD_EMAILS` | the following emails are invalid: %(emails)s
	`BAD_FLAIR_TARGET` | not a valid flair target
	`BAD_IMAGE` | image problem
	`BAD_JSONP_CALLBACK` | that jsonp callback contains invalid characters
	`BAD_MULTI_NAME` | %(reason)s
	`BAD_MULTI_PATH` | invalid multi path
	`BAD_NUMBER` | that number isn't in the right range (%(range)s)
	`BAD_PASSWORD` | that password is unacceptable
	`BAD_PASSWORD_MATCH` | passwords do not match
	`BAD_PROMO_MOBILE_DEVICE` | you must select at least one device per OS to target
	`BAD_PROMO_MOBILE_OS` | you must select at least one mobile OS to target
	`BAD_REVISION` | invalid revision ID
	`BAD_SR_NAME` | that name isn't going to work
	`BAD_STRING` | you used a character here that we can't handle
	`BAD_URL` | you should check that url
	`BAD_USERNAME` | invalid user name
	`BANNED_FROM_SUBREDDIT` | that user is banned from the subreddit
	`BANNED_IP` | IP banned
	`BUDGET_LIVE` | you cannot edit the budget of a live ad
	`CANT_CONVERT_TO_GOLD_ONLY` | to convert an existing subreddit to gold only, send a message to %(admin_modmail)s
	`CANT_CREATE_SR` | your account is too new or you do not have enough karma to create a subreddit. please contact the admins to request an exemption.
	`CANT_REPLY` | [*add message here*]
	`CANT_RESTRICT_MODERATOR` | You can't perform that action because that user is a moderator.
	`CLAIMED_CODE` | that code has already been claimed -- perhaps by you?
	`COLLECTION_NOEXIST` | that collection doesn't exist
	`COMMENTER_BLOCKED_PARENT_COMMENTER` | [*add message here*]
	`COMMENTER_BLOCKED_POSTER` | [*add message here*]
	`COMMENT_GUIDANCE_VALIDATION_FAILED` | [*add message here*]
	`COMMENT_NOT_ACCESSIBLE` | Cannot access this comment.
	`COMMENT_NOT_STICKYABLE` | This comment is not stickyable. Ensure that it is a top level comment.
	`CONFIRM` | please confirm the form
	`CONFLICT` | conflict error while saving
	`COST_BASIS_CANNOT_CHANGE` | this campaign was created prior to auction and cannot be edited
	`DATE_TOO_EARLY` | please enter a date %(day)s or later
	`DATE_TOO_LATE` | please enter a date %(day)s or earlier
	`DELETED_COMMENT` | that comment has been deleted
	`DELETED_THING` | that element has been deleted
	`DEVELOPER_ALREADY_ADDED` | already added
	`DEVELOPER_FIRST_PARTY_APP` | this app can not be modified from this interface
	`DEVELOPER_PRIVILEGED_ACCOUNT` | you cannot add this account from this interface
	`DOMAIN_BANNED` | %(domain)s is not allowed on reddit: %(reason)s
	`DRACONIAN` | you must accept the terms first
	`EXPIRED` | your session has expired
	`FREQUENCY_CAP_TOO_LOW` | frequency cap must be at least %(min)d
	`gated` | that subreddit contains content pertaining to drug use and abuse, and requires you to opt-in
	`GILDING_NOT_ALLOWED` | gilding is not allowed in this subreddit
	`gold_only` | that subreddit needs an active reddit premium subscription
	`GOLD_ONLY_SR_REQUIRED` | this subreddit must be 'gold only' to select this
	`GOLD_REQUIRED` | you must have an active reddit gold subscription to do that
	`HTTPS_REQUIRED` | this page must be accessed using https
	`INSUFFICIENT_CREDDITS` | insufficient creddits
	`INVALID_CODE` | we've never seen that code before
	`INVALID_FREQUENCY_CAP` | invalid values for frequency cap
	`INVALID_LANG` | that language is not available
	`INVALID_LOCATION` | invalid location
	`INVALID_MODHASH` | invalid modhash
	`INVALID_NSFW_TARGET` | nsfw ads must target nsfw content
	`INVALID_OPTION` | that option is not valid
	`INVALID_OS_VERSION` | that version range is not valid
	`INVALID_PERMISSIONS` | invalid permissions string
	`INVALID_PERMISSION_TYPE` | permissions don't apply to that type of user
	`INVALID_PREF` | that preference isn't valid
	`INVALID_SCHEME` | URI scheme must be one of: %(schemes)s
	`INVALID_TARGET` | that target type is not valid
	`INVALID_USER` | [*add message here*]
	`IN_TIMEOUT` | You can't do that while suspended.
	`JSON_INVALID` | unexpected JSON structure
	`JSON_MISSING_KEY` | JSON missing key: "%(key)s"
	`JSON_PARSE_ERROR` | unable to parse JSON data
	`LOGGED_IN` | You are already logged in.
	`MAY_NOT_VIEW` | you're not allowed to view that page
	`MOD_REQUIRED` | You must be a moderator to do that.
	`MULTI_CANNOT_EDIT` | you can't change that multireddit
	`MULTI_EXISTS` | that multireddit already exists
	`MULTI_NOT_FOUND` | that multireddit doesn't exist
	`MULTI_SPECIAL_SUBREDDIT` | can't add special subreddit %(path)s
	`MULTI_TOO_MANY_SUBREDDITS` | no more space for subreddits in that multireddit
	`MUTED_FROM_SUBREDDIT` | This user has been muted from the subreddit.
	`NEWSLETTER_EMAIL_UNACCEPTABLE` | That email could not be added. Check your email for an existing confirmation email.
	`NEWSLETTER_NO_EMAIL` | where should we send that weekly newsletter?
	`NON_PREFERENCE` | '%(choice)s' is not a user preference field
	`NOT_AUTHOR` | you can't do that
	`NOT_FRIEND` | you are not friends with that user
	`NOT_USER` | You are not logged in as that user.
	`NO_API` | cannot perform this action via the API
	`NO_CHANGE_KIND` | can't change post type
	`NO_EMAIL` | please enter an email address
	`NO_EMAILS` | please enter at least one email address
	`NO_EMAIL_FOR_USER` | no email address for that user
	`NO_INVITE_FOUND` | there is no pending invite for that subreddit
	`NO_LINKS` | that subreddit only allows text posts
	`NO_NAME` | please enter a name
	`NO_OTP_SECRET` | you must enable two-factor authentication
	`NO_SELFS` | that subreddit doesn't allow text posts
	`NO_SR_TO_SR_MESSAGE` | can't send a message from a subreddit to another subreddit
	`NO_SUBJECT` | please enter a subject
	`NO_TEXT` | we need something here
	`NO_THING_ID` | id not specified
	`NO_TO_ADDRESS` | send it to whom?
	`NO_URL` | a url is required
	`NO_USER` | please enter a username
	`NO_VERIFIED_EMAIL` | no verified email address for that user
	`OAUTH2_ACCESS_DENIED` | access denied by the user
	`OAUTH2_CONFIDENTIAL_TOKEN` | confidential clients can not request tokens directly
	`OAUTH2_INVALID_CLIENT` | invalid client id
	`OAUTH2_INVALID_REDIRECT_URI` | invalid redirect_uri parameter
	`OAUTH2_INVALID_REFRESH_TOKEN` | invalid refresh token
	`OAUTH2_INVALID_RESPONSE_TYPE` | invalid response type
	`OAUTH2_INVALID_SCOPE` | invalid scope requested
	`OAUTH2_NO_REFRESH_TOKENS_ALLOWED` | refresh tokens are not allowed for this response_type
	`OTP_ALREADY_ENABLED` | two-factor authentication is already enabled
	`OVERSOLD` | that subreddit has already been oversold on %(start)s to %(end)s. Please pick another subreddit or date.
	`OVERSOLD_DETAIL` | We have insufficient inventory to fulfill your requested budget, target, and dates. Only %(available)s impressions available on %(target)s from %(start)s to %(end)s.
	`PAGE_NOT_CREATED` | Wiki page doesn't exist
	`PAGE_NOT_FOUND` | Wiki page not found
	`POST_NOT_ACCESSIBLE` | Cannot access this post.
	`quarantined` | this subreddit is quarantined and requires you to opt-in
	`QUARANTINE_REQUIRES_VERIFICATION` | [*add message here*]
	`RATELIMIT` | you are doing that too much. try again in %(time)s.
	`SCRAPER_ERROR` | unable to scrape provided url
	`SHORT_PASSWORD` | the password must be at least %(chars)d characters
	`SOMETHING_IS_BROKEN` | [*add message here*]
	`SPONSOR_NO_EMAIL` | advertisers are required to supply an email
	`SR_RULE_DOESNT_EXIST` | No subreddit rule by that name exists.
	`SR_RULE_EXISTS` | A subreddit rule by that name already exists.
	`SR_RULE_TOO_MANY` | This subreddit already has the maximum number of rules.
	`START_DATE_CANNOT_CHANGE` | start date cannot be changed
	`SUBMIT_VALIDATION_BODY_BLACKLISTED_STRING` | [*add message here*]
	`SUBMIT_VALIDATION_BODY_NOT_ALLOWED` | [*add message here*]
	`SUBMIT_VALIDATION_BODY_REGEX_REQUIREMENT` | [*add message here*]
	`SUBMIT_VALIDATION_BODY_REQUIRED` | [*add message here*]
	`SUBMIT_VALIDATION_BODY_REQUIREMENT` | [*add message here*]
	`SUBMIT_VALIDATION_MAX_LENGTH` | [*add message here*]
	`SUBMIT_VALIDATION_MIN_LENGTH` | [*add message here*]
	`SUBMIT_VALIDATION_REGEX_TIMEOUT` | [*add message here*]
	`SUBREDDIT_DISABLED_ADS` | this subreddit has chosen to disable their ads at this time
	`SUBREDDIT_EXISTS` | that subreddit already exists
	`SUBREDDIT_LINKING_DISALLOWED` | [*add message here*]
	`SUBREDDIT_NOEXIST` | that subreddit doesn't exist
	`SUBREDDIT_NOTALLOWED` | you aren't allowed to post there.
	`SUBREDDIT_NO_ACCESS` | you aren't allowed access to this subreddit
	`SUBREDDIT_OUTBOUND_LINKING_DISALLOWED` | [*add message here*]
	`SUBREDDIT_RATELIMIT` | you are doing that too much. try again later.
	`SUBREDDIT_REQUIRED` | you must specify a subreddit
	`THREAD_LOCKED` | Comments are locked.
	`TOO_LONG` | this is too long (max: %(max_length)s)
	`TOO_MANY_CAMPAIGNS` | you have too many campaigns for that promotion
	`TOO_MANY_COMMENTS` | [*add message here*]
	`TOO_MANY_DEVELOPERS` | too many developers
	`TOO_MANY_EMAILS` | please only share to %(num)s emails at a time.
	`TOO_MANY_SUBREDDITS` | maximum %(max)s subreddits
	`TOO_MANY_THING_IDS` | you provided too many ids
	`TOO_MUCH_FLAIR_CSS` | too many flair css classes
	`TOO_OLD` | that's a piece of history now; it's too late to reply to it
	`TOO_SHORT` | this is too short (min: %(min_length)s)
	`USED_CNAME` | that domain is already in use
	`USERNAME_INVALID_CHARACTERS` | username must contain only letters, numbers, "-", and "_"
	`USERNAME_LINKING_DISALLOWED` | [*add message here*]
	`USERNAME_OUTBOUND_LINKING_DISALLOWED` | [*add message here*]
	`USERNAME_TAKEN` | that username is already taken
	`USERNAME_TAKEN_DEL` | that username is taken by a deleted account
	`USERNAME_TOO_SHORT` | username must be between %(min)d and %(max)d characters
	`USER_BLOCKED` | you can't send to a user that you have blocked
	`USER_BLOCKED_MESSAGE` | can't send message to that user
	`USER_DOESNT_EXIST` | that user doesn't exist
	`USER_MUTED` | You have been muted from this subreddit.
	`USER_REQUIRED` | Please log in to do that.
	`VERIFIED_USER_REQUIRED` | you need to set a valid email address to do that.
	`WRONG_DOMAIN` | you can't do that on this domain
	`WRONG_PASSWORD` | wrong password
	*/
	type ErrorCode =
		| "ADMIN_REQUIRED"
		| "ALREADY_MODERATOR"
		| "ALREADY_SUB"
		| "BAD_ADDRESS"
		| "BAD_BID"
		| "BAD_BUDGET"
		| "BAD_CAPTCHA"
		| "BAD_CARD"
		| "BAD_CNAME"
		| "BAD_COLOR"
		| "BAD_CSS"
		| "BAD_CSS_NAME"
		| "BAD_DATE"
		| "BAD_DATE_RANGE"
		| "BAD_EMAIL"
		| "BAD_EMAILS"
		| "BAD_FLAIR_TARGET"
		| "BAD_IMAGE"
		| "BAD_JSONP_CALLBACK"
		| "BAD_MULTI_NAME"
		| "BAD_MULTI_PATH"
		| "BAD_NUMBER"
		| "BAD_PASSWORD"
		| "BAD_PASSWORD_MATCH"
		| "BAD_PROMO_MOBILE_DEVICE"
		| "BAD_PROMO_MOBILE_OS"
		| "BAD_REVISION"
		| "BAD_SR_NAME"
		| "BAD_STRING"
		| "BAD_URL"
		| "BAD_USERNAME"
		| "BANNED_FROM_SUBREDDIT"
		| "BANNED_IP"
		| "BUDGET_LIVE"
		| "CANT_CONVERT_TO_GOLD_ONLY"
		| "CANT_CREATE_SR"
		| "CANT_REPLY"
		| "CANT_RESTRICT_MODERATOR"
		| "CLAIMED_CODE"
		| "COLLECTION_NOEXIST"
		| "COMMENTER_BLOCKED_PARENT_COMMENTER"
		| "COMMENTER_BLOCKED_POSTER"
		| "COMMENT_GUIDANCE_VALIDATION_FAILED"
		| "COMMENT_NOT_ACCESSIBLE"
		| "COMMENT_NOT_STICKYABLE"
		| "CONFIRM"
		| "CONFLICT"
		| "COST_BASIS_CANNOT_CHANGE"
		| "DATE_TOO_EARLY"
		| "DATE_TOO_LATE"
		| "DELETED_COMMENT"
		| "DELETED_THING"
		| "DEVELOPER_ALREADY_ADDED"
		| "DEVELOPER_FIRST_PARTY_APP"
		| "DEVELOPER_PRIVILEGED_ACCOUNT"
		| "DOMAIN_BANNED"
		| "DRACONIAN"
		| "EXPIRED"
		| "FREQUENCY_CAP_TOO_LOW"
		| "gated"
		| "GILDING_NOT_ALLOWED"
		| "gold_only"
		| "GOLD_ONLY_SR_REQUIRED"
		| "GOLD_REQUIRED"
		| "GQL_ERROR"
		| "GQL_SYNTAX_ERROR"
		| "HTTPS_REQUIRED"
		| "INSUFFICIENT_CREDDITS"
		| "INVALID_CODE"
		| "INVALID_FREQUENCY_CAP"
		| "INVALID_LANG"
		| "INVALID_LOCATION"
		| "INVALID_MODHASH"
		| "INVALID_NSFW_TARGET"
		| "INVALID_OPTION"
		| "INVALID_OS_VERSION"
		| "INVALID_PERMISSIONS"
		| "INVALID_PERMISSION_TYPE"
		| "INVALID_PREF"
		| "INVALID_SCHEME"
		| "INVALID_TARGET"
		| "INVALID_USER"
		| "IN_TIMEOUT"
		| "JSON_INVALID"
		| "JSON_MISSING_KEY"
		| "JSON_PARSE_ERROR"
		| "LOGGED_IN"
		| "MAY_NOT_VIEW"
		| "MOD_REQUIRED"
		| "MULTI_CANNOT_EDIT"
		| "MULTI_EXISTS"
		| "MULTI_NOT_FOUND"
		| "MULTI_SPECIAL_SUBREDDIT"
		| "MULTI_TOO_MANY_SUBREDDITS"
		| "MUTED_FROM_SUBREDDIT"
		| "NEWSLETTER_EMAIL_UNACCEPTABLE"
		| "NEWSLETTER_NO_EMAIL"
		| "NON_PREFERENCE"
		| "NOT_AUTHOR"
		| "NOT_FRIEND"
		| "NOT_USER"
		| "NO_API"
		| "NO_CHANGE_KIND"
		| "NO_EMAIL"
		| "NO_EMAILS"
		| "NO_EMAIL_FOR_USER"
		| "NO_INVITE_FOUND"
		| "NO_LINKS"
		| "NO_NAME"
		| "NO_OTP_SECRET"
		| "NO_SELFS"
		| "NO_SR_TO_SR_MESSAGE"
		| "NO_SUBJECT"
		| "NO_TEXT"
		| "NO_THING_ID"
		| "NO_TO_ADDRESS"
		| "NO_URL"
		| "NO_USER"
		| "NO_VERIFIED_EMAIL"
		| "OAUTH2_ACCESS_DENIED"
		| "OAUTH2_CONFIDENTIAL_TOKEN"
		| "OAUTH2_INVALID_CLIENT"
		| "OAUTH2_INVALID_REDIRECT_URI"
		| "OAUTH2_INVALID_REFRESH_TOKEN"
		| "OAUTH2_INVALID_RESPONSE_TYPE"
		| "OAUTH2_INVALID_SCOPE"
		| "OAUTH2_NO_REFRESH_TOKENS_ALLOWED"
		| "OTP_ALREADY_ENABLED"
		| "OVERSOLD"
		| "OVERSOLD_DETAIL"
		| "PAGE_NOT_CREATED"
		| "POST_NOT_ACCESSIBLE"
		| "quarantined"
		| "QUARANTINE_REQUIRES_VERIFICATION"
		| "RATELIMIT"
		| "SCRAPER_ERROR"
		| "SHORT_PASSWORD"
		| "SOMETHING_IS_BROKEN"
		| "SPONSOR_NO_EMAIL"
		| "SR_RULE_DOESNT_EXIST"
		| "SR_RULE_EXISTS"
		| "SR_RULE_TOO_MANY"
		| "START_DATE_CANNOT_CHANGE"
		| "SUBMIT_VALIDATION_BODY_BLACKLISTED_STRING"
		| "SUBMIT_VALIDATION_BODY_NOT_ALLOWED"
		| "SUBMIT_VALIDATION_BODY_REGEX_REQUIREMENT"
		| "SUBMIT_VALIDATION_BODY_REQUIRED"
		| "SUBMIT_VALIDATION_BODY_REQUIREMENT"
		| "SUBMIT_VALIDATION_MAX_LENGTH"
		| "SUBMIT_VALIDATION_MIN_LENGTH"
		| "SUBMIT_VALIDATION_REGEX_TIMEOUT"
		| "SUBREDDIT_DISABLED_ADS"
		| "SUBREDDIT_EXISTS"
		| "SUBREDDIT_LINKING_DISALLOWED"
		| "SUBREDDIT_NOEXIST"
		| "SUBREDDIT_NOTALLOWED"
		| "SUBREDDIT_NO_ACCESS"
		| "SUBREDDIT_OUTBOUND_LINKING_DISALLOWED"
		| "SUBREDDIT_RATELIMIT"
		| "SUBREDDIT_REQUIRED"
		| "THREAD_LOCKED"
		| "TOO_LONG"
		| "TOO_MANY_CAMPAIGNS"
		| "TOO_MANY_COMMENTS"
		| "TOO_MANY_DEVELOPERS"
		| "TOO_MANY_EMAILS"
		| "TOO_MANY_SUBREDDITS"
		| "TOO_MANY_THING_IDS"
		| "TOO_MUCH_FLAIR_CSS"
		| "TOO_OLD"
		| "TOO_SHORT"
		| "USED_CNAME"
		| "USERNAME_INVALID_CHARACTERS"
		| "USERNAME_LINKING_DISALLOWED"
		| "USERNAME_OUTBOUND_LINKING_DISALLOWED"
		| "USERNAME_TAKEN"
		| "USERNAME_TAKEN_DEL"
		| "USERNAME_TOO_SHORT"
		| "USER_BLOCKED"
		| "USER_BLOCKED_MESSAGE"
		| "USER_DOESNT_EXIST"
		| "USER_MUTED"
		| "USER_REQUIRED"
		| "VERIFIED_USER_REQUIRED"
		| "WRONG_DOMAIN"
		| "WRONG_PASSWORD";
	
	type CommentSort = "confidence" | "top" | "new" | "controversial" | "old" | "random" | "qa" | "live";
	type SubredditType = "public" | "private" | "restricted" | "quarantined" | "gated" | "employees_only" | "gold_only" | "user";
	type ThingReport = [string, number, boolean, boolean];
	type Distinguish = "moderator" | "admin";
	type ListingSort = "new" | "top" | "best" | "hot" | "controversial" | "rising";
	/** Only for the "hot" sorting */
	type Region = 'GLOBAL' | 'US' | 'AR' | 'AU' | 'BG' | 'CA' | 'CL' | 'CO' | 'HR' | 'CZ' | 'FI' | 'FR' | 'DE' | 'GR' | 'HU' | 'IS' | 'IN' | 'IE' | 'IT' | 'JP' | 'MY' | 'MX' | 'NZ' | 'PH' | 'PL' | 'PT' | 'PR' | 'RO' | 'RS' | 'SG' | 'ES' | 'SE' | 'TW' | 'TH' | 'TR' | 'GB' | 'US_WA' | 'US_DE' | 'US_DC' | 'US_WI' | 'US_WV' | 'US_HI' | 'US_FL' | 'US_WY' | 'US_NH' | 'US_NJ' | 'US_NM' | 'US_TX' | 'US_LA' | 'US_NC' | 'US_ND' | 'US_NE' | 'US_TN' | 'US_NY' | 'US_PA' | 'US_CA' | 'US_NV' | 'US_VA' | 'US_CO' | 'US_AK' | 'US_AL' | 'US_AR' | 'US_VT' | 'US_IL' | 'US_GA' | 'US_IN' | 'US_IA' | 'US_OK' | 'US_AZ' | 'US_ID' | 'US_CT' | 'US_ME' | 'US_MD' | 'US_MA' | 'US_OH' | 'US_UT' | 'US_MO' | 'US_MN' | 'US_MI' | 'US_RI' | 'US_KS' | 'US_MT' | 'US_MS' | 'US_SC' | 'US_KY' | 'US_OR' | 'US_SD';

		/** richtext_json */
	type RichtextJSON = {e: string, t: string}[];
	type RichtextJSONDoc = {document: rtypes.RichtextJSON}

	enum WikiPermLevel {
		"use_subreddit_perm" = 0,
		"approved_contributors" = 1,
		"moderators" = 2
	}

	type Flair = "USER_FLAIR" | "LINK_FLAIR";
	type Inbox = "post_reply" | "comment_reply" | "username_mention";
}

declare type HTTPMethod = "GET" | "POST" | "OPTIONS" | "HEAD" | "PATCH" | "DELETE";
//declare interface RedditError { code: RedditErrorCode | number; msg: string; field?: string }

export namespace models {
	interface POSTResponse<T> {
		json: {
			errors: [rtypes.ErrorCode, string, string][];
			data: T;
		};
		error?: number;
		message?: string;
		reason?: string;
		explanation?: string;
	}

	interface ErrorResponse {
		error: number;
		message: string;
		reason?: string;
		explanation?: string;
	}

	/**
	 *@example
	 *## On r/russia
	 *```json
	 *{
	 *	"quarantine_requires_email_optin": true,
	 *	"reason": "quarantined",
	 *	"quarantine_message_html": "<!-- SC_OFF --><div class=\"md\"><p>This Community contains a high volume of information not supported by credible sources. Learn more about <a href=\"https://reddit.zendesk.com/hc/en-us/articles/360043069012-Quarantined-Subreddits\">quarantined communities</a></p>\n</div><!-- SC_ON -->",
	 *	"quarantine_message": "This Community contains a high volume of information not supported by credible sources. Learn more about [quarantined communities](https://reddit.zendesk.com/hc/en-us/articles/360043069012-Quarantined-Subreddits)",
	 *	"error": 403,
	 *	"message": "Forbidden"
	 *}
	 *```
	 */
	interface QuarantineErrorResponse extends ErrorResponse {
		message: "Forbidden";
		error: 403;
		reason: "quarantined";
		quarantine_message: string;
		quarantine_message_html: string;
		quarantine_requires_email_optin: boolean;
	}

	/**
	 *@example
	 *## On r/heroin
	 *
	 *```json
	 *{
	 *	"interstitial_warning_message_html": "<!-- SC_OFF --><div class=\"md\"><p>Content Advisory: This community may contain discussions and content pertaining to drug use and abuse. It may be triggering for those in recovery and readers should proceed with caution. If you or someone you know is struggling with addiction or substance abuse, SAMHSA provides free 24/7 support and resources in a variety of languages at <a href=\"https://www.samhsa.gov/find-help/national-helpline\">SAMHSA’s National Helpline</a>, or call 1-800-662-HELP (4357).</p>\n</div><!-- SC_ON -->",
	 *	"reason": "gated",
	 *	"interstitial_warning_message": "Content Advisory: This community may contain discussions and content pertaining to drug use and abuse. It may be triggering for those in recovery and readers should proceed with caution. If you or someone you know is struggling with addiction or substance abuse, SAMHSA provides free 24/7 support and resources in a variety of languages at [SAMHSA’s National Helpline](https://www.samhsa.gov/find-help/national-helpline), or call 1-800-662-HELP (4357).",
	 *	"message": "Forbidden",
	 *	"error": 403
	 *}
	 *```
	 */
	interface GatedErrorResponse extends ErrorResponse {
		message: "Forbidden";
		error: 403;
		reason: "gated";
		interstitial_warning_message: string;
		interstitial_warning_message_html: string;
	}

	interface RedditData {
		type: string;
		data: Object;
	}

	interface Listing<T> {
		kind: "Listing";
		data: {
			before: string;
			after: string;
			dist: number;
			modhash?: string;
			geofilter: string;
			children: T[];
		};
	}

	interface ThingData {
		name?: string,
		id: string,
		created_utc: number
	}

	interface Thing {
		kind: string;
		data: ThingData;
	}

	interface RedditImage {
		url: string;
		width: number;
		height: number;
	}

	interface SubmissionData extends ThingData {
		author_flair_background_color: string;
		approved_at_utc: number;
		subreddit: string;
		selftext: string;
		user_reports: rtypes.ThingReport[];
		saved: boolean;
		mod_reason_title: string;
		clicked: boolean;
		title: string;
		link_flair_richtext: rtypes.RichtextJSON;
		subreddit_name_prefixed: string;
		hidden: boolean;
		pwls: number;
		link_flair_css_class: string;
		thumbnail_height: number;
		hide_score: boolean;
		name: string;
		quarantine: boolean;
		link_flair_text_color: string;
		upvote_ratio: number;
		ignore_reports: boolean;
		domain: string;
		media_embed: {};
		thumbnail_width: number;
		author_flair_template_id: string;
		is_original_content: boolean;
		author_fullname: string;
		secure_media: null;
		is_reddit_media_domain: boolean;
		is_meta: boolean;
		category: null;
		secure_media_embed: {};
		link_flair_text: string;
		can_mod_post: boolean;
		score: number;
		approved_by: string;
		is_created_from_ads_ui: boolean;
		author_premium: boolean;
		thumbnail: string;
		edited: boolean;
		author_flair_css_class: string;
		author_flair_richtext: rtypes.RichtextJSON;
		post_hint: "image" | "video" | "link" | "self";
		content_categories: null;
		is_self: boolean;
		subreddit_type: rtypes.SubredditType;
		created: number;
		link_flair_type: "richtext" | "text";
		wls: 6;
		removed_by_category: string; //"automod_filtered";
		banned_by: string; //"AutoModerator";
		author_flair_type: "richtext" | "text";
		selftext_html: string;
		suggested_sort: rtypes.ListingSort;
		banned_at_utc: number;
		url_overridden_by_dest: string;
		archived: boolean;
		no_follow: boolean;
		spam: boolean;
		is_crosspostable: boolean;
		pinned: boolean;
		over_18: boolean;
		preview: {
			images: {
				source: RedditImage;
				resolutions: RedditImage[];
				variants: {};
				id: string;
			}[];
			enabled: boolean;
		};
		media_only: boolean;
		link_flair_template_id: string;
		removed: boolean;
		spoiler: boolean;
		locked: boolean;
		author_flair_text: string;
		treatment_tags: string[];
		visited: boolean;
		removed_by: string;
		mod_note: string;
		distinguished: rtypes.Distinguish;
		subreddit_id: string;
		author_is_blocked: boolean;
		mod_reason_by: null;
		num_reports: 0;
		removal_reason: null;
		link_flair_background_color: string;
		ban_note: string; //"remove not spam";
		id: string;
		is_robot_indexable: boolean;
		author: string;
		discussion_type: null;
		num_comments: number;
		send_replies: boolean;
		media: null;
		contest_mode: boolean;
		author_patreon_flair: boolean;
		approved: boolean;
		author_flair_text_color: string;
		permalink: string;
		stickied: boolean;
		url: string;
		subreddit_subscribers: number;
		created_utc: number;
		num_crossposts: number;
		mod_reports: rtypes.ThingReport[];
		is_video: boolean;
	}

	interface Submission extends Thing {
		kind: "t3";
		data: SubmissionData;
	}

	interface MoreComments extends RedditData {
		type: "more";
		data: {
			count: number;
			name: string;
			id: string;
			parent_id: string;
			depth: number;
			children: string[];
		};
	}

	interface CommentData extends ThingData {
		subreddit_id: string;
		approved_at_utc: number;
		author_is_blocked: boolean;
		comment_type: string;
		mod_reason_by: string;
		banned_by: string;
		author_flair_type: "text" | "rtjson";
		subreddit: string;
		author_flair_template_id: string;
		replies: models.Listing<Comment> | MoreComments;
		user_reports: rtypes.ThingReport[];
		saved: boolean;
		id: string;
		banned_at_utc: number;
		mod_reason_title: string;
		archived: boolean;
		collapsed_reason_code: string;
		no_follow: boolean;
		author: string;
		can_mod_post: boolean;
		created_utc: number;
		send_replies: boolean;
		parent_id: string;
		score: number;
		author_fullname: string;
		approved_by: string;
		mod_note: string;
		collapsed: boolean;
		body: string;
		edited: boolean;
		author_flair_css_class: string;
		name: string;
		is_submitter: boolean;
		author_flair_richtext: rtypes.RichtextJSON;
		author_patreon_flair: boolean;
		body_html: string;
		removal_reason: string;
		collapsed_reason: string;
		distinguished: rtypes.Distinguish;
		stickied: boolean;
		author_premium: boolean;
		unrepliable_reason: string;
		author_flair_text_color: string;
		score_hidden: boolean;
		permalink: string;
		context: string;
		subreddit_type: rtypes.SubredditType;
		locked: boolean;
		created: number;
		author_flair_text: string;
		treatment_tags: string[];
		link_id: string;
		subreddit_name_prefixed: string;
		controversiality: number;
		depth: number;
		author_flair_background_color: string;
		collapsed_because_crowd_control: string;
		mod_reports: rtypes.ThingReport[];
		num_reports: number;
	}

	interface Comment extends Thing {
		kind: "t1";
		data: CommentData;
	}

	interface InboxComment extends Thing {
		kind: "t1";
		data: {
			subreddit: string;
			author_fullname: string;
			id: string;
			subject: string;
			score: number;
			author: string;
			num_comments: number;
			parent_id: string;
			subreddit_name_prefixed: string;
			new: boolean;
			type: rtypes.Inbox;
			body: string;
			link_title: string;
			dest: string;
			was_comment: boolean;
			body_html: string;
			name: string;
			created: number;
			created_utc: number;
			context: string;
			distinguished: rtypes.Distinguish;
		};
	}

	interface SubredditData extends ThingData {
		user_flair_background_color: string;
		submit_text_html: string;
		restrict_posting: boolean;
		user_is_banned: boolean;
		free_form_reports: boolean;
		wiki_enabled: boolean;
		user_is_muted: boolean;
		user_can_flair_in_sr: boolean;
		display_name: string;
		header_img: string;
		title: string;
		original_content_tag_enabled: boolean;
		allow_galleries: boolean;
		icon_size: [number, number];
		primary_color: string;
		icon_img: string;
		display_name_prefixed: string;
		public_traffic: boolean;
		subscribers: number;
		user_flair_richtext: rtypes.RichtextJSON;
		videostream_links_count: number;
		name: string;
		quarantine: boolean;
		hide_ads: boolean;
		prediction_leaderboard_entry_type: number;
		emojis_enabled: boolean;
		advertiser_category: string;
		public_description: string;
		comment_score_hide_mins: 10;
		allow_predictions: boolean;
		user_has_favorited: boolean;
		user_flair_template_id: string;
		community_icon: string;
		banner_background_image: string;
		header_title: string;
		community_reviewed: boolean;
		submit_text: string;
		description_html: string;
		spoilers_enabled: boolean;
		comment_contribution_settings: {
			allowed_media_types: ["animated" | "static" | "giphy" | "expression"][];
		};
		allow_talks: boolean;
		header_size: [number, number];
		user_flair_position: "left" | "right";
		all_original_content: boolean;
		has_menu_widget: boolean;
		is_enrolled_in_new_modmail: boolean;
		key_color: string;
		can_assign_user_flair: boolean;
		created: number;
		wls: string;
		show_media_preview: boolean;
		submission_type: string; //"any";
		user_is_subscriber: boolean;
		allowed_media_in_comments: ["animated", "static", "giphy", "expression"][];
		allow_videogifs: boolean;
		should_archive_posts: boolean;
		user_flair_type: "richtext" | "text";
		allow_polls: boolean;
		collapse_deleted_comments: boolean;
		emojis_custom_size: [number, number];
		public_description_html: string;
		allow_videos: boolean;
		is_crosspostable_subreddit: boolean;
		notification_level: "low" | "medium" | "high";
		should_show_media_in_comments_setting: boolean;
		can_assign_link_flair: boolean;
		allow_prediction_contributors: boolean;
		submit_text_label: string;
		link_flair_position: "right";
		user_sr_flair_enabled: boolean;
		user_flair_enabled_in_sr: boolean;
		allow_discovery: boolean;
		accept_followers: boolean;
		user_sr_theme_enabled: boolean;
		link_flair_enabled: boolean;
		disable_contributor_requests: boolean;
		subreddit_type: rtypes.SubredditType;
		suggested_comment_sort: "blank" | rtypes.ListingSort;
		banner_img: string;
		user_flair_text: string;
		banner_background_color: string;
		show_media: boolean;
		id: string;
		user_is_moderator: boolean;
		over18: boolean;
		description: string;
		submit_link_label: string;
		user_flair_text_color: string;
		restrict_commenting: boolean;
		user_flair_css_class: string;
		allow_images: boolean;
		lang: string;
		url: string;
		created_utc: number;
		banner_size: [number, number];
		mobile_banner_image: string;
		user_is_contributor: boolean;
		allow_predictions_tournament: boolean;
	}

	interface Subreddit extends Thing {
		kind: "t5";
		data: SubredditData;
	}

	interface RedditorData extends ThingData {
		is_employee: boolean;
		has_visited_new_profile: boolean;
		is_friend: boolean;
		pref_no_profanity: boolean;
		has_external_account: boolean;
		pref_geopopular: string;
		pref_show_trending: boolean;
		subreddit: Partial<SubredditData>;
		pref_show_presence: boolean;
		snoovatar_img: string;
		snoovatar_size: [number, number];
		gold_expiration: number;
		has_gold_subscription: boolean;
		is_sponsor: boolean;
		num_friends: number;
		can_edit_name: boolean;
		is_blocked: boolean;
		verified: boolean;
		new_modmail_exists: boolean;
		pref_autoplay: boolean;
		has_paypal_subscription: boolean;
		has_subscribed_to_premium: boolean;
		id: string;
		can_create_subreddit: boolean;
		over_18: boolean;
		is_gold: boolean;
		is_mod: boolean;
		awarder_karma: number;
		suspension_expiration_utc: number;
		has_stripe_subscription: boolean;
		is_suspended: boolean;
		pref_video_autoplay: boolean;
		in_chat: boolean;
		has_android_subscription: boolean;
		in_redesign_beta: boolean;
		icon_img: string;
		has_mod_mail: boolean;
		pref_nightmode: boolean;
		awardee_karma: number;
		hide_from_robots: boolean;
		password_set: boolean;
		modhash: string;
		link_karma: number;
		force_password_reset: boolean;
		total_karma: number;
		inbox_count: number;
		pref_top_karma_subreddits: boolean;
		has_mail: boolean;
		pref_show_snoovatar: boolean;
		name: string;
		pref_clickgadget: number;
		created: number;
		has_verified_email: boolean;
		created_utc: number;
		has_ios_subscription: boolean;
		pref_show_twitter: boolean;
		in_beta: boolean;
		comment_karma: number;
		accept_followers: boolean;
		has_subscribed: boolean;
	}

	interface Redditor extends Thing {
		kind: "t2";
		data: RedditorData;
	}

	interface WikiPageContent {
		content_md: string;
		content_html: string;
		may_revise: boolean;
		reason: string;
		revision_date: number;
		revision_by: models.Redditor;
		revision_id: string;
	}

	interface WikiPage {
		kind: "wikipage",
		data: WikiPageContent
	}

	interface WikiSettingsData {
		permlevel: rtypes.WikiPermLevel;
		editors: models.Redditor[];
		listed: boolean;
	}

	interface WikiSettings {
		kind: "wikipagesettings",
		data: WikiSettingsData
	}

	interface RemovalReasonsPage {
		data: { [key: string]: RemovalReason };
		order: string[];
	}

	interface RemovalReason {
		message: string;
		id: string;
		title: string;
	}

	interface SubredditRules {
		rules:           Rule[];
		site_rules:      string[];
		site_rules_flow: SiteRulesFlow[];
	}

	interface Rule {
		kind:             string;
		description:      string;
		short_name:       string;
		violation_reason: string;
		created_utc:      number;
		priority:         number;
		description_html: string;
	}

	interface SiteRulesFlow {
		reasonTextToShow: string;
		reasonText:       string;
		nextStepHeader?:  string;
		nextStepReasons?: SiteRulesFlowNextStepReason[];
	}

	interface SiteRulesFlowNextStepReason {
		nextStepHeader?:        string;
		reasonTextToShow:       string;
		nextStepReasons?:       SiteRulesFlowNextStepReason[];
		reasonText:             string;
		canWriteNotes?:         boolean;
		isAbuseOfReportButton?: boolean;
		notesInputTitle?:       string;
		complaintButtonText?:   string;
		complaintUrl?:          string;
		complaintPageTitle?:    string;
		fileComplaint?:         boolean;
		complaintPrompt?:       string;
		usernamesInputTitle?:   string;
		canSpecifyUsernames?:   boolean;
		requestCrisisSupport?:  boolean;
		oneUsername?:           boolean;
	}
}

declare namespace opts {
	interface Listing {
		limit?: number;
		before?: string;
		after?: string;
		count?: number;
		show?: "all";
		t?: "hour" | "day" | "week" | "month" | "year" | "all";
		g?: rtypes.Region;
		sr_detail?: boolean;
	}

	interface DuplicatesListing extends Listing {
		sort?: "num_comments" | "new";
		crossposts_only?: boolean;
		sr?: string;
	}

	interface CommentsListing extends Listing {
		context?: number;
		depth?: number;
		showedits?: boolean;
		showmedia?: boolean;
		showmore?: boolean;
		showtitle?: boolean;
		sort?: rtypes.CommentSort;
	}
}

export namespace GQL {
	interface Response<K extends keyof ResponseDataMap> {
		data?: Pick<ResponseDataMap, K>;
		errors?: Error[]
	}

	interface SVCResponse<K extends keyof ResponseDataMap> {
		data: Pick<ResponseDataMap, K>;
		errors: Error[];
		operation: string;
	}

	interface Error {
		message: string,
		path?: string[]
	}

	interface ResponseDataMap {
		subredditInfoById: Subreddit;
		modApproveBulk: ModActionBulk;
		modRemoveBulk: ModActionBulk;
		modIgnoreReportsBulk: ModActionBulk;
		ModActionBulk: ModActionBulk;
	}

	interface Subreddit {
		__typename: "Subreddit";
		rules: Rule[];
		modSavedResponses: ModSavedResponses;
	}

	interface ModSavedResponses {
		general: SavedResponse[];
		removals: SavedResponse[];
		bans: SavedResponse[];
		modmail: SavedResponse[];
		reports: SavedResponse[];
		comments: SavedResponse[];
		chat: SavedResponse[];
	}

	interface SavedResponse {
		__typename: "SavedResponse";
		id: string;
		title: string;
		context: SavedResponseCategory;
		subredditRule?: SubredditRule | null;
		message: Message;
	}

	type SavedResponseCategory = "GENERAL" | "REMOVALS" | "BANS" | "MODMAIL" | "REPORTS" | "COMMENTS" | "CHAT";

	interface Message {
		richtext: string;
		markdown: string;
	}

	interface SubredditRule {
		id: string;
		kind: RuleKind;
		name: string;
	}

	type RuleKind = "LINK_AND_COMMENT" | "LINK" | "COMMENT";

	interface Rule {
		id: string;
		name: string;
	}

	interface ModActionBulk {
		ok:        boolean;
		/** Example: `[{"__typename": "OperationError", "message": "Unknown error"}]` */
		errors:    GQL.Error[] | null;
		/** Useless, as expected from reddit devs. You'll get `{"__typename": "OperationError", "message": "Unknown error"}` on errors. The failed IDs won't appear here. */
		failedIds: string[];
	}
}