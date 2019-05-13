/**
 * A module for a rule processor for rule type buyCountOfXGetCountOfYFree
 * exposes
 * (1) the rule type it operates on
 * (2) an assert function to assert the rule,
 * (3) a function to retrieve actions to be applied when rule asserts,
 * (4) a function that applies rule actions when it asserts
 * */
"use strict";

const ruleType = require("../../rule-types").BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE;

const { NOT_APPLICABLE } = require("../../constants").STRINGS;

module.exports = Object.freeze({
	ruleType: ruleType, // rule type
	assert, // assert rule function
	getActionsToApply, // function to retrieve actions to be applied when rule asserts,
	applyRuleActions // function that applies rule actions when it asserts
});

/**
 * Checks if provided rule applies to a given context
 * @param {object} context is the context passed to promotions service API should be in the format of
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
			// for example if quantity of scanned item is 5 and quantity of item in promotion is 2, the breakdown will be floor(5/2) = 2
			const quantityMultiples = Math.floor(quantity / quantityInPromotion);
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

/**
 * Returns the sku and total quantity of item offered in promotion in addition to description info of the promotion
 * @param {object} applicableRuleInfo object holding asserted rule and how many times the rule was asserted
 * @return {object} info used to apply rule action including sku and total quantity of item offered in promotion in addition to description info of the promotion.
 * format is 
 * {
    ruleId: <string>,
		ruleType: <string>,
		sku: <string>,
		quantity: <number>,
		explanation: <string>
	}
 */
function getActionsToApply(applicableRuleInfo) {
	const { rule, occurrence } = applicableRuleInfo;
	return {
		ruleId: rule.id,
		ruleType: rule.type,
		sku: rule.offeredItemSku, // Sku of item offered in promotion
		quantity: rule.offeredItemCount * occurrence, // How many times this promotion is applied i.e. the total quantity of offered items
		explanation: `${occurrence} X ${rule.description}` // A user friendly explanation of promotion, if needed
	}
}

/**
 * Returns an new context updated with the result of applying rule type
 * @param {object} context updated context after applying promotions.
 * Should be in the format of
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
 *   scannedItemsPrice: <number>,
 *   itemsAfterPromotion: {
 *     "<someSku>": {
 *        quantity: <number>
 *     }
 *   },
 *     "<anotherSku>": {
 *        quantity: <number>
 *     }
 *   }
 *   priceAfterPromotions: <number>,
 * }
 * @param {object} actionsToApply info used to apply rule action including sku and total quantity of item offered in promotion in addition to description info of the promotion.
 * format is 
 * {
    ruleId: <string>,
		ruleType: <string>,
		sku: <string>,
		quantity: <number>,
		explanation: <string>
	}
 */
function applyRuleActions(context, actionsToApply) {
	const result = JSON.parse(JSON.stringify(context));
	if (result.itemsAfterPromotion[actionsToApply.sku]) {
		result.itemsAfterPromotion[actionsToApply.sku].quantity += actionsToApply.quantity;
	} else {
		result.itemsAfterPromotion[actionsToApply.sku] = {
			quantity: actionsToApply.quantity,
			price: 0
		}
	}
	return result;
}