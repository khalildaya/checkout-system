"use strict";

const { checkout } = require("../../endpoints-logic/checkout");
const { logApiRequest } = require("../../logger-service");
const uuidv4 = require("uuid/v4");
const { getErrorInfo } = require("../../error-handler-service");

module.exports = Object.freeze({
	createCheckoutRoutes
});

function createCheckoutRoutes(app) {
	app.post("/checkout", (req, res) => {
		const uuid = uuidv4();
		const requestToLog = {
			uuid,
			incomingRequest: req
		}
		try {
			/**
			 * Log incoming API request for troubleshooting purposes.
			 * In real life sensitive data such as Authorization header should be considered
			 * whether to be logged or not
			 * */
			logApiRequest({
				request: requestToLog
			});
			const result = checkout(req.body);
			res.status(200).json(result).end();
		} catch (error) {
			const {
				statusCode,
				responseError,
				logError
			} = getErrorInfo(error);
			res.status(statusCode).json(responseError).end();
			logApiRequest({
				request: requestToLog,
				error: logError
			});
		}
	});
}