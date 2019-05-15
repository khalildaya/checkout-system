"use strict";

const { validateJsonSchema, addSchema } = require("../../json-schema-validator-service");
const { getPrices } = require("../../inventory-service");
const { applyPromotions } = require("../../promotions-service");
const ERRORS = require("./errors");

module.exports = Object.freeze({
	checkout
});

function checkout(input) {

	// Check if input has valid format
	validateInput(input);

}
/**
 * checks if input is in valid format which is array of strings
 * @param {array} input array of scanned items skus 
 * @return {boolean} true if input is valid or throws an error otherwise
 */
function validateInput(input) {
	const result = validateJsonSchema(input, "checkout-input");
	if (!result.isValid) {
		throw Object.assign(ERRORS.INVALID_INPUT, {
			details: {
				input,
				errors: result.errors
			}
		})
	}
	return true;
}