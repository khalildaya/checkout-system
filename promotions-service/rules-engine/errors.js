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
	},
	ASSERT_UNDEFINED_FOR_RULE_TYPE: {
		code: `${ERROR_PREFIX}3`,
		message: "Error while running rules. Assert function not defined for rule type",
		statusCode: 500
	},
	GET_ACTIONS_TO_APPLY_UNDEFINED_FOR_RULE_TYPE: {
		code: `${ERROR_PREFIX}4`,
		message: "Error while running rules. getActionsToApply function not defined for rule type",
		statusCode: 500
	},
	APPLY_RULE_ACTIONS_UNDEFINED_FOR_RULE_TYPE: {
		code: `${ERROR_PREFIX}5`,
		message: "Error while running rules. applyRuleActions function not defined for rule type",
		statusCode: 500
	},
	RULE_TYPE_PROCESSOR_UNDEFINED_FOR_RULE_TYPE: {
		code: `${ERROR_PREFIX}6`,
		message: "Error while running rules. Rule type processor function not defined for rule type",
		statusCode: 500
	},
});