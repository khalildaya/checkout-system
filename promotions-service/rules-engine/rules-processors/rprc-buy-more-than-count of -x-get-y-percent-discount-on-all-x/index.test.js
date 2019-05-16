"use strict";
const RULE_TYPES = require("../../rule-types");

describe("buyMoreThanCountOfXGetYPercentDiscountOnAllXs rule type processor assert", () => {
	test("Throw an error if rule does not have the correct format", () => {
		const { assert } = require("./index");
		const rule = {
			id: "16cc6b60-e963-4855-bc91-a10020fcdb01",
			type: RULE_TYPES.BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X.id,
			description: "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers",
			boughItemSku: "A304SD", // Sku of item being bought
			boughItemCount: 3, // quantity of item being bought
			//discountPercent: 10, // percent to discount from price of all occurrences of bought item in scope of this promotion
		};

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10,
					price: 4
				},
				"A304SD": {
					quantity: 6,
					price: 60
				},
				"120P90": {
					quantity: 10,
					price: 3
				}
			},
			scannedItemsPrice: 67
		}
		try {
			assert(context, rule);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				"code": "PROMOTRENG7",
				"message": "Invalid rule type definition",
				"statusCode": 500,
				"details": {
					"rule": {
						"id": "16cc6b60-e963-4855-bc91-a10020fcdb01",
						"type": "buyMoreThanCountOfXGetYPercentDiscountOnAllXs",
						"description": "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers",
						"boughItemSku": "A304SD",
						"boughItemCount": 3
					},
					"errors": [{
						"keyword": "required",
						"dataPath": "",
						"schemaPath": "#/required",
						"params": {
							"missingProperty": "discountPercent"
						},
						"message": "should have required property 'discountPercent'"
					}]
				}
			});
		}
	});

	test("Successfully assert a rule, return rule actions to apply and apply those actions", () => {
		const { assert, getActionsToApply, applyRuleActions } = require("./index");
		const rule = {
			id: "16cc6b60-e963-4855-bc91-a10020fcdb01",
			type: RULE_TYPES.BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X.id,
			description: "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers",
			boughItemSku: "A304SD", // Sku of item being bought
			boughItemCount: 3, // quantity of item being bought
			discountPercent: 10, // percent to discount from price of all occurrences of bought item in scope of this promotion
		};

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10,
					price: 4
				},
				"A304SD": {
					quantity: 6,
					price: 60
				},
				"120P90": {
					quantity: 10,
					price: 30
				}
			},
			scannedItemsPrice: 67,
			priceAfterPromotions: 67
		}

		const actionsToApply = getActionsToApply(assert(context, rule));
		const updateContext = applyRuleActions(context, actionsToApply);
		expect(updateContext).toMatchObject({
			"scannedItems": {
				"A304SD": {
					"quantity": 6,
					price: 60
				},
				"43N23P": {
					"quantity": 10,
					price: 4
				},
				"120P90": {
					"quantity": 10,
					price: 30
				}
			},
			"scannedItemsPrice": 67.00,
			"itemsAfterPromotion": {
				"A304SD": {
					"quantity": 6,
					"price": 54
				}
			},
			"priceAfterPromotions": 61.00
		});
	});
});