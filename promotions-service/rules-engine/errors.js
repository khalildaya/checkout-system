"use strict";
const { ERROR_PREFIX } = require("./constants").STRINGS;

module.exports = Object.freeze({
	RULE_TYPE_PROCESSOR_ALREADY_EXISTS: {
		code: `${ERROR_PREFIX}1`,
		message: "Error while building rules processors. Rule type processor already exists",
		statusCode: 500
	},
	MISSING_RULE_TYPE_ID_IN_RULE_TYPE: {
		code: `${ERROR_PREFIX}2`,
		message: "Error while building rules processors. Rule type or rule type id is missing",
		statusCode: 500
	}
});