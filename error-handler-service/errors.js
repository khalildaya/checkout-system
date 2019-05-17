"use strict";
const ERROR_PREFIX = "UNKWN";

module.exports = Object.freeze({
	INTERNAL_SYSTEM_ERROR: {
		code: `${ERROR_PREFIX}1`,
		message: "Internal system error",
		statusCode: 500
	},
});