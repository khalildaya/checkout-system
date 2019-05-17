/**
 * A module for error handling. Differentiates between two types of error
 * (1) Errors thrown intentionally by the application. They are not an instance fo class Error
 * and they have the following standard format
 * {
 *   code: <string>, // error code
 *   message: <string>,
 *   statusCode: <number>, // http status code
 *   details: <object>, // more details about the error if applicable
 * }
 * (2) Uncaught exception, those are instances of class Error and have a "message" and "stack" properties.
 * Those errors should not be returned in the API response for security reasons 
*/
"use strict";

const ERRORS = require("./errors");

module.exports = Object.freeze({
	getErrorInfo
});

/**
 * Returns error info in two parts: (1) error info to return in the API response and (2) error info to log
 * @param {object} error error object
 * @return {object} error info in following format
 * {
 *   statusCode: <number>, http status code
 *   responseError: <object>,
 *   logError: <object>
 * }
 */
function getErrorInfo(error) {
	if (error instanceof Error) {

		/**
		 * Destruct message and stack properties from error object.
		 * When error is instance of Error class, some npm packages might not
		 * adding this info when trying to log to a database for example.
		 * From previous experience, package "documentdb" does that when trying to
		 * save an instance of class Error to a cosmos db on Azure
		 */
		const { message, stack } = error;
		const responseError = {
			code: ERRORS.INTERNAL_SYSTEM_ERROR.code,
			message: ERRORS.INTERNAL_SYSTEM_ERROR.message
		};

		return {
			statusCode: ERRORS.INTERNAL_SYSTEM_ERROR.statusCode,
			responseError,
			logError: {
				responseError,
				details: {
					message,
					stack
				}
			}
		}
	}
	const { code, message, details } = error;
	const responseError = {
		code: code || ERRORS.INTERNAL_SYSTEM_ERROR.code,
		message: message || ERRORS.INTERNAL_SYSTEM_ERROR.message,
		details
	};
	return {
		statusCode: error.statusCode || ERRORS.INTERNAL_SYSTEM_ERROR.statusCode,
		responseError,
		logError: {
			responseError,
			originalError: error
		}
	}
}