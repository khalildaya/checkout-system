"use strict";

const { checkout } = require("../../endpoints-logic/checkout");

module.exports = Object.freeze({
	createCheckoutRoutes
});

function createCheckoutRoutes(app) {
	app.post("/checkout", (req, res) => {
		try {
			const result = checkout(req.body);
			res.status(200).json(result).end();
		} catch (error) {
			res.status(error.responseStatus || 500).json(error).end();
		}
	});
}