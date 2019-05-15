"use strict";

const { validateJsonSchema, addSchema } = require("../../json-schema-validator-service");
const { getPrices } = require("../../inventory-service");
const { applyPromotions } = require("../../promotions-service");
const ERRORS = require("./errors");

module.exports = Object.freeze({
	checkout
});

function checkout(input) {

	// Get a deep copy of provided input
	let context = JSON.parse(JSON.stringify(input));
	
	// Check if input is in a valid format
	validateInput(context);

	// Calculate quantity of each scanned item
	context = calculateScannedQuantities(context);

	// Calculate prices of all quantities of each item and overall price
	context = calculatePrices(context);

	// Apply promotions
	context = applyPromotions(context);

	return context;
}

/**
 * checks if input is in a valid format which is array of strings
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

/**
 * Calculates quantity of each scanned item
 * @param {array} scannedItems array of scanned items skus 
 * @return {object} key-value map with key being item sku and value being quantity of scanned item
 */
function calculateScannedQuantities(scannedItems) {
	const result = {};
	for (let i = 0; i <  scannedItems.length; i++) {
		const scannedItem = scannedItems[i]
		if (!result[scannedItem]) {
			result[scannedItem] = 1;
		} else {
			result[scannedItem]++;
		}
	}
	return result;
}

/**
 * Calculate prices of all quantities of each item and overall price
 * @param {object} scannedItemsQuantities key-value map with key being item sku and value being quantity of scanned item
 * @return {object} original (pre-promotion) order info based on scanned items. Format is
 * {
 *   scannedItems: {
 *     "<someSku>": {
 *        quantity: <number>,
 *        price: <number>
 *     }
 *   },
 *     "<anotherSku>": {
 *        quantity: <number>
 *        price: <number>
 *     }
 *   },
 *   scannedItemsPrice: <number>
 * }
 */
function calculatePrices(scannedItemsQuantities) {
	const result = {
		scannedItems:{},
		scannedItemsPrice: 0
	};

	// Get skus out of items quantities map
	const skus = Object.getOwnPropertyNames(scannedItemsQuantities);

	// retrieve each sku price from the inventory
	const inventoryPrices = getPrices(skus);

	// Calculate price for all quantities of each scanned item in addition to overall price
	for (let i = 0; i < skus.length; i++) {
		const sku = skus[i];
		const quantity = scannedItemsQuantities[sku];
		const price = quantity * inventoryPrices[sku];
		result.scannedItems[sku] = {
			quantity,
			price,
			unitPrice: inventoryPrices[sku]
		}
		result.scannedItemsPrice += price;
	}
	return result;
}