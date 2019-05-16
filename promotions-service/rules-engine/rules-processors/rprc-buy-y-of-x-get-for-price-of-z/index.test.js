"use strict";
const RULE_TYPES = require("../../rule-types");
const { ERROR_PREFIX } = require("../../constants").STRINGS;

describe("buyYOfXForPriceOfZ rule type processor assert", () => {
	test("Throw an error if rule does not have the correct format", () => {
		const { assert } = require("./index");
		const rule = {
			id: "69252c48-98a1-4873-a28d-82d320da88c5",
			type: RULE_TYPES.BUY_Y_OF_X_FOR_THE_PRICE_OF_Z.id,
			description: "Buy 3 google Homes for the price of 2",
			boughItemSku: "120P90", // Sku of item being bought
			//boughItemCount: 3, // quantity of item being bought
			forPriceOfCount: 2, // quantity of item being charged as part of promotion
		};

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10,
					price: 4
				},
				"234234": {
					quantity: 6,
					price: 6
				},
				"120P90": {
					quantity: 10,
					price: 3
				}
			},
			scannedItemsPrice: 13
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
						"id": "69252c48-98a1-4873-a28d-82d320da88c5",
						"type": "buyYOfXForPriceOfZ",
						"description": "Buy 3 google Homes for the price of 2",
						"boughItemSku": "120P90",
						"forPriceOfCount": 2
					},
					"errors": [{
						"keyword": "required",
						"dataPath": "",
						"schemaPath": "#/required",
						"params": {
							"missingProperty": "boughItemCount"
						},
						"message": "should have required property 'boughItemCount'"
					}]
				}
			});
		}
	});

	test("Successfully assert a rule, return rule actions to apply and apply those actions", () => {
		const { assert, getActionsToApply, applyRuleActions } = require("./index");
		const rule = {
			id: "69252c48-98a1-4873-a28d-82d320da88c5",
			type: RULE_TYPES.BUY_Y_OF_X_FOR_THE_PRICE_OF_Z.id,
			description: "Buy 3 google Homes for the price of 2",
			boughItemSku: "120P90", // Sku of item being bought
			boughItemCount: 3, // quantity of item being bought
			forPriceOfCount: 2, // quantity of item being charged as part of promotion
		};

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10,
					price: 4
				},
				"234234": {
					quantity: 6,
					price: 6
				},
				"120P90": {
					quantity: 10,
					price: 30
				}
			},
			scannedItemsPrice: 40.00,
			priceAfterPromotions: 40.00
		}

		const actionsToApply = getActionsToApply(assert(context, rule));
		const updateContext = applyRuleActions(context, actionsToApply);
		expect(updateContext).toMatchObject({
			"scannedItems": {
				"234234": {
					"quantity": 6,
					price: 6
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
			"scannedItemsPrice": 40.00,
			"itemsAfterPromotion": {
				"120P90": {
					"quantity": 10,
					"price": 21
				}
			},
			"priceAfterPromotions": 31.00
		});
	});
});