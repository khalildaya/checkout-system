"use strict";

const { ERROR_PREFIX } = require("./constants").STRINGS;

function createInventoryService() {
	return require("./index.js");
}

describe("getPrices", () => {
	test("Successfully get items prices", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: 10
			},
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			},
			"A304SD": {
				name: "Alexa speaker",
				price: 40,
				quantity: 10
			}
		}
		const items = ["A304SD", "43N23P"];
		inventoryService.__internals__.setInventory(inventory);

		expect(inventoryService.getPrices(items)).toMatchObject({
			"A304SD": 40,
			"43N23P": 300
		})
	});

	test("Throw an error if item not found in inventory", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: 10
			},
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			}
		}
		const items = ["A304SD", "43N23P"];
		inventoryService.__internals__.setInventory(inventory);
		try {
			inventoryService.getPrices(items);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}1`,
				message: "Item not found in inventory",
				statusCode: 404
			});
		}
	});

	test("Throw an error if item price was not defined", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: 10
			},
			"234234": {
				name: "Raspberry PiB",
				quantity: 10
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			},
			"A304SD": {
				name: "Alexa speaker",
				price: 40,
				quantity: 10
			}
		}
		const items = ["A304SD", "43N23P", "234234"];
		inventoryService.__internals__.setInventory(inventory);
		try {
			inventoryService.getPrices(items);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}2`,
				message: "Item price is not defined",
				statusCode: 500,
				details: {
					sku: "234234"
				}
			});
		}
	});
});

describe("updateQuantity", () => {
	test("Successfully update items quantity", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: 10
			},
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			},
			"A304SD": {
				name: "Alexa speaker",
				price: 40,
				quantity: 10
			}
		}
		const quantities = [
			{
				sku: "43N23P",
				quantity: -5
			},
			{
				sku: "234234",
				quantity: 7
			}
		];
		inventoryService.__internals__.setInventory(inventory);

		expect(inventoryService.updateQuantities(quantities)).toMatchObject({
			"234234": 13,
			"43N23P": 5
		})
	});

	test("Throw an error if item not found in inventory", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			}
		}
		const quantities = [
			{
				sku: "43N23P",
				quantity: -5
			},
			{
				sku: "234234",
				quantity: 7
			}
		];
		inventoryService.__internals__.setInventory(inventory);
		try {
			inventoryService.updateQuantities(quantities);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}1`,
				message: "Item not found in inventory",
				statusCode: 404
			});
		}
	});

	test("Throw an error if item is missing a sku in list of items to have their update quantity updated", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: 10
			},
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			}
		}
		const quantities = [
			{
				quantity: -5
			},
			{
				sku: "234234",
				quantity: 7
			}
		];
		inventoryService.__internals__.setInventory(inventory);
		try {
			inventoryService.updateQuantities(quantities);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}5`,
				message: "Missing item sku",
				statusCode: 400,
				details: {
					index: 0
				}
			});
		}
	});

	test("Throw an error if provided item quantity is not defined or not a number", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: 10
			},
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			}
		}
		const quantities = [
			{
				sku: "43N23P",
				quantity: -5
			},
			{
				sku: "234234",
			}
		];
		inventoryService.__internals__.setInventory(inventory);
		try {
			inventoryService.updateQuantities(quantities);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}6`,
				message: "Invalid provided item quantity",
				statusCode: 400,
				details: {
					index: 1
				}
			});
		}
	});

	test("Throw an error if inventory item quantity is not defined or not a number", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: "10"
			},
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			}
		}
		const quantities = [
			{
				sku: "43N23P",
				quantity: -5
			},
			{
				sku: "234234",
				quantity: 8
			}
		];
		inventoryService.__internals__.setInventory(inventory);
		try {
			inventoryService.updateQuantities(quantities);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}3`,
				message: "Invalid item quantity",
				statusCode: 500,
				details: {
					sku: "43N23P"
				}
			});
		}
	});

	test("Throw an error if inventory item quantity will be less than zero in case of a quantity update", () => {
		const inventoryService = createInventoryService();
		const inventory = {
			"43N23P": {
				name: "MacBook Pro",
				price: 300,
				quantity: 10
			},
			"234234": {
				name: "Raspberry PiB",
				price: 10,
				quantity: 6
			},
			"120P90": {
				name: "Google Home",
				price: 30,
				quantity: 10
			}
		}
		const quantities = [
			{
				sku: "43N23P",
				quantity: -11
			},
			{
				sku: "234234",
				quantity: 8
			},
			{
				sku: "120P90",
				quantity: -20
			}
		];
		inventoryService.__internals__.setInventory(inventory);
		try {
			inventoryService.updateQuantities(quantities);

			// This should never execute if the above throws an error as intended
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				code: `${ERROR_PREFIX}4`,
				message: "Item quantity below zero",
				statusCode: 400,
				details: {
					skus: [
						{
							sku:"43N23P",
							newQuantity: -1,
						},
						{
							sku: "120P90",
							newQuantity: -10,
						}
					]
				}
			});
		}
	});
});