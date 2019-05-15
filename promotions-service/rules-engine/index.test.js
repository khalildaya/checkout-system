"use strict";
const RULE_TYPES = require("./rule-types");

describe("applyPromotions", () => {
	test("Successfully applying promotion type 'buyCountOfXGetCountOfYFree' for 10 occurrences", () => {
		const rulesEngine = require("./index");
		const ruleBase = [{
			id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
			type: RULE_TYPES.BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE.id,
			description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
			boughItemSku: "43N23P", // Sku of item being bought
			boughItemCount: 1, // quantity of item being bought
			offeredItemSku: "234234", // Sku of item offered by promotion
			offeredItemCount: 1, // quantity of item offered by promotion
		}]

		rulesEngine.__internals__.setRuleBase(ruleBase);

		const context = {
			scannedItems: {
				"43N23P": {
					quantity: 10,
					price: 5
				},
				"234234": {
					quantity: 6,
					price: 2
				},
				"120P90": {
					quantity: 10,
					price: 8
				}
			},
			scannedItemsPrice: 15
		}

		expect(rulesEngine.applyPromotions(context)).toMatchObject({
			"scannedItems": {
				"234234": {
					"quantity": 6,
					price: 2
				},
				"43N23P": {
					"quantity": 10,
					price: 5
				},
				"120P90": {
					"quantity": 10,
					price: 8
				}
			},
			"scannedItemsPrice": 15,
			"promotions": [{
				"ruleId": "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
				"ruleType": "buyCountOfXGetCountOfYFree",
				"sku": "234234",
				"quantity": 10,
				"explanation": "10 X Buy 1 MacBook Pro and get 1 Raspberry PiB free"
			}],
			"itemsAfterPromotion": {
				"234234": {
					"quantity": 16,
					price: 2
				},
				"43N23P": {
					"quantity": 10,
					price: 5
				},
				"120P90": {
					"quantity": 10,
					price: 8
				}
			},
			"priceAfterPromotions": 15
		});
	});
});