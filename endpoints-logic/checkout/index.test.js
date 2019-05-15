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
});