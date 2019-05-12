/**
 * A module for a rule processor for rule type buyCountOfXGetCountOfYFree
 * exposes
 * (1) the rule type it operates on
 * (2) an assert function to assert the rule, and
 * (3) and apply function to apply rule, if the rule did assert
 * */
"use strict";

const ruleType = require("../../rule-types").BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE;

const { NOT_APPLICABLE } = require("../../constants").STRINGS;

module.exports = Object.freeze({
	ruleType: ruleType, // rule type
	assert, // assert function
	apply // apply function
});

/**
 * Checks if provided rule applies to a given context
 * @param {object} context is the context passed to API should be in the format of
 * {
 *   scannedItems: {
 *     "<someSku>": {
 *        quantity: <number>
 *     }
 *   },
 *     "<anotherSku>": {
 *        quantity: <number>
 *     }
 *   }
 * }
 * @param {object} rule rule to evaluation, should be of type buyCountOfXGetCountOfYFree example rule is
 * {
		id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
		type: "buyCountOfXGetCountOfYFree",
		description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
		boughItemSku: "43N23P",
		boughItemCount: 1,
		offeredItemSku: "234234",
		offeredItemCount: 1
	}
 */
function assert(context, rule) {
	const scannedItems = context.scannedItems;

	// Get scanned items Sku. those Skus will be properties under "scannedItems" object in context
	const skus = Object.getOwnPropertyNames(scannedItems);
	for (let i = 0; i < skus.length; i++) {
		const sku = skus[i];
		if (boughItemSku === sku) {
			const quantity = scannedItems[sku].quantity;
			const quantityInPromotion = rule.boughItemCount;

			// Break down the quantity of scanned item into multiples of quantity of item set in promotion
			// for example if quantity of scanned item is 5 and quantity of item in promotion is 2, the breakdown will be 5 % 2 = 2
			const quantityMultiples = quantity % quantityInPromotion;
			if (quantityMultiples > 0) {
				return {
					applicableRule: rule,
					occurrence: quantityMultiples
				}
			}
		}
	}
	return NOT_APPLICABLE;
}

function apply(applicableRuleInfo) {
	const { rule, occurrence } = applicableRuleInfo;
	return {
		sku: rule.offeredItemSku, // Sku of item offered in promotion
		quantity: rule.offeredItemCount * occurrence, // How many times this promotion is applied
		explanation: `${offeredItemCount} X ${description}` // A user friendly explanation of promotion if needed
	}
}