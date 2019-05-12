"use strict";

module.exports = Object.freeze({
	/**
	 * Example of promotion types covered by rule type BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE
	 * "Each sale of a MacBook Pro comes with a free Raspberry PiB"
	 */
	BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE: {
		id: "buyCountOfXGetCountOfYFree",
		description: "Buy a quantity of an item and get a quantity of another item for free",
		example: "Buy 1 MacBook Pro and get 1 Raspberry PiB free i.e. Each sale of a MacBook Pro comes with a free Raspberry PiB"
	},
	/**
	 * Example of promotion types covered by rule type BUY_COUNT_OF_X_GET_COUNT_OF_Y_FREE
	 * "Buy 3 google Homes for the price of 2"
	 */
	BUY_Y_OF_X_FOR_THE_PRICE_OF_Z: {
		id: "buyYOfXForPriceOfZ",
		description: "Buy a quantity of an item for the price of a less quantity of the same item",
		example: "Buy 3 google Homes for the price of 2"
	},
	/**
	 * Example of promotion types covered by rule type BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X
	 * "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers"
	 */
	BUY_MORE_THAN_COUNT_OF_X_GET_Y_PERCENT_DISCOUNT_ON_ALL_X: {
		id: "buyMoreThanCountOfXGetYPercentDiscountOnAllXs",
		description: "Buy more than a quantity of an item and get a percentage discount for the price of all the same items",
		example: "Buying more than 3 Alexa speakers will have a 10% discount on all Alexa speakers"
	},
});