"use strict";
const RULE_TYPES = require("./rule-types");

describe("applyPromotions", () => {
	test("Successfully applying promotion type 'buyCountOfXGetCountOfYFree', 'buyYOfXForPriceOfZ'", () => {
		const rulesEngine = require("./index");
		const ruleBase = [
			{
				id: "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
				type: RULE_TYPES.BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE.id,
				description: "Buy 1 MacBook Pro and get 1 Raspberry PiB free",
				boughItemSku: "43N23P", // Sku of item being bought
				boughItemCount: 1, // quantity of item being bought
				offeredItemSku: "234234", // Sku of item offered by promotion
				offeredItemCount: 1, // quantity of item offered by promotion
		},
		{
			id: "69252c48-98a1-4873-a28d-82d320da88c5",
			type: RULE_TYPES.BUY_Y_OF_X_FOR_THE_PRICE_OF_Z.id,
			description: "Buy 3 google Homes for the price of 2",
			boughItemSku: "120P90", // Sku of item being bought
			boughItemCount: 3, // quantity of item being bought
			forPriceOfCount: 2, // quantity of item being charged as part of promotion
		},
		{
			id: "16cc6b60-e963-4855-bc91-a10020fcdb01",
			type: RULE_TYPES.BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X.id,
			description: "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers",
			boughItemSku: "A304SD", // Sku of item being bought
			boughItemCount: 3, // quantity of item being bought
			discountPercent: 10, // percent to discount from price of all occurrences of bought item in scope of this promotion
		}
	];

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
					quantity: 8,
					price: 80
				},
				"A304SD": {
					quantity: 8,
					price: 80
				}
			},
			scannedItemsPrice: 167
		}

		expect(rulesEngine.applyPromotions(context)).toMatchObject({
			"scannedItems": {
				"234234": {
					"quantity": 6,
					"price": 2
				},
				"43N23P": {
					"quantity": 10,
					"price": 5
				},
				"120P90": {
					"quantity": 8,
					"price": 80
				},
				"A304SD": {
					"quantity": 8,
					"price": 80
				}
			},
			"scannedItemsPrice": 167,
			"promotions": [{
				"ruleId": "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
				"ruleType": "buyCountOfXGetCountOfYFree",
				"sku": "234234",
				"quantity": 10,
				"explanation": "10 X Buy 1 MacBook Pro and get 1 Raspberry PiB free"
			}, {
				"sku": "120P90",
				"ruleId": "69252c48-98a1-4873-a28d-82d320da88c5",
				"ruleType": "buyYOfXForPriceOfZ",
				"originalQuantity": 8,
				"originalPrice": 80,
				"priceReduction": 20,
				"explanation": "2 X Buy 3 google Homes for the price of 2"
			}, {
				"sku": "A304SD",
				"ruleId": "16cc6b60-e963-4855-bc91-a10020fcdb01",
				"ruleType": "buyMoreThanCountOfXGetYPercentDiscountOnAllXs",
				"priceReduction": 8,
				"originalPrice": 80,
				"quantity": 8,
				"explanation": "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers"
			}],
			"itemsAfterPromotion": {
				"234234": {
					"quantity": 16,
					"price": 2
				},
				"43N23P": {
					"quantity": 10,
					"price": 5
				},
				"120P90": {
					"quantity": 8,
					"price": 60
				},
				"A304SD": {
					"quantity": 8,
					"price": 72
				}
			},
			"priceAfterPromotions": 139
		});
	});
});