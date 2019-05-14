/**
 * An inventory service defining inventory related operation such as updating an item's quantity,
 * retrieving items prices...etc.
*/
"use strict";
const ERRORS = require("./errors");

let inventory = require("./inventory");

module.exports = Object.freeze({
	getPrices,
	updateQuantities,
	__internals__ : { // used for unit testing only
		setInventory
	}
});

/**
 * Returns price of provided skus
 * @param {array} itemSkus array of strings holding item skus for which to get prices
 * @return {object} a key-value object where key is ksu value is price of sku
 */
function getPrices(itemSkus) {
	const result = {};
	for (let i = 0; i < itemSkus.length; i++) {
		const sku = itemSkus[i];

		// Throw an error if item not found in inventory
		itemExists(sku);

		// Throw an error if item price was not defined
		if (inventory[sku].price === undefined || inventory[sku].price === null) {
			throw Object.assign(ERRORS.ITEM_PRICE_UNDEFINED, {
				details: {
					sku
				}
			});
		}

		result[sku] = inventory[sku].price;
	}

	return result;
}

/**
 * Updates quantity of an items
 * @param {array} itemQuantities array of key-value pairs with key being item sku and value being quantity to update
 * @return {object} a map of updated item quantities
 */
function updateQuantities(itemQuantities) {
	// Holds the resulting map of updated item quantities
	const newQuantities = {};
	for (let i = 0; i < itemQuantities.length; i++) {
		const sku = itemQuantities[i].sku;

		// Throw an error if item sku was not found in array element
		if (!sku) {
			throw Object.assign(ERRORS.MISSING_ITEM_SKU, {
				details: {
					index: i
				}
			});
		}
		const quantity = itemQuantities[i].quantity;

		// Throw an error if provided item quantity is not defined or not a number
		if (typeof quantity !== "number") {
			throw Object.assign(ERRORS.INVALID_PROVIDED_ITEM_QUANTITY, {
				details: {
					index: i
				}
			});
		}

		// Throw an error if item not found in inventory
		itemExists(sku);

		// Throw an error if item quantity was not defined or not a number
		if (typeof inventory[sku].quantity !== "number") {
			throw Object.assign(ERRORS.INVALID_ITEM_QUANTITY, {
				details: {
					sku
				}
			});
		}

		// Calculate new quantity
		newQuantities[sku] = inventory[sku].quantity + quantity;
		
		// Throw an error if new quantity will be 0 or less
		/**
		 * in real-life scenario we might not throw an error,
		 * rather, place an order with a supplier. Of course we can set a limit greater than 0 to trigger such order,
		 * and prevent the item from going fewer than a certain limit
		*/
		if (newQuantities[sku] < 0) {
			throw Object.assign(ERRORS.NEGATIVE_ITEM_QUANTITY, {
				details: {
					sku
				}
			});
		}
	}

	// Update quantities in inventory after no error was thrown
	const skus = Object.getOwnPropertyNames(newQuantities);
	for (let i = 0; i < skus.length; i++) {
		const sku = skus[i];
		inventory[sku].quantity = newQuantities[sku];
	}
	return newQuantities;
}

// throws an error if a sku does not exist in inventory
function itemExists(sku) {
	if (!inventory[sku]) {
		throw Object.assign(ERRORS.ITEM_NOT_FOUND, {
			details: {
				sku
			}
		});
	}
	return true;
}

// Sets the in-memory inventory, used for unit testing only
function setInventory(newInventory) {
	inventory = newInventory;
}