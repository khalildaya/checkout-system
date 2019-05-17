/**
 * A module for logging. Ideally this module logs to an asynchronous queue
 * not the actual persistent logs store (such as a database). Logging to a queue is faster
 * and does not require the API to wait until it gets a response back from the persistent logs store.
 * Using winston logger here for more flexible logging if needed
 * Note: winston does not seem to work with vscode debugging https://github.com/winstonjs/winston/issues/1544
  */

"use strict";

const winston = require("winston");
const logger = createLogger();

module.exports = Object.freeze({
	logApiRequest,
	log: logger.log
});


function createLogger() {
	return winston.createLogger({
		transports: [
			new winston.transports.Console() // Log to console only for purposes of the assessment
		]
	});
}

/**
 * 
 * @param {object} requestInfo incoming API request info, holds a request and error if applicable
 * format is
 * {
 *   error: <object>,
 *   request: <object>
 * } 
 */
function logApiRequest(requestInfo) {
	/**
	 * for the purpose of assessment using console.log to log request and console.error to log error
	 * In a real-life scenario, would log to async queue
	*/

	if (requestInfo && requestInfo.request) {
		logger.log("info", requestInfo.request);
	}

	if (requestInfo && requestInfo.error) {
		logger.log("error", requestInfo.error);
	}
}