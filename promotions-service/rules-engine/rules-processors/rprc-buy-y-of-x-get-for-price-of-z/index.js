/**
 * A module for a rule processor for rule type buyYOfXForPriceOfZ
 * exposes
 * (1) the rule type it operates on
 * (2) an assert function to assert the rule,
 * (3) a function to retrieve actions to be applied when rule asserts,
 * (4) a function that applies rule actions when it asserts
 * */
"use strict";

const ruleType = require("../../rule-types").BUY_Y_OF_X_FOR_THE_PRICE_OF_Z;
const { NOT_APPLICABLE } = require("../../constants").STRINGS;
const { validateJsonSchema, schemaIds } = require("../../../../json-schema-validator-service/index.js");
const ERRORS = require("../../errors");

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
 * @param {object} rule rule to evaluation, should be of type buyYOfXForPriceOfZ example rule is
 * {
		id: "69252c48-98a1-4873-a28d-82d320da88c5",
		type: "buyYOfXForPriceOfZ",
		description: "Buy 3 google Homes for the price of 2",
		boughItemSku: "120P90", // Sku of item being bought
		boughItemCount: 3, // quantity of item being bought
		forPriceOfCount: 2, // quantity of item being charged as part of promotion
	}
 */
function assert(context, rule) {
	let result = validateJsonSchema(rule, schemaIds.RULE_TYPE_BUY_Y_OF_X_FOR_THE_PRICE_OF_Z);
	if (!result.isValid) {
		throw Object.assign(ERRORS.INVALID_RULE_TYPE_DEFINITION, {
			details: {
				rule,
				errors: result.errors
			}
		});
	}
	const scannedItems = context.scannedItems;

	// Get scanned items Sku. those Skus will be properties under "scannedItems" object in context
	const skus = Object.getOwnPropertyNames(scannedItems);
	for (let i = 0; i < skus.length; i++) {
		const sku = skus[i];
		if (rule.boughItemSku === sku) {

			// sku quantity in scanned items
			const quantity = scannedItems[sku].quantity;

			// sku price in offer
			const price = scannedItems[sku].price;

			// expected sku quantity in promotion, for promotion to apply
			const quantityInPromotion = rule.boughItemCount;

			// Break down the quantity of scanned item into multiples of quantity of item set in promotion
			// for example if quantity of scanned item is 5 and quantity of item in promotion is 2, the breakdown will be floor(5/2) = 2
			const quantityMultiples = Math.floor(quantity / quantityInPromotion);
			if (quantityMultiples > 0) {

				// the discounted quantity when applying the offer
				const quantityDifference = quantityMultiples * (quantityInPromotion -  rule.forPriceOfCount);
				const unitPrice = parseFloat((price / quantity).toFixed(2));
				const priceReduction = quantityDifference * unitPrice;

				return {
					sku, // Sku of item subject to promotion
					rule: rule,
					occurrence: quantityMultiples,
					originalQuantity: quantity,
					originalPrice: price,
					priceReduction
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
	const {
		sku,
		rule,
		occurrence,
		originalQuantity,
		originalPrice,
		priceReduction
	} = applicableRuleInfo;
	return {
		sku,
		ruleId: rule.id,
		ruleType: rule.type,
		originalQuantity,
		originalPrice,
		priceReduction,
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
 * @param {object} actionsToApply info used to apply rule action
 * format is 
 * {
    ruleId: <string>,
		ruleType: <string>,
		originalQuantity: <number>,
		originalPrice: <number>,
		priceReduction: <number>,
		explanation: <string>
	}
 */
function applyRuleActions(context, actionsToApply) {
	const result = JSON.parse(JSON.stringify(context));
	if (!result.itemsAfterPromotion) {
		result.itemsAfterPromotion = {};
		result.itemsAfterPromotion[actionsToApply.sku] = {
			quantity: actionsToApply.originalQuantity,
			price: parseFloat((actionsToApply.originalPrice - actionsToApply.priceReduction).toFixed(2))
		}
	} else if (result.itemsAfterPromotion[actionsToApply.sku]) {
		result.itemsAfterPromotion[actionsToApply.sku].price =
			parseFloat((result.itemsAfterPromotion[actionsToApply.sku].price - actionsToApply.priceReduction).toFixed(2));
	} else {
		result.itemsAfterPromotion[actionsToApply.sku] = {
			quantity: actionsToApply.originalQuantity,
			price: parseFloat((actionsToApply.originalPrice - actionsToApply.priceReduction).toFixed(2))
		}
	}
	if (result.priceAfterPromotions === undefined || result.priceAfterPromotions === null) {
		result.priceAfterPromotions = parseFloat((actionsToApply.originalPrice - actionsToApply.priceReduction).toFixed(2));
	} else {
		result.priceAfterPromotions = parseFloat((result.priceAfterPromotions - actionsToApply.priceReduction).toFixed(2));
	}
	return result;
}