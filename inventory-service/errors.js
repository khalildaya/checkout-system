"use strict";
const { ERROR_PREFIX } = require("./constants").STRINGS;

module.exports = Object.freeze({
	ITEM_NOT_FOUND: {
		code: `${ERROR_PREFIX}1`,
		message: "Item not found in inventory",
		statusCode: 404
	},
	ITEM_PRICE_UNDEFINED: {
		code: `${ERROR_PREFIX}2`,
		message: "Item price is not defined",
		statusCode: 500 // This is an internal error
	},
	INVALID_ITEM_QUANTITY: {
		code: `${ERROR_PREFIX}3`,
		message: "Invalid item quantity",
		statusCode: 500 // This is an internal error
	},
	NEGATIVE_ITEM_QUANTITY: {
		code: `${ERROR_PREFIX}4`,
		message: "Item quantity below zero",
		statusCode: 400
	},
	MISSING_ITEM_SKU: {
		code: `${ERROR_PREFIX}5`,
		message: "Missing item sku",
		statusCode: 400
	},
	INVALID_PROVIDED_ITEM_QUANTITY: {
		code: `${ERROR_PREFIX}6`,
		message: "Invalid provided item quantity",
		statusCode: 400
	}
});