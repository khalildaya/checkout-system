"use strict";
const RULE_TYPES = require("../../rule-types");
const { ERROR_PREFIX } = require("../../constants").STRINGS;

describe("buyCountOfXGetCountOfYFree rule type processor assert", () => {
	test("Throw an error if rule does not have the correct format", () => {
		const { assert } = require("./index");
		const rule = {
			id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
			type: RULE_TYPES.BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE.id,
			description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
			//boughItemSku: "43N23P",
			boughItemCount: 1, // quantity of item being bought
			offeredItemSku: "234234", // Sku of item offered by promotion
			offeredItemCount: 1, // quantity of item offered by promotion
		};

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10
				},
				"234234": {
					quantity: 6
				},
				"120P90": {
					quantity: 10
				}
			},
			scannedItemsPrice: 0
		}
		try {
			assert(context, rule);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject( {
				"code": ERROR_PREFIX + "7",
				"message": "Invalid rule type definition",
				"statusCode": 500,
				"details": {
					"rule": {
						"id": "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
						"type": "buyCountOfXGetCountOfYFree",
						"description": "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
						"boughItemCount": 1,
						"offeredItemSku": "234234",
						"offeredItemCount": 1
					},
					"errors": [{
						"keyword": "required",
						"dataPath": "",
						"schemaPath": "#/required",
						"params": {
							"missingProperty": "boughItemSku"
						},
						"message": "should have required property 'boughItemSku'"
					}]
				}
			});
		}
	});

	test("Successfully assert a rule, return rule actions to apply and apply those actions", () => {
		const { assert, getActionsToApply, applyRuleActions } = require("./index");
		const rule = {
			id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
			type: RULE_TYPES.BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE.id,
			description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
			boughItemSku: "43N23P",
			boughItemCount: 1, // quantity of item being bought
			offeredItemSku: "234234", // Sku of item offered by promotion
			offeredItemCount: 1, // quantity of item offered by promotion
		};

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10
				},
				"234234": {
					quantity: 6
				},
				"120P90": {
					quantity: 10
				}
			},
			scannedItemsPrice: 0
		}

		const actionsToApply = getActionsToApply(assert(context, rule));
		const updateContext = applyRuleActions(context, actionsToApply);
		expect(updateContext).toMatchObject({
			"scannedItems": {
				"234234": {
					"quantity": 6
				},
				"43N23P": {
					"quantity": 10
				},
				"120P90": {
					"quantity": 10
				}
			},
			"scannedItemsPrice": 0,
			"itemsAfterPromotion": {
				"234234": {
					"quantity": 10,
					"price": 0
				}
			}
		});
	});
});