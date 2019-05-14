"use strict";

let ruleBase = require("./rules-base");
let ruleProcessors = require("./rules-processors").buildRuleProcessors();
const ERRORS = require("./errors");
const { NOT_APPLICABLE } = require("./constants");

module.exports = Object.freeze({
	loadRuleBase,
	loadRuleProcessor,
	applyPromotions,
});

// Dynamically loads for assessment purposes rules base to simulate a change in rule base database
function loadRuleBase() {
	ruleBase = require("./rules-base");
}

// dynamically loads rule processors to allow
// adding new rule type processors on the fly without restarting the app
function loadRuleProcessor() {
	ruleProcessors = require("./rules-processors").buildRuleProcessors();
}


/**
 * Apply all promotions to provided context
 * @param {} context
 * @return {object} an object holding originally scanned items and price,
 * applied promotions and items and price after applying all promotions
 */
function applyPromotions(context) {
	// Check what rules assert for the given context and keep track of identified promotions to be applied
	const promotionsToApply = [];
	for (let i = 0; i < ruleBase.length; i++) {
		// Get current rule
		const rule = ruleBase[i];

		// Get current rule type
		const ruleTypeId = rule.type;

		// Throw an error if rule type processor has not been defined for rule type
		if (!ruleProcessors[ruleTypeId]) {
			throw Object.assign(ERRORS.RULE_TYPE_PROCESSOR_UNDEFINED_FOR_RULE_TYPE, {
				details: {
					rule
				}
			});
		}

		// Get assert, getActionsToApply, applyRuleActions functions for current rule type from rule type processor
		const { assert, getActionsToApply, applyRuleActions } = ruleProcessors[ruleTypeId];

		// Throw an error if assert function not defined for current rule type
		if (!assert) {
			throw Object.assign(ERRORS.ASSERT_UNDEFINED_FOR_RULE_TYPE, {
				details: {
					rule
				}
			});
		}

		// Throw an error if getActionsToApply function not defined for current rule type
		if (!getActionsToApply) {
			throw Object.assign(ERRORS.GET_ACTIONS_TO_APPLY_UNDEFINED_FOR_RULE_TYPE, {
				details: {
					rule
				}
			});
		}

		// Throw an error if applyRuleActions function not defined for current rule type
		if (!applyRuleActions) {
			throw Object.assign(ERRORS.APPLY_RULE_ACTIONS_UNDEFINED_FOR_RULE_TYPE, {
				details: {
					rule
				}
			});
		}

		// If current rule asserts, keep track of identified promotion to be applied later
		/**
		 * NOTE: here the asserted rule actions are not being applied here immediately,
		 * rather I am keeping track of each applied rule since this is built with rule resolution in mind.
		 * If there are conflicting rules, the conflict needs to be resolved and some rules might not end up being applied.
		 * In short words, assert all rules, resolve rule conflict, remove rules not passing conflict, apply actions of rules surviving rules conflict
		 */
		const assertResult = assert(context, rule);
		if ( assertResult !== NOT_APPLICABLE) {
			promotionsToApply.push({
				promotion: getActionsToApply(assertResult),
				applyPromotionFunction: applyRuleActions
			});
		}
	}

	/**
	 * Create a new object to hold information about original scanned items, their total price,
	 * identified promotions and items (and their final prices) after apply the identified promotions
	 */
	let updatedContext = JSON.parse(JSON.stringify(context));
	updatedContext.promotions = [];
	updatedContext.itemsAfterPromotion = JSON.parse(JSON.stringify(context.scannedItems));
	updatedContext.priceAfterPromotions = context.scannedItemsPrice;

	// Apply promotions
	for (let i = 0; i < promotionsToApply.length; i++) {
		const { promotion, applyPromotionFunction } = promotionsToApply[i];
		updatedContext.promotions.push(promotion);
		updatedContext = applyPromotionFunction(updatedContext, promotion);
	}

	return updatedContext;
}
