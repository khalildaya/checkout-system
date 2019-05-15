"use strict";
const { checkout } = require("./index");
const { updateQuantities } = require("../../inventory-service");
const ERROR_PREFIX = "CHKINPUT";

describe("validateInput", () => {
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

	test("Successfully applies promotion 'Buy 2 MacBook Pro and get 2 Raspberry PiB free' when buying 2 MacBook Pros", () => {
		const input = ["43N23P", "43N23P"];
		expect(checkout(input)).toMatchObject({
			"scannedItems": {
				"43N23P": {
					"quantity": 2,
					"price": 10799.98,
					"unitPrice": 5399.99
				}
			},
			"scannedItemsPrice": 10799.98,
			"promotions": [{
				"ruleId": "e2cd17c7-e9ff-4345-9064-62c0587b7aaa",
				"ruleType": "buyCountOfXGetCountOfYFree",
				"sku": "234234",
				"quantity": 2,
				"explanation": "2 X Buy 1 MacBook Pro and get 1 Raspberry PiB free"
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
				}
			},
			"priceAfterPromotions": 10799.98
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