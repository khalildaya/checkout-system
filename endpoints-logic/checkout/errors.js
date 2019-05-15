"use strict";
const ERROR_PREFIX = "CHKINPUT";

module.exports = Object.freeze({
	INVALID_INPUT: {
		code: `${ERROR_PREFIX}1`,
		message: "Invalid input format. Scanned items should be an array",
		statusCode: 400
	}
});