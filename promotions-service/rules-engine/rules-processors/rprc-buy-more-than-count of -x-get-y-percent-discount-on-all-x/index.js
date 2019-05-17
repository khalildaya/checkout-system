/**
 * A module for a rule processor for rule type buyMoreThanCountOfXGetYPercentDiscountOnAllXs
 * exposes
 * (1) the rule type it operates on
 * (2) an assert function to assert the rule,
 * (3) a function to retrieve actions to be applied when rule asserts,
 * (4) a function that applies rule actions when it asserts
 * */
"use strict";

const ruleType = require("../../rule-types").BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X;
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
 * @param {object} rule rule to evaluation, should be of type buyMoreThanCountOfXGetYPercentDiscountOnAllXs example rule is
 * {
		id: "16cc6b60-e963-4855-bc91-a10020fcdb01",
		type: RULE_TYPES.BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X.id,
		description: "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers",
		boughItemSku: "A304SD", // Sku of item being bought
		boughItemCount: 3, // quantity of item being bought
		discountPercent: 10, // percent to discount from price of all occurrences of bought item in scope of this promotion
	}
 */
function assert(context, rule) {
	let result = validateJsonSchema(rule, schemaIds.RULE_TYPE_BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X);
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

			// sku price in scanned items
			const price = scannedItems[sku].price;

			if (quantity >= rule.boughItemCount) {

				const priceReduction = parseFloat((price * rule.discountPercent / 100).toFixed(2));

				return {
					sku, // Sku of item subject to promotion
					rule: rule,
					originalPrice: price,
					priceReduction,
					quantity
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
		originalPrice: <number>,
		priceReduction: <number>,
		quantity: <number>,
		explanation: <string>
	}
 */
function getActionsToApply(applicableRuleInfo) {
	const {
		sku,
		rule,
		originalPrice,
		priceReduction,
		quantity
	} = applicableRuleInfo;
	return {
		sku,
		ruleId: rule.id,
		ruleType: rule.type,
		priceReduction,
		originalPrice,
		quantity,
		explanation: rule.description // A user friendly explanation of promotion, if needed
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
		priceReduction: <number>,
		originalPrice: <number>,
		explanation: <string>
	}
 */
function applyRuleActions(context, actionsToApply) {
	const result = JSON.parse(JSON.stringify(context));
	if (!result.itemsAfterPromotion) {
		result.itemsAfterPromotion = {};
		result.itemsAfterPromotion[actionsToApply.sku] = {
			quantity: actionsToApply.quantity,
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