"use strict";

const { reloadPromotions } = require("../../endpoints-logic/reload-promotions");
const { logApiRequest } = require("../../logger-service");
const uuidv4 = require("uuid/v4");
const { getErrorInfo } = require("../../error-handler-service");

module.exports = Object.freeze({
	createPromotionsRoutes
});

function createPromotionsRoutes(app) {
	app.get("/reloadPromotions", (req, res) => {
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
			reloadPromotions();
			res.status(200).json({
				success: true
			}).end();
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