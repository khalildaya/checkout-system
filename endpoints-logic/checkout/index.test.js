"use strict";
const { checkout } = require("./index");
const { updateQuantities } = require("../../inventory-service");
const ERROR_PREFIX = "CHKINPUT";

describe("checkout", () => {
	test("Throws an error due to invalid input", () => {
		const input = ["234234", "43N23P", 345];
		try {
			checkout(input);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}1`,
				message: "Invalid input format. Scanned items should be an array",
				statusCode: 400
			});
		}
	});

	test("Throws an error due to item not found in inventory", () => {
		const input = ["234234", "43N23P", "notfound"];
		try {
			checkout(input);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `INVSRVC1`,
				message: "Item not found in inventory",
				statusCode: 404
			},);
		}
	});

	test("Successfully applies promotion 'Buy 1 MacBook Pro and get 1 Raspberry PiB free' when buying 1 MacBook Pro", () => {
		const input = ["43N23P"];
		expect(checkout(input)).toMatchObject({
			"scannedItems": {
				"43N23P": {
					"quantity": 1,
					"price": 5399.99,
					"unitPrice": 5399.99
				}
			},
			"scannedItemsPrice": 5399.99,
			"promotions": [{
				"ruleId": "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
				"ruleType": "buyCountOfXGetCountOfYFree",
				"sku": "234234",
				"quantity": 1,
				"explanation": "1 X Buy 1 MacBook Pro and get 1 Raspberry PiB free"
			}],
			"itemsAfterPromotion": {
				"234234": {
					"quantity": 1,
					"price": 0
				},
				"43N23P": {
					"quantity": 1,
					"price": 5399.99,
					"unitPrice": 5399.99
				}
			},
			"priceAfterPromotions": 5399.99
		});

		// Restore inventory to quantities before test so other tests don't fail due to low inventory levels
		updateQuantities([
			{
				sku: "43N23P",
				quantity: 1
			},
			{
				sku: "234234",
				quantity: 1
			}
		]);
	});

	test("Successfully applies promotion 'Buy 1 MacBook Pro and get 1 Raspberry PiB free' when buying 1 MacBook Pro and 1 Raspberry PiB", () => {
		const input = ["43N23P", "234234"];
		expect(checkout(input)).toMatchObject({
			"scannedItems": {
				"43N23P": {
					"quantity": 1,
					"price": 5399.99,
					"unitPrice": 5399.99
				},
				"234234": {
					"quantity": 1,
					"price": 30,
					"unitPrice": 30
				}
			},
			"scannedItemsPrice": 5429.99,
			"promotions": [{
				"ruleId": "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
				"ruleType": "buyCountOfXGetCountOfYFree",
				"sku": "234234",
				"quantity": 1,
				"explanation": "1 X Buy 1 MacBook Pro and get 1 Raspberry PiB free"
			}],
			"itemsAfterPromotion": {
				"234234": {
					"quantity": 2,
					"price": 30
				},
				"43N23P": {
					"quantity": 1,
					"price": 5399.99,
					"unitPrice": 5399.99
				}
			},
			"priceAfterPromotions": 5429.99
		});

		// Restore inventory to quantities before test so other tests don't fail due to low inventory levels
		updateQuantities([
			{
				sku: "43N23P",
				quantity: 1
			},
			{
				sku: "234234",
				quantity: 2
			}
		]);
	});

	test("Successfully applies all promotions", () => {
		const input = [
			"43N23P",
			"43N23P",
			"120P90",
			"120P90",
			"120P90",
			"A304SD",
			"A304SD",
			"A304SD",
			"A304SD"
		];
		expect(checkout(input)).toMatchObject({
			"scannedItems": {
				"43N23P": {
					"quantity": 2,
					"price": 10799.98,
					"unitPrice": 5399.99
				},
				"120P90": {
					"quantity": 3,
					"price": 149.97,
					"unitPrice": 49.99
				},
				"A304SD": {
					"quantity": 4,
					"price": 438,
					"unitPrice": 109.5
				}
			},
			"scannedItemsPrice": 11387.95,
			"promotions": [{
				"ruleId": "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
				"ruleType": "buyCountOfXGetCountOfYFree",
				"sku": "234234",
				"quantity": 2,
				"explanation": "2 X Buy 1 MacBook Pro and get 1 Raspberry PiB free"
			}, {
				"sku": "120P90",
				"ruleId": "69252c48-98a1-4873-a28d-82d320da88c5",
				"ruleType": "buyYOfXForPriceOfZ",
				"originalQuantity": 3,
				"originalPrice": 149.97,
				"priceReduction": 49.99,
				"explanation": "1 X Buy 3 google Homes for the price of 2"
			}, {
				"sku": "A304SD",
				"ruleId": "16cc6b60-e963-4855-bc91-a10020fcdb01",
				"ruleType": "buyMoreThanCountOfXGetYPercentDiscountOnAllXs",
				"priceReduction": 43.8,
				"originalPrice": 438,
				"quantity": 4,
				"explanation": "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers"
			}],
			"itemsAfterPromotion": {
				"234234": {
					"quantity": 2,
					"price": 0
				},
				"43N23P": {
					"quantity": 2,
					"price": 10799.98,
					"unitPrice": 5399.99
				},
				"120P90": {
					"quantity": 3,
					"price": 99.98,
					"unitPrice": 49.99
				},
				"A304SD": {
					"quantity": 4,
					"price": 394.2,
					"unitPrice": 109.5
				}
			},
			"priceAfterPromotions": 11294.16
		});

		// Restore inventory to quantities before test so other tests don't fail due to low inventory levels
		updateQuantities([
			{
				sku: "43N23P",
				quantity: 2
			},
			{
				sku: "234234",
				quantity: 2
			},
			{
				sku: "120P90",
				quantity: 3
			}
		]);
	});

	test("Throws an error due to negative inventory levels of Raspberry PiB when ordering 3 MackBook Pro and having a promotion applied", () => {
		const input = ["43N23P", "43N23P", "43N23P"];
		try {
			checkout(input);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `INVSRVC4`,
				message: "Item quantity below zero",
				statusCode: 400,
				details: {
					skus: [
						{
							sku:"234234",
							newQuantity: -1,
						}
					]
				}
			});
		}
	});
});