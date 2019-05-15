"use strict";
const { checkout } = require("./index");
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

	test("Successfully applies promotion to scanned items", () => {
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
	});
});